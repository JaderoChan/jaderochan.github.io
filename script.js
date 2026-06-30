const GITHUB_USER = 'JaderoChan';
const CONTACT_EMAIL = 'c_dl_cn@outlook.com';
const API = 'https://api.github.com';
const MY_BASE_REPO = 'MyBase';
const README_PATH_CANDIDATES = {
  zh: ['README_ZH.md', 'doc/README_ZH.md', 'docs/README_ZH.md'],
  en: ['README_EN.md', 'doc/README_EN.md', 'docs/README_EN.md'],
  fallback: ['README.md']
};

const featuredProjects = [
  {
    display: 'HID Tool',
    repo: 'hidtool',
    url: 'https://github.com/JaderoChan/hidtool',
    lang: 'C++',
    zh: '跨平台 HID 输入库，覆盖键盘/鼠标监听与模拟，支持 Windows、macOS、Linux；提供线程安全单例设计、静态/动态库构建、以及 C 与 Python 绑定，适合自动化与系统级输入控制场景。仓库同时包含示例与接口边界设计，便于按模块接入现有桌面端或工具链项目，并支持后续扩展更多输入设备适配能力。',
    en: 'A cross-platform HID input library for keyboard/mouse event listening and simulation across Windows, macOS, and Linux, with thread-safe singleton modules, static/shared build options, and C/Python bindings for automation and system-level input workflows. The repository also includes integration-oriented interface boundaries and examples for easier adoption in existing desktop and tooling stacks, with room for future extension to broader device adaptation.',
    screenshot: null
  },
  {
    display: 'Global Hotkey',
    repo: 'global_hotkey',
    url: 'https://github.com/JaderoChan/global_hotkey',
    lang: 'C++',
    zh: '独立全局热键库，提供 Register 与 Hook 两类管理器，支持控制台与 GUI 程序并兼容 Windows/macOS/Linux；可配合 C/Python 绑定使用，适用于跨平台快捷键服务、事件分发与应用级热键集成。项目将平台差异封装在统一接口下，方便构建可扩展的快捷键系统，并降低多平台维护时的接口分裂成本。',
    en: 'An independent global hotkey library with both register-based and hook-based managers, designed for console and GUI applications on Windows/macOS/Linux, with C/Python bindings for cross-platform shortcut services and event-driven integrations. It encapsulates platform differences behind a unified API so hotkey systems can scale with fewer platform-specific branches and lower long-term multi-platform maintenance costs.',
    screenshot: null
  },
  {
    display: 'MC NBT',
    repo: 'mcnbt',
    url: 'https://github.com/JaderoChan/mcnbt',
    lang: 'C++',
    zh: '面向 Minecraft NBT 的高性能 Header-only 读写库，支持 Java/基岩版字节序、SNBT 与 gzip 解压流程，并提供便捷 Tag 构造与结构化编辑接口，适合地图工具与数据处理项目直接嵌入。仓库强调零侵入集成与清晰数据模型，便于快速开发编辑器或批处理工具，也适合在现有服务中作为独立 NBT 处理模块复用。',
    en: 'A high-performance header-only library for Minecraft NBT parsing and writing, supporting Java/Bedrock endianness, SNBT, and gzip workflows, with convenient tag construction and editing APIs for map tools and data-processing pipelines. The design emphasizes low-friction embedding and a clear data model for quickly building editors and batch processing utilities, and it can also be reused as a standalone NBT module in existing services.',
    screenshot: null
  },
  {
    display: 'BPNN',
    repo: 'BPNN',
    url: 'https://github.com/JaderoChan/BPNN',
    lang: 'C',
    zh: '纯 C99 实现的三层全连接 BP 神经网络学习项目，内置多种激活函数与损失函数，支持训练回调、参数持久化与推理流程；配套 MNIST 手写数字识别示例在 50 轮训练后可达约 98% 准确率。代码结构按教学与实验复现组织，便于理解反向传播细节并扩展更多网络实验，同时可直接作为轻量神经网络实验脚手架使用。',
    en: 'A pure C99 three-layer backpropagation neural network project for learning fundamentals, featuring multiple activation/loss functions, train callbacks, parameter persistence, and inference APIs, plus an MNIST digit recognizer example reaching around 98% accuracy after 50 epochs. The code organization is designed for study and reproducible experiments, making it easier to inspect and extend core backpropagation steps while also serving as a lightweight NN experiment scaffold.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/BPNN/main/example/digit_recognizer/images/predict_result.png'
  },
  {
    display: 'Taylor Series Compute Log',
    repo: 'Taylor-Series-compute-log',
    url: 'https://github.com/JaderoChan/Taylor-Series-compute-log',
    lang: 'C',
    zh: '以泰勒级数实现 ln() 计算的数学与工程练习项目，不依赖标准数学库，结合浮点表示分解与参数标准化策略（如 2/3、√2/2 缩放）提升数值精度，并附带精度/性能对比实验。项目完整展示从公式推导到工程实现的路径，适合用于数值方法学习与性能验证，也便于对比不同优化策略在误差与速度上的权衡。',
    en: 'A mathematical and engineering practice project implementing ln() via Taylor series without relying on the standard math library, combining floating-point decomposition and normalization strategies (e.g., 2/3 and √2/2 scaling) to improve precision, with benchmark comparisons included. It demonstrates an end-to-end path from formula reasoning to practical implementation for numerical-method learning and performance validation, including trade-off analysis across optimization strategies.',
    screenshot: null
  },
  {
    display: 'Content Aware Image Crop',
    repo: 'ContentAwareImageCrop',
    url: 'https://github.com/JaderoChan/ContentAwareImageCrop',
    lang: 'C++',
    zh: '基于接缝雕刻（Seam Carving）的内容感知图像裁切工具，包含后端动态规划算法库与 Qt 前端，支持能量图可视化、接缝高亮、实时进度、撤销重做与多语言界面，面向可交互图像处理流程。仓库提供完整桌面交互链路，适合展示算法可视化与工程化 UI 的结合，并可用于验证不同裁切策略下的视觉保真效果。',
    en: 'A seam-carving-based content-aware image cropping application with a dynamic-programming backend and Qt frontend, supporting energy-map visualization, seam highlighting, real-time progress, undo/redo, and bilingual UI for interactive image-processing workflows. It delivers a complete desktop interaction flow and showcases how algorithm visualization can be integrated with production-style UI design, while enabling evaluation of visual fidelity under different carving strategies.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/ContentAwareImageCrop/main/screenshot/sufer_cropped.png'
  },
  {
    display: 'Easy Links',
    repo: 'EasyLinks',
    url: 'https://github.com/JaderoChan/EasyLinks',
    lang: 'C++',
    zh: '桌面链接管理工具，支持符号链接、硬链接与 Pattern Link 批量策略，结合 GUI 与全局热键实现“复制-定位-一键链接”流程，并提供冲突处理、Review 预审与重命名模板等工程化能力。项目关注高频文件整理场景，强调批处理效率与可回溯操作体验，并兼顾复杂目录场景下的批量安全性。',
    en: 'A desktop link-management tool supporting symbolic links, hard links, and Pattern Link batch workflows, combining GUI and global hotkeys for copy-target-fast-link operations, with conflict handling, review-stage filtering, and naming-template customization. It targets high-frequency file organization work and emphasizes both batch efficiency and traceable operations, while preserving safety in large and complex directory structures.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/EasyLinks/main/doc/screenshots/progress_dialog_en.png'
  },
  {
    display: 'Open CMD Anywhere',
    repo: 'OpenCmdAnywhere',
    url: 'https://github.com/JaderoChan/OpenCmdAnywhere',
    lang: 'C++',
    zh: '快捷键驱动的命令行启动工具，可按前台窗口上下文或文件管理器目录快速打开终端，减少右键层级操作；基于 Qt 界面并结合 global_hotkey 与 easy_translate，适合日常开发效率场景。它面向高频终端切换需求，可与现有工作流配合形成更顺滑的开发入口，并支持进一步扩展自定义启动规则。',
    en: 'A hotkey-driven command launcher that opens terminals directly from the active window context or file-manager directory to reduce right-click friction, built with Qt and integrated with global_hotkey and easy_translate for daily development productivity. It is designed for frequent terminal-switch workflows and fits naturally into existing development habits, with extensibility for custom launch rules.',
    screenshot: null
  }
];

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
    descZh: '当前只保留入口，页面会提示内容暂为空。',
    descEn: 'Currently kept as an entry only, with an empty-state page for now.',
    virtual: true
  }
];

const myBaseModuleMap = Object.fromEntries(myBaseModules.map((module) => [module.key, module]));

const state = {
  lang: localStorage.getItem('lang') || 'zh',
  theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  route: parseHashRoute(window.location.hash),
  myBasePreviewItem: null
};

let cachedUser = null;
let cachedRepoMap = {};
let cachedCommits = {};
let cachedReleases = {};
let cachedLastYearCommits = null;
let cachedReadmePathMap = {};
let cachedReadmeDocMap = {};
let cachedRenderedMarkdownMap = {};
let cachedRepoContentMap = {};
let cachedMyBaseStructure = null;
let cachedMyBaseOverviewHtmlMap = {};

function parseHashRoute(hash) {
  const cleaned = String(hash || '').replace(/^#/, '').trim();
  if (!cleaned || cleaned === 'home') return { page: 'home', detail: '' };
  if (cleaned === 'my-base') return { page: 'my-base', detail: '' };
  if (cleaned.startsWith('my-base/')) {
    return {
      page: 'my-base',
      detail: decodeURIComponent(cleaned.slice('my-base/'.length))
    };
  }
  return { page: 'home', detail: '' };
}

function routeToHash(route) {
  if (route.page === 'my-base' && route.detail) return `#my-base/${encodeURIComponent(route.detail)}`;
  if (route.page === 'my-base') return '#my-base';
  return '#home';
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
    if (!response.ok) {
      console.warn('GitHub JSON fetch failed:', response.status, url);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn('GitHub JSON fetch error:', url, error);
    return null;
  }
}

async function apiFetchText(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.warn('Text fetch failed:', response.status, url);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.warn('Text fetch error:', url, error);
    return null;
  }
}

async function getCommitCount(repo) {
  try {
    const response = await fetch(`${API}/repos/${GITHUB_USER}/${repo}/commits?per_page=1`);
    if (!response.ok) return null;
    const link = response.headers.get('Link');
    if (!link) {
      const data = await response.json();
      return Array.isArray(data) ? data.length : null;
    }
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    return match ? parseInt(match[1], 10) : 1;
  } catch {
    return null;
  }
}

async function getLastYearCommitCount() {
  try {
    const now = new Date();
    const targetYear = now.getUTCFullYear() - 1;
    const targetMonth = now.getUTCMonth();
    const targetDay = now.getUTCDate();
    const maxDayInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    const safeDay = Math.min(targetDay, maxDayInTargetMonth);
    const sinceDate = new Date(Date.UTC(targetYear, targetMonth, safeDay)).toISOString().slice(0, 10);
    const query = encodeURIComponent(`author:${GITHUB_USER} committer-date:>=${sinceDate}`);
    const response = await fetch(`${API}/search/commits?q=${query}&per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data?.total_count === 'number' ? data.total_count : null;
  } catch {
    return null;
  }
}

function fmt(value) {
  if (value === null || value === undefined) return '—';
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodeContentPath(path) {
  return String(path || '').split('/').map((part) => encodeURIComponent(part)).join('/');
}

function encodeRepoPath(path) {
  return String(path || '').split('/').filter(Boolean).map((part) => encodeURIComponent(part)).join('/');
}

function decodeBase64Utf8(base64) {
  try {
    const clean = String(base64 || '').replace(/\n/g, '');
    const binary = atob(clean);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return '';
  }
}

function normalizeRepoPath(path) {
  return String(path || '').replace(/^\/+/, '').toLowerCase();
}

function pickPreferredReadmePath(paths, lang) {
  if (!Array.isArray(paths) || !paths.length) return null;

  const pathMap = new Map(paths.map((path) => [normalizeRepoPath(path), path]));
  const orderedCandidates = lang === 'zh'
    ? [...README_PATH_CANDIDATES.zh, ...README_PATH_CANDIDATES.en, ...README_PATH_CANDIDATES.fallback]
    : [...README_PATH_CANDIDATES.en, ...README_PATH_CANDIDATES.zh, ...README_PATH_CANDIDATES.fallback];

  for (const candidate of orderedCandidates) {
    const matched = pathMap.get(normalizeRepoPath(candidate));
    if (matched) return matched;
  }

  return paths.find((path) => /^readme(\..+)?$/i.test((path.split('/').pop() || '').trim())) || null;
}

function isFallbackReadmePath(path) {
  return README_PATH_CANDIDATES.fallback.some((candidate) => normalizeRepoPath(candidate) === normalizeRepoPath(path));
}

function splitTargetSuffix(target) {
  const queryIndex = target.indexOf('?');
  const hashIndex = target.indexOf('#');
  const indexes = [queryIndex, hashIndex].filter((value) => value >= 0);
  const cutIndex = indexes.length ? Math.min(...indexes) : -1;
  return cutIndex >= 0
    ? { pathPart: target.slice(0, cutIndex), suffix: target.slice(cutIndex) }
    : { pathPart: target, suffix: '' };
}

function isAbsoluteUrl(target) {
  return /^[a-z][a-z\d+\-.]*:/i.test(target);
}

function sanitizeExternalUrl(url, allowMail = true) {
  if (!url) return '#';
  try {
    const parsed = new URL(url, window.location.origin);
    const protocols = allowMail ? ['http:', 'https:', 'mailto:', 'tel:'] : ['http:', 'https:'];
    return protocols.includes(parsed.protocol) ? parsed.toString() : '#';
  } catch {
    return '#';
  }
}

function resolveRepoRelativePath(basePath, targetPath) {
  const sourceParts = String(basePath || '').split('/');
  sourceParts.pop();

  const rawParts = targetPath.startsWith('/')
    ? targetPath.replace(/^\/+/, '').split('/')
    : [...sourceParts, ...targetPath.split('/')];

  const resolvedParts = [];
  for (const part of rawParts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (resolvedParts.length) resolvedParts.pop();
      continue;
    }
    resolvedParts.push(part);
  }
  return resolvedParts.join('/');
}

function extractBranchFromHtmlUrl(htmlUrl, repo) {
  const match = String(htmlUrl || '').match(/\/blob\/([^/]+)\//);
  return match ? decodeURIComponent(match[1]) : (cachedRepoMap[repo]?.default_branch || 'main');
}

function rewriteRenderedMarkdownUrls(html, repo, doc) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html || ''}</div>`, 'text/html');
  const wrapper = parsed.body.firstElementChild;
  if (!wrapper) return '';

  const branch = extractBranchFromHtmlUrl(doc.htmlUrl, repo);
  const currentPath = doc.path;

  wrapper.querySelectorAll('script, iframe, object, embed, form').forEach((element) => element.remove());
  wrapper.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      if (/^on/i.test(attribute.name) || attribute.name === 'srcdoc') {
        element.removeAttribute(attribute.name);
      }
    });
  });

  wrapper.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href) return;
    if (href.startsWith('#')) return;
    if (isAbsoluteUrl(href)) {
      link.setAttribute('href', sanitizeExternalUrl(href, true));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer');
      return;
    }

    const { pathPart, suffix } = splitTargetSuffix(href);
    const resolvedPath = resolveRepoRelativePath(currentPath, pathPart);
    const safeHref = `https://github.com/${GITHUB_USER}/${repo}/blob/${encodeURIComponent(branch)}/${encodeRepoPath(resolvedPath)}${suffix}`;
    link.setAttribute('href', safeHref);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer');
  });

  wrapper.querySelectorAll('img[src]').forEach((image) => {
    const src = image.getAttribute('src') || '';
    if (!src) return;
    if (isAbsoluteUrl(src)) {
      image.setAttribute('src', sanitizeExternalUrl(src, false));
      return;
    }

    const { pathPart, suffix } = splitTargetSuffix(src);
    const resolvedPath = resolveRepoRelativePath(currentPath, pathPart);
    const safeSrc = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/${encodeURIComponent(branch)}/${encodeRepoPath(resolvedPath)}${suffix}`;
    image.setAttribute('src', safeSrc);
  });

  return wrapper.innerHTML;
}

async function renderGitHubMarkdown(markdown, repo, doc) {
  const cacheKey = `${state.lang}:${repo}:${doc.path}:${doc.sha || String(markdown || '')}`;
  if (cacheKey in cachedRenderedMarkdownMap) return cachedRenderedMarkdownMap[cacheKey];

  const rendered = await apiFetchText(`${API}/markdown`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/html'
    },
    body: JSON.stringify({
      text: String(markdown || ''),
      mode: 'gfm',
      context: `${GITHUB_USER}/${repo}`
    })
  });

  if (!rendered) {
    cachedRenderedMarkdownMap[cacheKey] = `<pre><code>${escapeHtml(markdown)}</code></pre>`;
    return cachedRenderedMarkdownMap[cacheKey];
  }

  cachedRenderedMarkdownMap[cacheKey] = rewriteRenderedMarkdownUrls(rendered, repo, doc);
  return cachedRenderedMarkdownMap[cacheKey];
}

async function resolveReadmePath(repo, lang) {
  const cacheKey = `${repo}:${lang}`;
  if (cacheKey in cachedReadmePathMap) return cachedReadmePathMap[cacheKey];

  const readmePaths = [];
  for (const dir of ['', 'doc', 'docs']) {
    const suffix = dir ? `/${encodeContentPath(dir)}` : '';
    const entries = await apiFetchJson(`${API}/repos/${GITHUB_USER}/${repo}/contents${suffix}`);
    if (!Array.isArray(entries)) continue;

    entries
      .filter((item) => item?.type === 'file' && /^readme(\..+)?$/i.test(item.name || ''))
      .forEach((item) => {
        if (item.path) readmePaths.push(item.path);
      });

    const preferred = pickPreferredReadmePath(readmePaths, lang);
    if (preferred && (dir !== '' || !isFallbackReadmePath(preferred))) break;
  }

  const preferredPath = pickPreferredReadmePath(readmePaths, lang);
  if (preferredPath) {
    cachedReadmePathMap[cacheKey] = { path: preferredPath, htmlUrl: null };
    return cachedReadmePathMap[cacheKey];
  }

  const defaultReadme = await apiFetchJson(`${API}/repos/${GITHUB_USER}/${repo}/readme`);
  if (defaultReadme?.type === 'file' && defaultReadme?.path) {
    cachedReadmePathMap[cacheKey] = {
      path: defaultReadme.path,
      htmlUrl: defaultReadme.html_url || null
    };
    return cachedReadmePathMap[cacheKey];
  }

  cachedReadmePathMap[cacheKey] = null;
  return null;
}

async function getReadmeDoc(repo, lang) {
  const cacheKey = `${repo}:${lang}`;
  if (cacheKey in cachedReadmeDocMap) return cachedReadmeDocMap[cacheKey];

  const readmePath = await resolveReadmePath(repo, lang);
  if (!readmePath) {
    cachedReadmeDocMap[cacheKey] = null;
    return null;
  }

  const data = await apiFetchJson(`${API}/repos/${GITHUB_USER}/${repo}/contents/${encodeContentPath(readmePath.path)}`);
  if (!data?.content) {
    cachedReadmeDocMap[cacheKey] = null;
    return null;
  }

  cachedReadmeDocMap[cacheKey] = {
    repo,
    markdown: decodeBase64Utf8(data.content),
    htmlUrl: data.html_url || readmePath.htmlUrl,
    path: readmePath.path,
    sha: data.sha || ''
  };
  return cachedReadmeDocMap[cacheKey];
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

async function getLatestReleaseTag(repo) {
  const data = await apiFetchJson(`${API}/repos/${GITHUB_USER}/${repo}/releases/latest`);
  return data?.tag_name || null;
}

function labelForModule(module) {
  return state.lang === 'zh' ? module.zh : module.en;
}

function descForModule(module) {
  return state.lang === 'zh' ? module.descZh : module.descEn;
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString(state.lang === 'zh' ? 'zh-CN' : 'en-US');
  } catch {
    return '—';
  }
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

async function loadMyBaseOverviewHtml() {
  const cacheKey = state.lang;
  if (cacheKey in cachedMyBaseOverviewHtmlMap) return cachedMyBaseOverviewHtmlMap[cacheKey];
  const readmeDoc = await getReadmeDoc(MY_BASE_REPO, state.lang);
  if (!readmeDoc) {
    cachedMyBaseOverviewHtmlMap[cacheKey] = '';
    return cachedMyBaseOverviewHtmlMap[cacheKey];
  }
  cachedMyBaseOverviewHtmlMap[cacheKey] = await renderGitHubMarkdown(readmeDoc.markdown, MY_BASE_REPO, readmeDoc);
  return cachedMyBaseOverviewHtmlMap[cacheKey];
}

function renderStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;

  const isZh = state.lang === 'zh';
  const totalStars = featuredProjects.reduce((sum, project) => sum + (cachedRepoMap[project.repo]?.stargazers_count || 0), 0);
  const totalForks = featuredProjects.reduce((sum, project) => sum + (cachedRepoMap[project.repo]?.forks_count || 0), 0);

  const tiles = [
    { icon: '📦', val: fmt(cachedUser?.public_repos), label: isZh ? '公开仓库' : 'Public Repos' },
    { icon: '🧑‍🤝‍🧑', val: fmt(cachedUser?.followers), label: isZh ? '关注者' : 'Followers' },
    { icon: '📅', val: fmt(cachedLastYearCommits), label: isZh ? '近一年提交' : 'Last Year Commits' },
    { icon: '⭐', val: fmt(totalStars), label: isZh ? '精选星标' : 'Featured Stars' },
    { icon: '🔀', val: fmt(totalForks), label: 'Forks' }
  ];

  grid.innerHTML = tiles.map((tile) => `
    <div class="stat-tile">
      <span class="stat-icon">${tile.icon}</span>
      <span class="stat-value">${tile.val}</span>
      <span class="stat-label">${tile.label}</span>
    </div>
  `).join('');
}

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!list) return;

  const isZh = state.lang === 'zh';
  const commitLabel = isZh ? '次提交' : 'commits';
  const forkLabel = 'Forks';
  const readmeTitle = isZh ? 'README 详情' : 'README Details';
  const readmeHint = isZh ? '点击展开后自动加载项目 README' : 'Expand to load the project README';

  list.innerHTML = featuredProjects.map((project) => {
    const repo = cachedRepoMap[project.repo] || {};
    const stars = fmt(repo.stargazers_count);
    const forks = fmt(repo.forks_count);
    const lang = repo.language || project.lang || 'N/A';
    const commits = fmt(cachedCommits[project.repo]);
    const desc = isZh ? project.zh : project.en;
    const languageBadge = `<img class="shield-badge" src="https://img.shields.io/github/languages/top/${GITHUB_USER}/${project.repo}?style=flat-square" alt="${isZh ? '语言' : 'Language'}: ${lang}" loading="lazy" />`;
    const versionBadge = cachedReleases[project.repo]
      ? `<img class="shield-badge" src="https://img.shields.io/github/v/release/${GITHUB_USER}/${project.repo}?style=flat-square" alt="${isZh ? '版本' : 'Version'}" loading="lazy" />`
      : '';
    const screenshotHtml = project.screenshot ? `
      <div class="project-screenshot-wrap">
        <img class="project-screenshot" src="${project.screenshot}" alt="${escapeHtml(project.display)} screenshot" loading="lazy" onerror="this.closest('.project-screenshot-wrap').style.display='none'" />
      </div>` : '';

    return `
      <article class="project-item">
        <div class="project-body">
          <h3><a href="${project.url}" target="_blank" rel="noreferrer">${escapeHtml(project.display)}</a></h3>
          <p class="project-desc">${escapeHtml(desc)}</p>
          <div class="project-meta-row">
            ${languageBadge}
            ${versionBadge}
            <span class="badge">⭐ ${stars}</span>
            <span class="badge">🔀 ${forkLabel} ${forks}</span>
            <span class="badge">🧾 ${commits} ${commitLabel}</span>
          </div>
          <details class="readme-details" data-readme-repo="${project.repo}">
            <summary>${readmeTitle}</summary>
            <div class="readme-panel" data-readme-panel>
              <p class="readme-loading">${readmeHint}</p>
            </div>
          </details>
        </div>
        ${screenshotHtml}
      </article>
    `;
  }).join('');

  bindReadmeDetails();
}

function bindReadmeDetails() {
  document.querySelectorAll('.readme-details').forEach((details) => {
    if (details.dataset.bound === '1') return;
    details.dataset.bound = '1';
    details.addEventListener('toggle', async () => {
      if (!details.open) return;

      const panel = details.querySelector('[data-readme-panel]');
      if (!panel) return;

      const repo = details.getAttribute('data-readme-repo');
      const loadingText = state.lang === 'zh' ? 'README 加载中...' : 'Loading README...';
      const emptyText = state.lang === 'zh' ? '未找到可用 README。' : 'No README found.';
      const sourceText = state.lang === 'zh' ? '查看原文' : 'View source';
      const failedText = state.lang === 'zh' ? 'README 加载失败，请稍后重试。' : 'Failed to load README. Please try again.';

      if (panel.dataset.loadedLang === state.lang) return;

      panel.innerHTML = `<p class="readme-loading">${loadingText}</p>`;
      const doc = await getReadmeDoc(repo, state.lang);
      if (!doc) {
        panel.innerHTML = `<p class="readme-loading">${emptyText}</p>`;
        panel.dataset.loadedLang = state.lang;
        return;
      }

      try {
        const renderedHtml = await renderGitHubMarkdown(doc.markdown, repo, doc);
        panel.innerHTML = `
          <div class="readme-source">
            <a class="preview-source" href="${sanitizeExternalUrl(doc.htmlUrl)}" target="_blank" rel="noreferrer">${sourceText}: ${escapeHtml(doc.path)}</a>
          </div>
          <div class="readme-content">${renderedHtml}</div>
        `;
        panel.dataset.loadedLang = state.lang;
      } catch (error) {
        console.error('README render error:', error);
        panel.innerHTML = `<p class="readme-loading">${failedText}</p>`;
      }
    });
  });
}

function renderMyBaseModuleNav() {
  const nav = document.getElementById('myBaseModuleNav');
  if (!nav) return;

  nav.innerHTML = myBaseModules.map((module) => {
    const label = labelForModule(module);
    if (module.key === 'writings') {
      const activeClass = state.route.detail === 'writings' ? ' module-chip-active' : '';
      return `<a class="module-chip${activeClass}" href="#my-base/writings">${module.icon} ${escapeHtml(label)}</a>`;
    }

    return `<button class="module-chip" type="button" data-scroll-target="mybase-module-${module.key}">${module.icon} ${escapeHtml(label)}</button>`;
  }).join('');

  nav.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-scroll-target');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderMyBaseItem(item) {
  const nestedHtml = item.nestedNames.length
    ? `<div class="module-item-subitems">${item.nestedNames.map((name) => `<span class="module-subitem">${escapeHtml(name)}</span>`).join('')}</div>`
    : '';
  const previewBadge = item.previewType ? `<span class="badge">${escapeHtml(describeEntryType(item))}</span>` : '';
  const nestedBadge = item.nestedCount ? `<span class="badge">${item.nestedCount} ${state.lang === 'zh' ? '项' : 'items'}</span>` : '';

  if (item.previewType) {
    return `
      <button
        type="button"
        class="module-item-link"
        data-preview-path="${escapeHtml(item.path)}"
        data-preview-type="${escapeHtml(item.previewType)}"
        data-preview-title="${escapeHtml(item.name)}"
        data-preview-url="${escapeHtml(item.htmlUrl)}"
      >
        <div class="module-item-top">
          <span class="module-item-title">${escapeHtml(item.name)}</span>
          <span class="badge">${state.lang === 'zh' ? '打开预览' : 'Open Preview'}</span>
        </div>
        <div class="module-item-meta">
          ${previewBadge}
          ${nestedBadge}
        </div>
        ${nestedHtml}
      </button>
    `;
  }

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

function renderMyBaseOverview(structure, overviewHtml) {
  const isZh = state.lang === 'zh';
  const repo = structure.repo || {};
  const totalItems = structure.modules.reduce((sum, module) => sum + module.items.length, 0);
  const overviewTitle = isZh ? 'My Base 总览' : 'My Base Overview';
  const overviewLead = isZh
    ? '当前页面直接按分类展示 My Base 中公开可浏览的内容，并支持文档/脚本预览。todos 模块已按要求隐藏，文稿随记暂保留空页面入口。'
    : 'This page surfaces the public, browseable parts of My Base by category and supports document/script previews. The todos module is intentionally hidden, while writings currently remains as an empty-state entry.';
  const sourceLabel = isZh ? '查看仓库' : 'Open Repository';
  const updatedLabel = isZh ? '最近更新' : 'Last Updated';
  const moduleCards = structure.modules.map((module) => {
    const cardId = `mybase-module-${module.key}`;
    const cardTitle = labelForModule(module);
    const cardDesc = descForModule(module);
    const countLabel = state.lang === 'zh' ? `${module.items.length} 项` : `${module.items.length} items`;
    const githubLink = module.virtual
      ? `<a href="#my-base/writings">${isZh ? '打开页面' : 'Open Page'}</a>`
      : `<a href="${sanitizeExternalUrl(module.htmlUrl)}" target="_blank" rel="noreferrer">${sourceLabel}</a>`;
    const itemsHtml = module.virtual
      ? `<div class="module-item-list"><a class="module-item-link" href="#my-base/writings"><div class="module-item-top"><span class="module-item-title">${escapeHtml(cardTitle)}</span><span class="badge">${isZh ? '空页面入口' : 'Empty Page Entry'}</span></div><div class="module-item-meta"><span class="badge">${isZh ? '当前暂无内容' : 'Currently empty'}</span></div></a></div>`
      : (module.items.length
        ? `<div class="module-item-list">${module.items.map(renderMyBaseItem).join('')}</div>`
        : `<p class="readme-loading">${isZh ? '当前分类暂无可展示内容。' : 'No public items are available in this category yet.'}</p>`);

    return `
      <article class="module-card" id="${cardId}">
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

  return `
    <div class="my-base-layout">
      <article class="overview-card">
        <h2>${overviewTitle}</h2>
        <p>${overviewLead}</p>
        <div class="overview-meta">
          <span class="badge">⭐ ${fmt(repo.stargazers_count)}</span>
          <span class="badge">🔀 ${fmt(repo.forks_count)}</span>
          <span class="badge">📦 ${structure.modules.length} ${isZh ? '分类' : 'modules'}</span>
          <span class="badge">🧾 ${totalItems} ${isZh ? '公开条目' : 'public items'}</span>
          <span class="badge">🕒 ${updatedLabel}: ${formatDate(repo.updated_at)}</span>
        </div>
        <div class="readme-panel">
          <div class="readme-content">${overviewHtml || `<p>${isZh ? '暂无可用仓库简介。' : 'Repository overview is unavailable right now.'}</p>`}</div>
        </div>
      </article>
      <div class="module-grid">
        ${moduleCards}
      </div>
      <section class="preview-panel" id="myBasePreviewPanel">
        ${renderPreviewPlaceholder()}
      </section>
    </div>
  `;
}

function renderPreviewPlaceholder() {
  const isZh = state.lang === 'zh';
  return `
    <div class="preview-placeholder">
      <div>
        <strong>${isZh ? '选择一个条目进行预览' : 'Select an item to preview'}</strong>
        <p class="preview-placeholder-text">${isZh ? '支持直接预览 Markdown 文档与常见脚本/文本文件。' : 'Markdown documents and common script/text files can be previewed here.'}</p>
      </div>
    </div>
  `;
}

function renderWritingsEmptyState() {
  const isZh = state.lang === 'zh';
  return `
    <div class="my-base-layout">
      <section class="empty-state">
        <div class="breadcrumb">
          <a class="breadcrumb-link" href="#my-base">${isZh ? 'My Base' : 'My Base'}</a>
          <span class="breadcrumb-sep">/</span>
          <span>${isZh ? '文稿随记' : 'Writings'}</span>
        </div>
        <h2>${isZh ? '文稿随记暂时为空' : 'Writings is currently empty'}</h2>
        <p>${isZh ? '当前仅保留该模块入口与独立页面，后续有内容时可继续扩展。' : 'This module currently keeps only its entry and standalone page, and can be expanded later when content is added.'}</p>
        <div class="page-actions">
          <a href="#my-base">${isZh ? '返回 My Base' : 'Back to My Base'}</a>
          <a href="https://github.com/JaderoChan/MyBase" target="_blank" rel="noreferrer">GitHub Repo</a>
        </div>
      </section>
    </div>
  `;
}

async function renderMyBaseContent() {
  const container = document.getElementById('myBaseContent');
  if (!container || state.route.page !== 'my-base') return;

  container.innerHTML = `<p class="readme-loading">${state.lang === 'zh' ? 'My Base 页面加载中...' : 'Loading My Base...'}</p>`;
  renderMyBaseModuleNav();

  if (state.route.detail === 'writings') {
    container.innerHTML = renderWritingsEmptyState();
    return;
  }

  const [structure, overviewHtml] = await Promise.all([
    loadMyBaseStructure(),
    loadMyBaseOverviewHtml()
  ]);

  container.innerHTML = renderMyBaseOverview(structure, overviewHtml);
  bindMyBasePreviewButtons();
  await renderMyBasePreview();
}

function bindMyBasePreviewButtons() {
  document.querySelectorAll('[data-preview-path]').forEach((button) => {
    button.addEventListener('click', () => {
      state.myBasePreviewItem = {
        path: button.getAttribute('data-preview-path') || '',
        type: button.getAttribute('data-preview-type') || '',
        title: button.getAttribute('data-preview-title') || '',
        htmlUrl: button.getAttribute('data-preview-url') || ''
      };
      void renderMyBasePreview();
    });
  });
}

async function renderMyBasePreview() {
  const panel = document.getElementById('myBasePreviewPanel');
  if (!panel) return;
  if (!state.myBasePreviewItem) {
    panel.innerHTML = renderPreviewPlaceholder();
    return;
  }

  const isZh = state.lang === 'zh';
  const loadingText = isZh ? '预览加载中...' : 'Loading preview...';
  const failedText = isZh ? '预览加载失败，请稍后重试。' : 'Failed to load preview. Please try again.';
  const sourceText = isZh ? '查看源码' : 'View source';

  panel.innerHTML = `<p class="readme-loading">${loadingText}</p>`;
  const file = await getRepoContent(MY_BASE_REPO, state.myBasePreviewItem.path);
  if (!file || typeof file !== 'object' || !('content' in file)) {
    panel.innerHTML = `<p class="readme-loading">${failedText}</p>`;
    return;
  }

  const decoded = decodeBase64Utf8(file.content || '');
  const doc = {
    path: file.path || state.myBasePreviewItem.path,
    htmlUrl: file.html_url || state.myBasePreviewItem.htmlUrl,
    sha: file.sha || ''
  };
  const renderedBody = state.myBasePreviewItem.type === 'markdown'
    ? `<div class="preview-rendered">${await renderGitHubMarkdown(decoded, MY_BASE_REPO, doc)}</div>`
    : `<pre class="preview-code"><code>${escapeHtml(decoded)}</code></pre>`;

  panel.innerHTML = `
    <div class="preview-header">
      <div>
        <h3 class="preview-title">${escapeHtml(state.myBasePreviewItem.title)}</h3>
        <p class="preview-subtitle">${escapeHtml(doc.path)}</p>
      </div>
      <div class="preview-actions">
        <a class="preview-source" href="${sanitizeExternalUrl(doc.htmlUrl)}" target="_blank" rel="noreferrer">${sourceText}</a>
      </div>
    </div>
    <div class="preview-body">
      ${renderedBody}
    </div>
  `;
}

function updatePageVisibility() {
  document.querySelectorAll('[data-page]').forEach((page) => {
    page.classList.toggle('page-hidden', page.getAttribute('data-page') !== state.route.page);
  });

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    const page = link.getAttribute('data-page-link');
    link.classList.toggle('nav-link-active', page === state.route.page && page !== 'home');
  });

  if (state.route.page === 'my-base') {
    document.title = state.route.detail === 'writings'
      ? 'Writings · My Base · 頔珞 JaderoChan Website'
      : 'My Base · 頔珞 JaderoChan Website';
  } else {
    document.title = '頔珞 JaderoChan Website';
  }
}

function renderAll() {
  updatePageVisibility();
  renderStats();
  renderProjects();
  renderMyBaseModuleNav();
  void renderMyBaseContent();
}

async function loadData() {
  renderAll();

  const [user, allRepos] = await Promise.all([
    apiFetchJson(`${API}/users/${GITHUB_USER}`),
    apiFetchJson(`${API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
  ]);

  cachedUser = user;
  if (Array.isArray(allRepos)) {
    for (const repo of allRepos) {
      cachedRepoMap[repo.name] = repo;
    }
  }
  renderAll();

  const [commitResults, lastYearCommits, releaseResults] = await Promise.all([
    Promise.all(featuredProjects.map(async (project) => [project.repo, await getCommitCount(project.repo)])),
    getLastYearCommitCount(),
    Promise.all(featuredProjects.map(async (project) => [project.repo, await getLatestReleaseTag(project.repo)]))
  ]);

  cachedCommits = Object.fromEntries(commitResults);
  cachedLastYearCommits = lastYearCommits;
  cachedReleases = Object.fromEntries(releaseResults);
  renderAll();
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.zh').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'en'));
  renderAll();
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function setupEmail() {
  const emailLink = document.getElementById('emailLink');
  if (!emailLink) return;
  emailLink.href = `mailto:${CONTACT_EMAIL}`;
  emailLink.textContent = `📧 ${CONTACT_EMAIL}`;
}

document.getElementById('langBtn').addEventListener('click', () => setLang(state.lang === 'zh' ? 'en' : 'zh'));
document.getElementById('themeBtn').addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));

window.addEventListener('hashchange', () => {
  state.route = parseHashRoute(window.location.hash);
  renderAll();
});

setTheme(state.theme);
setLang(state.lang);
setupEmail();

const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;
document.getElementById('year2').textContent = currentYear;

if (!window.location.hash) {
  window.location.hash = '#home';
}

loadData();
