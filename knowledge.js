/* ===== Knowledge Notes page ===== */
const KN_PREFIX = 'jadero:kn:';

// --- State helpers (sessionStorage) ---
function kGet(key, def) {
  try {
    const v = sessionStorage.getItem(KN_PREFIX + key);
    return v !== null ? JSON.parse(v) : def;
  } catch { return def; }
}
function kSet(key, val) {
  try { sessionStorage.setItem(KN_PREFIX + key, JSON.stringify(val)); } catch {}
}

// --- Language ---
let currentLang = localStorage.getItem('lang') || 'zh';

function applyLang() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = currentLang === 'zh' ? '頔珞 JaderoChan Website · 知识积累' : 'JaderoChan Website · Knowledge Notes';
  document.querySelectorAll('.zh').forEach(el => el.classList.toggle('lang-hidden', currentLang !== 'zh'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('lang-hidden', currentLang !== 'en'));
}

function t(zh, en) { return currentLang === 'zh' ? zh : en; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyLang();
  rerenderSidebarLabels();
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
  return root.innerHTML;
}

// Markdown cache
const mdCache = {};

async function renderMarkdown(text) {
  const key = hashText(text);
  if (mdCache[key]) return mdCache[key];
  const ssKey = 'jadero:md:' + key;
  try { const s = sessionStorage.getItem(ssKey); if (s) { mdCache[key] = s; return s; } } catch {}

  const raw = typeof marked !== 'undefined'
    ? marked.parse(String(text || ''))
    : '<pre><code>' + escapeHtml(text) + '</code></pre>';
  const html = sanitizeRenderedHtml(raw);
  mdCache[key] = html;
  try { sessionStorage.setItem(ssKey, html); } catch {}
  return html;
}

function renderMath(el) {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
  }
}

// Resolve a relative link href against the current file's path within knowledge_notes/
function resolveKnPath(currentPath, href) {
  const parts = currentPath.split('/');
  parts.pop();
  const rel = href.startsWith('/') ? href.replace(/^\/+/, '').split('/') : [...parts, ...href.split('/')];
  const resolved = [];
  for (const seg of rel) {
    if (!seg || seg === '.') continue;
    if (seg === '..') { if (resolved.length) resolved.pop(); continue; }
    resolved.push(seg);
  }
  return resolved.join('/');
}

// --- Data ---
let pages = [];
let navStack = []; // navStack[0] = root sidebar page path; navStack[1..] = linked file paths

// --- Back button ---
const backFab = document.getElementById('back-fab');

function updateBackButton() {
  if (backFab) backFab.classList.toggle('visible', navStack.length > 1);
}

if (backFab) {
  backFab.addEventListener('click', () => {
    if (navStack.length > 1) {
      navStack.pop();
      kSet('navStack', navStack);
      updateBackButton();
      syncSidebarHighlight();
      displayFile(navStack[navStack.length - 1], false);
    }
  });
}

// --- Sidebar ---
function renderSidebar() {
  const sidebar = document.getElementById('kn-sidebar');
  if (!sidebar || !pages.length) return;
  sidebar.innerHTML = pages.map((page, i) => {
    const name = currentLang === 'zh' ? page.page_name.zh : page.page_name.en;
    return `<button class="kn-page-btn" data-index="${i}">${escapeHtml(name)}</button>`;
  }).join('');

  sidebar.querySelectorAll('.kn-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const page = pages[idx];
      if (!page) return;
      navStack = [page.filepath];
      kSet('navStack', navStack);
      updateBackButton();
      syncSidebarHighlight();
      displayFile(page.filepath, false);
    });
  });
}

function rerenderSidebarLabels() {
  document.querySelectorAll('#kn-sidebar .kn-page-btn').forEach((btn, i) => {
    const page = pages[i];
    if (page) btn.textContent = currentLang === 'zh' ? page.page_name.zh : page.page_name.en;
  });
}

function syncSidebarHighlight() {
  const rootPath = navStack.length > 0 ? navStack[0] : null;
  const idx = pages.findIndex(p => p.filepath === rootPath);
  document.querySelectorAll('#kn-sidebar .kn-page-btn').forEach((btn, i) =>
    btn.classList.toggle('active', i === idx)
  );
}

// --- Content display ---
const renderedPageCache = {};

// Scroll position helpers
let _scrollSaveTimer = null;
function saveScrollPos(filepath) {
  const content = document.getElementById('kn-content');
  if (content) kSet('scroll:' + filepath, content.scrollTop);
}
function _applyScrollAfterLoad(el, target) {
  if (!target) return;
  // generation counter: invalidates stale rAF/image-load callbacks after navigation
  const gen = (el._scrollGen = ((el._scrollGen || 0) + 1));
  const apply = () => { if (el._scrollGen === gen) el.scrollTop = target; };
  const imgs = [...el.querySelectorAll('img')].filter(img => !img.complete);
  if (!imgs.length) { requestAnimationFrame(apply); return; }
  let n = imgs.length;
  const done = () => { if (--n === 0) apply(); };
  imgs.forEach(img => { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); });
}
function restoreScrollPos(filepath) {
  const content = document.getElementById('kn-content');
  if (!content) return;
  _applyScrollAfterLoad(content, kGet('scroll:' + filepath, 0));
}
function bindScrollSave(filepath) {
  const content = document.getElementById('kn-content');
  if (!content) return;
  content.onscroll = () => {
    clearTimeout(_scrollSaveTimer);
    _scrollSaveTimer = setTimeout(() => saveScrollPos(filepath), 200);
  };
}

let _currentFilepath = null;

async function displayFile(filepath, pushToStack) {
  // Save current scroll position before switching
  if (_currentFilepath && _currentFilepath !== filepath) {
    saveScrollPos(_currentFilepath);
  }

  if (pushToStack) {
    navStack.push(filepath);
    kSet('navStack', navStack);
    updateBackButton();
    syncSidebarHighlight();
  }

  _currentFilepath = filepath;
  const content = document.getElementById('kn-content');
  if (!content) return;

  if (renderedPageCache[filepath]) {
    content.innerHTML = renderedPageCache[filepath];
    bindInternalLinks(content, filepath);
    renderMath(content);
    restoreScrollPos(filepath);
    bindScrollSave(filepath);
    return;
  }

  content.innerHTML = '<div class="kn-placeholder">' + t('加载中...', 'Loading...') + '</div>';

  const text = await fetchText('./knowledge_notes/' + filepath);
  if (_currentFilepath !== filepath) return;
  if (text === null) {
    content.innerHTML = '<div class="kn-placeholder">' + t('加载失败', 'Load failed') + '</div>';
    return;
  }

  const html = await renderMarkdown(text);
  if (_currentFilepath !== filepath) return;
  const wrapped = '<div class="md-content">' + html + '</div>';
  renderedPageCache[filepath] = wrapped;
  content.innerHTML = wrapped;
  bindInternalLinks(content, filepath);
  renderMath(content);
  restoreScrollPos(filepath);
  bindScrollSave(filepath);
}

function bindInternalLinks(container, currentFilepath) {
  container.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    // Anchor-only links: leave as-is
    if (href.startsWith('#')) return;
    // Absolute URLs: open in new tab
    if (/^[a-z][a-z\d+\-.]*:/i.test(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
      return;
    }
    // Relative .md file links: intercept and load internally
    const pathPart = href.split('#')[0];
    if (pathPart.toLowerCase().endsWith('.md')) {
      a.addEventListener('click', async e => {
        e.preventDefault();
        const resolved = resolveKnPath(currentFilepath, pathPart);
        // Try to fetch to verify existence before navigating
        try {
          const check = await fetch('./knowledge_notes/' + resolved);
          if (!check.ok) return; // do nothing if not found
        } catch { return; }
        displayFile(resolved, true);
      });
    } else {
      // Other relative links: open in new tab
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
    }
  });
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
async function init() {
  adjustLayout();
  window.addEventListener('resize', adjustLayout);
  applyLang();

  const data = await (async () => {
    try {
      const r = await fetch('./knowledge_notes/pages.json');
      return r.ok ? r.json() : null;
    } catch { return null; }
  })();

  if (!Array.isArray(data) || !data.length) {
    const content = document.getElementById('kn-content');
    if (content) content.innerHTML = '<div class="kn-placeholder">' + t('暂无内容', 'No content') + '</div>';
    return;
  }

  pages = data;
  renderSidebar();

  // Restore navStack from session
  const savedStack = kGet('navStack', null);
  if (Array.isArray(savedStack) && savedStack.length > 0) {
    navStack = savedStack;
  } else {
    navStack = [pages[0].filepath];
  }

  updateBackButton();
  syncSidebarHighlight();
  await displayFile(navStack[navStack.length - 1], false);
}

document.getElementById('langBtn').addEventListener('click', () => setLang(currentLang === 'zh' ? 'en' : 'zh'));

init();
