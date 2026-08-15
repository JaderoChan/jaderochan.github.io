/* ===== Base page ===== */
const GITHUB_API = 'https://api.github.com';
const BS_PREFIX = 'jadero:base:';

// --- State helpers (sessionStorage) ---
function bGet(key, def) {
  try {
    const v = sessionStorage.getItem(BS_PREFIX + key);
    return v !== null ? JSON.parse(v) : def;
  } catch { return def; }
}
function bSet(key, val) {
  try { sessionStorage.setItem(BS_PREFIX + key, JSON.stringify(val)); } catch {}
}

// --- Language ---
let currentLang = localStorage.getItem('lang') || 'zh';

function applyLang() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.zh').forEach(el => el.classList.toggle('lang-hidden', currentLang !== 'zh'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('lang-hidden', currentLang !== 'en'));
}

function t(zh, en) { return currentLang === 'zh' ? zh : en; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyLang();
  rerenderTranslatedTabs();
}

// --- Utilities ---
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}

async function fetchText(url) {
  try { const r = await fetch(url); return r.ok ? r.text() : null; } catch { return null; }
}

async function fetchJson(url) {
  try { const r = await fetch(url); return r.ok ? r.json() : null; } catch { return null; }
}

function sanitizeRenderedHtml(html) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return '';
  root.querySelectorAll('script,iframe,object,embed,form').forEach(el => el.remove());
  root.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (/^on/i.test(attr.name) || attr.name === 'srcdoc') el.removeAttribute(attr.name);
    });
  });
  root.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#') && !href.startsWith('mailto:')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
    }
  });
  return root.innerHTML;
}

// In-memory and sessionStorage markdown cache
const mdCache = {};

async function renderMarkdown(text) {
  const key = hashText(text);
  if (mdCache[key]) return mdCache[key];
  const ssKey = 'jadero:md:' + key;
  try {
    const stored = sessionStorage.getItem(ssKey);
    if (stored) { mdCache[key] = stored; return stored; }
  } catch {}

  try {
    const r = await fetch(GITHUB_API + '/markdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/html' },
      body: JSON.stringify({ text, mode: 'markdown' })
    });
    if (r.ok) {
      const raw = await r.text();
      const html = sanitizeRenderedHtml(raw);
      mdCache[key] = html;
      try { sessionStorage.setItem(ssKey, html); } catch {}
      return html;
    }
  } catch {}

  const fallback = '<pre><code>' + escapeHtml(text) + '</code></pre>';
  mdCache[key] = fallback;
  return fallback;
}

// File content cache
const fileCache = {};

// --- Tab bar ---
function renderTabBar(barId, tabs, clickHandler, i18n) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  bar.innerHTML = tabs.map(tab => {
    const label = i18n ? (currentLang === 'zh' ? tab.name.zh : tab.name.en) : tab.name;
    return `<button class="base-tab-btn" data-id="${escapeHtml(tab.id)}">${escapeHtml(label)}</button>`;
  }).join('');
  bar.querySelectorAll('.base-tab-btn').forEach(btn =>
    btn.addEventListener('click', () => clickHandler(btn.dataset.id))
  );
}

function setActiveTab(barId, tabId) {
  document.querySelectorAll('#' + barId + ' .base-tab-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.id === tabId)
  );
}

// --- Sidebar ---
function setupSidebar() {
  document.querySelectorAll('.base-sidenav-btn').forEach(btn =>
    btn.addEventListener('click', () => activateSection(btn.dataset.section))
  );
}

function setActiveSidebarBtn(section) {
  document.querySelectorAll('.base-sidenav-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.section === section)
  );
}

// --- Section switching ---
function showSection(section) {
  document.querySelectorAll('.base-section').forEach(el =>
    el.classList.toggle('section-active', el.id === 'section-' + section)
  );
}

async function activateSection(section) {
  bSet('section', section);
  setActiveSidebarBtn(section);
  showSection(section);

  if (section === 'references') await ensureReferences();
  else if (section === 'algorithms') await ensureAlgorithms();
  else if (section === 'others') await ensureOthers();
}

// --- Markdown tab loader helper ---
let _baseScrollTimers = {};
function saveBaseScroll(contentId, tabId) {
  if (!tabId) return;
  const el = document.getElementById(contentId);
  if (el) bSet('scroll:' + contentId + ':' + tabId, el.scrollTop);
}
function bindBaseScroll(contentId, tabId) {
  const el = document.getElementById(contentId);
  if (!el) return;
  el.onscroll = () => {
    clearTimeout(_baseScrollTimers[contentId]);
    _baseScrollTimers[contentId] = setTimeout(() => saveBaseScroll(contentId, tabId), 200);
  };
}

async function loadMarkdownTabContent(tabId, tabs, contentId, cachePrefix, baseUrl) {
  const tab = tabs.find(item => item.id === tabId);
  if (!tab) return;
  const content = document.getElementById(contentId);
  if (!content) return;

  const cacheKey = cachePrefix + ':' + tabId;
  if (fileCache[cacheKey]) {
    content.innerHTML = fileCache[cacheKey];
    content.scrollTop = bGet('scroll:' + contentId + ':' + tabId, 0);
    bindBaseScroll(contentId, tabId);
    return;
  }

  content.innerHTML = '<p class="base-status-text">' + t('加载中...', 'Loading...') + '</p>';
  const text = await fetchText(baseUrl + tab.filename);
  if (text === null) {
    content.innerHTML = '<p class="base-status-text">' + t('加载失败', 'Load failed') + '</p>';
    return;
  }
  const html = await renderMarkdown(text);
  const wrapped = '<div class="md-content">' + html + '</div>';
  fileCache[cacheKey] = wrapped;
  content.innerHTML = wrapped;
  content.scrollTop = bGet('scroll:' + contentId + ':' + tabId, 0);
  bindBaseScroll(contentId, tabId);
}

// --- References ---
let referencesData = null;

async function ensureReferences() {
  if (referencesData) return;
  const data = await fetchJson('./base/references_page.json');
  if (!data || !Array.isArray(data.tabs)) return;
  referencesData = data;

  renderTabBar('references-tabbar', data.tabs, async (id) => {
    saveBaseScroll('references-content', bGet('references.tab', null));
    bSet('references.tab', id);
    setActiveTab('references-tabbar', id);
    await loadMarkdownTabContent(id, referencesData.tabs, 'references-content', 'ref', './base/references/');
  }, true);

  const saved = bGet('references.tab', data.tabs[0] && data.tabs[0].id);
  const activeId = data.tabs.find(tab => tab.id === saved) ? saved : (data.tabs[0] && data.tabs[0].id);
  if (activeId) {
    setActiveTab('references-tabbar', activeId);
    await loadMarkdownTabContent(activeId, referencesData.tabs, 'references-content', 'ref', './base/references/');
  }
}

// --- Others ---
let othersData = null;

async function ensureOthers() {
  if (othersData) return;
  const data = await fetchJson('./base/others_page.json');
  if (!data || !Array.isArray(data.tabs)) return;
  othersData = data;

  renderTabBar('others-tabbar', data.tabs, async (id) => {
    saveBaseScroll('others-content', bGet('others.tab', null));
    bSet('others.tab', id);
    setActiveTab('others-tabbar', id);
    await loadMarkdownTabContent(id, othersData.tabs, 'others-content', 'oth', './base/others/');
  }, true);

  const saved = bGet('others.tab', data.tabs[0] && data.tabs[0].id);
  const activeId = data.tabs.find(tab => tab.id === saved) ? saved : (data.tabs[0] && data.tabs[0].id);
  if (activeId) {
    setActiveTab('others-tabbar', activeId);
    await loadMarkdownTabContent(activeId, othersData.tabs, 'others-content', 'oth', './base/others/');
  }
}

// Update translated tab button labels when lang switches
function rerenderTranslatedTabs() {
  if (referencesData) {
    document.querySelectorAll('#references-tabbar .base-tab-btn').forEach(btn => {
      const tab = referencesData.tabs.find(t => t.id === btn.dataset.id);
      if (tab) btn.textContent = currentLang === 'zh' ? tab.name.zh : tab.name.en;
    });
  }
  if (othersData) {
    document.querySelectorAll('#others-tabbar .base-tab-btn').forEach(btn => {
      const tab = othersData.tabs.find(t => t.id === btn.dataset.id);
      if (tab) btn.textContent = currentLang === 'zh' ? tab.name.zh : tab.name.en;
    });
  }
}

// --- Algorithms ---
let algoData = null;

async function ensureAlgorithms() {
  if (algoData) return;
  const data = await fetchJson('./base/my_algorithms_page.json');
  if (!data || !Array.isArray(data.projects)) return;
  algoData = data;

  const bar = document.getElementById('algorithms-tabbar');
  if (!bar) return;
  bar.innerHTML = data.projects.map(p =>
    `<button class="base-tab-btn" data-id="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`
  ).join('');
  bar.querySelectorAll('.base-tab-btn').forEach(btn =>
    btn.addEventListener('click', () => activateAlgoProject(btn.dataset.id))
  );

  const saved = bGet('algorithms.project', data.projects[0] && data.projects[0].id);
  const activeId = data.projects.find(p => p.id === saved) ? saved : (data.projects[0] && data.projects[0].id);
  if (activeId) {
    setActiveTab('algorithms-tabbar', activeId);
    activateAlgoProject(activeId);
  }
}

function activateAlgoProject(projectId) {
  bSet('algorithms.project', projectId);
  setActiveTab('algorithms-tabbar', projectId);
  const project = algoData && algoData.projects.find(p => p.id === projectId);
  if (!project) return;

  renderFileTree(project.tree, projectId, null, 0);

  const savedFile = bGet('algorithms.' + projectId + '.file', null);
  if (savedFile) {
    // Highlight the previously selected file
    setTimeout(() => {
      const fileEl = document.querySelector('[data-filepath="' + CSS.escape(savedFile) + '"]');
      if (fileEl) fileEl.classList.add('selected');
    }, 0);
    loadCodeFile(savedFile, projectId);
  } else {
    const viewer = document.getElementById('algo-viewer');
    if (viewer) viewer.innerHTML = '<div class="algo-viewer-center">' + t('从左侧选择文件查看', 'Select a file from the left') + '</div>';
  }
}

// SVG constants for file tree icons
function makeChevron(expanded) {
  return '<svg class="tree-icon tree-icon-toggle' + (expanded ? ' open' : '') + '" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,4 10,8 6,12"/></svg>';
}
const SVG_FOLDER = '<svg class="tree-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3.5C1 2.67 1.67 2 2.5 2h4l2 2H13.5c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11C1.67 14 1 13.33 1 12.5v-9z"/></svg>';
const SVG_FILE = '<svg class="tree-icon" viewBox="0 0 14 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1h6l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z"/><path d="M9 1v4h4"/></svg>';

function renderFileTree(nodes, projectId, container, depth) {
  let isRoot = false;
  if (!container) {
    container = document.getElementById('algo-filetree');
    if (!container) return;
    container.innerHTML = '';
    isRoot = true;
    depth = 0;
  }

  nodes.forEach(node => {
    const indent = depth * 16;
    const spacer = indent > 0 ? `<span style="display:inline-block;width:${indent}px;flex-shrink:0"></span>` : '';

    if (node.type === 'dir') {
      const expanded = bGet('algorithms.' + projectId + '.expanded.' + node.path, false);

      const el = document.createElement('div');
      el.className = 'tree-node tree-dir';
      el.innerHTML = spacer + makeChevron(expanded) + SVG_FOLDER + '<span>' + escapeHtml(node.name) + '</span>';

      const childrenEl = document.createElement('div');
      childrenEl.className = 'tree-children';
      if (!expanded) childrenEl.style.display = 'none';
      else if (node.children) renderFileTree(node.children, projectId, childrenEl, depth + 1);

      el.addEventListener('click', e => {
        e.stopPropagation();
        const nowExpanded = childrenEl.style.display === 'none';
        childrenEl.style.display = nowExpanded ? '' : 'none';
        bSet('algorithms.' + projectId + '.expanded.' + node.path, nowExpanded);
        const icon = el.querySelector('.tree-icon-toggle');
        if (icon) icon.classList.toggle('open', nowExpanded);
        if (nowExpanded && node.children && !childrenEl.hasChildNodes()) {
          renderFileTree(node.children, projectId, childrenEl, depth + 1);
        }
      });

      container.appendChild(el);
      container.appendChild(childrenEl);
    } else {
      const el = document.createElement('div');
      el.className = 'tree-node tree-file';
      el.dataset.filepath = node.path;
      const iconSpacer = `<span style="display:inline-block;width:14px;flex-shrink:0"></span>`;
      el.innerHTML = spacer + iconSpacer + SVG_FILE + '<span>' + escapeHtml(node.name) + '</span>';

      el.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('#algo-filetree .tree-file').forEach(f => f.classList.remove('selected'));
        el.classList.add('selected');
        loadCodeFile(node.path, projectId);
      });

      container.appendChild(el);
    }
  });
}

async function loadCodeFile(filePath, projectId) {
  bSet('algorithms.' + projectId + '.file', filePath);
  const viewer = document.getElementById('algo-viewer');
  if (!viewer) return;

  const cacheKey = 'code:' + filePath;
  if (fileCache[cacheKey]) { viewer.innerHTML = fileCache[cacheKey]; return; }

  viewer.innerHTML = '<div class="algo-viewer-center">' + t('加载中...', 'Loading...') + '</div>';

  const text = await fetchText('./base/my_algorithms/' + filePath);
  if (text === null) {
    viewer.innerHTML = '<div class="algo-viewer-center">' + t('加载失败', 'Load failed') + '</div>';
    return;
  }

  const lines = text.split('\n');
  const nums = lines.map((_, i) => i + 1).join('\n');
  const html = '<div class="code-viewer"><div class="code-line-nums">' + escapeHtml(nums) +
    '</div><div class="code-body-wrap"><pre class="code-body">' + escapeHtml(text) + '</pre></div></div>';
  fileCache[cacheKey] = html;
  viewer.innerHTML = html;
}

// --- Layout height adjustment ---
function adjustLayout() {
  const header = document.querySelector('header');
  if (header) {
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--site-header-h', h + 'px');
  }
}

// --- Init ---
function init() {
  adjustLayout();
  window.addEventListener('resize', adjustLayout);
  applyLang();
  setupSidebar();
  const saved = bGet('section', 'references');
  activateSection(saved);
}

document.getElementById('langBtn').addEventListener('click', () => setLang(currentLang === 'zh' ? 'en' : 'zh'));

init();
