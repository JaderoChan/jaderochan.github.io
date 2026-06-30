const GITHUB_USER = 'JaderoChan';
const API = 'https://api.github.com';
const MY_BASE_REPO = 'MyBase';

const myBaseModules = [
  {
    key: 'references',
    icon: '📚',
    zh: '参考资料',
    en: 'References',
    descZh: '收集速查表、对比表与常用知识资料。',
    descEn: 'Collected cheatsheets, comparisons, and frequently reused references.'
  },
  {
    key: 'standards',
    icon: '📏',
    zh: '规范标准',
    en: 'Standards',
    descZh: '个人工程规范、排版准则与内容约束。',
    descEn: 'Personal engineering rules, formatting standards, and content conventions.'
  },
  {
    key: 'skills',
    icon: '🤖',
    zh: 'AI Skills',
    en: 'AI Skills',
    descZh: '给 AI 使用的约束与指引文档。',
    descEn: 'Skill documents used to constrain and guide AI workflows.'
  },
  {
    key: 'templates',
    icon: '📋',
    zh: '模板',
    en: 'Templates',
    descZh: '文件模板与工程脚手架模板。',
    descEn: 'Reusable file templates and project scaffolding templates.'
  },
  {
    key: 'scripts',
    icon: '🔧',
    zh: '脚本',
    en: 'Scripts',
    descZh: '常用自动化脚本与工具脚本。',
    descEn: 'Utility and automation scripts used in day-to-day work.'
  },
  {
    key: 'others',
    icon: '🗂️',
    zh: '其他',
    en: 'Others',
    descZh: '暂不归类但保留的其他内容。',
    descEn: 'Other retained materials that do not belong to the main groups yet.'
  },
  {
    key: 'writings',
    icon: '✍️',
    zh: '文稿随记',
    en: 'Writings',
    descZh: '个人文稿随记',
    descEn: 'Personal writings and notes.',
    virtual: true
  }
];

const state = {
  lang: localStorage.getItem('lang') || 'zh',
  route: parseHashRoute(window.location.hash)
};

let cachedRepoMap = {};
let cachedRepoContentMap = {};
let cachedMyBaseStructure = null;

function parseHashRoute(hash) {
  const cleaned = String(hash || '').replace(/^#/, '').trim();
  if (cleaned === 'my-base/writings') return { detail: 'writings' };
  return { detail: '' };
}

function mergeHeaders(defaultHeaders, customHeaders) {
  return { ...defaultHeaders, ...(customHeaders || {}) };
}

async function apiFetchJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: mergeHeaders({ Accept: 'application/vnd.github+json' }, options.headers)
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function encodeContentPath(path) {
  return String(path || '').split('/').map((part) => encodeURIComponent(part)).join('/');
}

function encodeRepoPath(path) {
  return String(path || '').split('/').filter(Boolean).map((part) => encodeURIComponent(part)).join('/');
}

function sanitizeExternalUrl(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '#';
  } catch {
    return '#';
  }
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function labelForModule(module) {
  return state.lang === 'zh' ? module.zh : module.en;
}

function descForModule(module) {
  return state.lang === 'zh' ? module.descZh : module.descEn;
}

function describeEntryType(entry) {
  const isZh = state.lang === 'zh';
  if (entry.previewType === 'markdown') return isZh ? '文档预览' : 'Markdown Preview';
  if (entry.previewType === 'code') return isZh ? '代码预览' : 'Code Preview';
  if (entry.type === 'dir') return isZh ? '目录' : 'Directory';
  return isZh ? '源码链接' : 'Source Link';
}

function inferPreviewType(entry) {
  if (entry.type !== 'file') return '';
  const lower = entry.name.toLowerCase();
  if (lower.endsWith('.md')) return 'markdown';
  if (
    /\.(bat|sh|txt|json|yaml|yml|toml|ini|cfg|ps1)$/i.test(entry.name) ||
    entry.name === 'CMakeLists.txt' ||
    entry.name === 'LICENSE' ||
    entry.name === '.editorconfig' ||
    entry.name === '.gitattributes' ||
    entry.name === '.gitignore'
  ) {
    return 'code';
  }
  return '';
}

async function getRepoContent(repo, path = '') {
  const cacheKey = `${repo}:${path}`;
  if (cacheKey in cachedRepoContentMap) return cachedRepoContentMap[cacheKey];

  const endpoint = path
    ? `${API}/repos/${GITHUB_USER}/${repo}/contents/${encodeContentPath(path)}`
    : `${API}/repos/${GITHUB_USER}/${repo}/contents`;
  const data = await apiFetchJson(endpoint);
  cachedRepoContentMap[cacheKey] = data;
  return data;
}

async function buildModuleItems(entries) {
  const visibleEntries = entries.filter((entry) => entry && !String(entry.name || '').startsWith('.'));
  const items = await Promise.all(visibleEntries.map(async (entry) => {
    let nestedNames = [];
    let nestedCount = 0;
    if (entry.type === 'dir') {
      const nested = await getRepoContent(MY_BASE_REPO, entry.path);
      if (Array.isArray(nested)) {
        const cleaned = nested.filter((child) => child && !String(child.name || '').startsWith('.'));
        nestedCount = cleaned.length;
        nestedNames = cleaned.slice(0, 6).map((child) => child.name);
      }
    }

    return {
      name: entry.name,
      path: entry.path,
      type: entry.type,
      htmlUrl: entry.html_url || '#',
      previewType: inferPreviewType(entry),
      nestedNames,
      nestedCount
    };
  }));

  return items.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

async function loadMyBaseStructure() {
  if (cachedMyBaseStructure) return cachedMyBaseStructure;

  let repoInfo = cachedRepoMap[MY_BASE_REPO];
  if (!repoInfo) {
    repoInfo = await apiFetchJson(`${API}/repos/${GITHUB_USER}/${MY_BASE_REPO}`);
    if (repoInfo?.name) cachedRepoMap[repoInfo.name] = repoInfo;
  }

  const modules = [];
  for (const module of myBaseModules) {
    if (module.virtual) {
      modules.push({ ...module, items: [] });
      continue;
    }

    const entries = await getRepoContent(MY_BASE_REPO, module.key);
    const items = Array.isArray(entries) ? await buildModuleItems(entries) : [];
    modules.push({
      ...module,
      items,
      htmlUrl: `https://github.com/${GITHUB_USER}/${MY_BASE_REPO}/tree/${encodeURIComponent(repoInfo?.default_branch || 'main')}/${encodeRepoPath(module.key)}`
    });
  }

  cachedMyBaseStructure = { repo: repoInfo, modules };
  return cachedMyBaseStructure;
}

function renderMyBaseItem(item) {
  const nestedHtml = item.nestedNames.length
    ? `<div class="module-item-subitems">${item.nestedNames.map((name) => `<span class="module-subitem">${escapeHtml(name)}</span>`).join('')}</div>`
    : '';
  const nestedBadge = item.nestedCount ? `<span class="badge">${item.nestedCount} ${state.lang === 'zh' ? '项' : 'items'}</span>` : '';

  return `
    <a class="module-item-link" href="${sanitizeExternalUrl(item.htmlUrl)}" target="_blank" rel="noreferrer">
      <div class="module-item-top">
        <span class="module-item-title">${escapeHtml(item.name)}</span>
        <span class="badge">${state.lang === 'zh' ? '前往源码' : 'Open Source'}</span>
      </div>
      <div class="module-item-meta">
        <span class="badge">${escapeHtml(describeEntryType(item))}</span>
        ${nestedBadge}
      </div>
      ${nestedHtml}
    </a>
  `;
}

function renderMyBaseOverview(structure) {
  const isZh = state.lang === 'zh';
  const sourceLabel = isZh ? '查看仓库' : 'Open Repository';
  const moduleCards = structure.modules.map((module) => {
    const cardTitle = labelForModule(module);
    const cardDesc = descForModule(module);
    const countLabel = state.lang === 'zh' ? `${module.items.length} 项` : `${module.items.length} items`;
    const githubLink = module.virtual
      ? `<a href="./base.html#my-base/writings">${isZh ? '打开页面' : 'Open Page'}</a>`
      : `<a href="${sanitizeExternalUrl(module.htmlUrl)}" target="_blank" rel="noreferrer">${sourceLabel}</a>`;
    const itemsHtml = module.virtual
      ? ''
      : (module.items.length
        ? `<div class="module-item-list">${module.items.map(renderMyBaseItem).join('')}</div>`
        : `<p class="readme-loading">${isZh ? '当前分类暂无可展示内容。' : 'No public items are available in this category yet.'}</p>`);

    return `
      <article class="module-card">
        <div class="module-card-header">
          <div>
            <h3 class="module-card-title">${module.icon} ${escapeHtml(cardTitle)}</h3>
            <p class="module-card-desc">${escapeHtml(cardDesc)}</p>
          </div>
          <span class="badge module-card-count">${escapeHtml(countLabel)}</span>
        </div>
        <div class="module-card-links">${githubLink}</div>
        ${itemsHtml}
      </article>
    `;
  }).join('');

  return `<div class="my-base-layout"><div class="module-grid">${moduleCards}</div></div>`;
}

function renderWritingsEmptyState() {
  const isZh = state.lang === 'zh';
  return `
    <div class="my-base-layout">
      <section class="empty-state">
        <div class="breadcrumb">
          <a class="breadcrumb-link" href="./base.html#my-base">${isZh ? '基' : 'Base'}</a>
          <span class="breadcrumb-sep">/</span>
          <span>${isZh ? '文稿随记' : 'Writings'}</span>
        </div>
        <h2>${isZh ? '文稿随记暂时为空' : 'Writings is currently empty'}</h2>
        <p>${isZh ? '当前仅保留该模块入口与独立页面，后续有内容时可继续扩展。' : 'This module currently keeps only its entry and standalone page, and can be expanded later when content is added.'}</p>
        <div class="page-actions">
          <a href="./base.html#my-base">${isZh ? '返回 Base' : 'Back to Base'}</a>
          <a href="https://github.com/JaderoChan/MyBase" target="_blank" rel="noreferrer">GitHub Repo</a>
        </div>
      </section>
    </div>
  `;
}

async function renderMyBaseContent() {
  const container = document.getElementById('myBaseContent');
  if (!container) return;

  container.innerHTML = `<p class="readme-loading">${state.lang === 'zh' ? 'Base 页面加载中...' : 'Loading Base...'}</p>`;

  if (state.route.detail === 'writings') {
    container.innerHTML = renderWritingsEmptyState();
    return;
  }

  const structure = await loadMyBaseStructure();
  container.innerHTML = renderMyBaseOverview(structure);
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.zh').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'en'));
  void renderMyBaseContent();
}

document.getElementById('langBtn').addEventListener('click', () => setLang(state.lang === 'zh' ? 'en' : 'zh'));

window.addEventListener('hashchange', () => {
  state.route = parseHashRoute(window.location.hash);
  void renderMyBaseContent();
});

const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;
document.getElementById('year2').textContent = currentYear;

if (!window.location.hash) {
  window.location.hash = '#my-base';
}

document.documentElement.setAttribute('data-theme', 'dark');
setLang(state.lang);
