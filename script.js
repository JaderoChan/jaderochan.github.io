const GITHUB_USER = 'JaderoChan';
const CONTACT_EMAIL = 'c_dl_cn@outlook.com';
const API = 'https://api.github.com';

const projects = [
  {
    display: 'My Base',
    repo: 'MyBase',
    url: 'https://github.com/JaderoChan/MyBase',
    lang: 'Batchfile',
    zh: '个人知识与工程资产的集合仓库，集中维护 references、standards、skills、templates、scripts 等目录，涵盖速查资料、编码规范、AI Skill、项目模板与常用脚本，作为长期迭代的开发工作台。项目强调知识沉淀与可复用实践，便于在新项目中快速复刻统一工程流程。',
    en: 'A collection-style personal engineering base that consolidates references, standards, skills, templates, and scripts, serving as an evolving workspace for cheatsheets, coding conventions, AI skills, reusable project templates, and utility automation. It focuses on turning day-to-day experience into reusable assets that can quickly bootstrap future projects.',
    screenshot: null
  },
  {
    display: 'HID Tool',
    repo: 'hidtool',
    url: 'https://github.com/JaderoChan/hidtool',
    lang: 'C++',
    zh: '跨平台 HID 输入库，覆盖键盘/鼠标监听与模拟，支持 Windows、macOS、Linux；提供线程安全单例设计、静态/动态库构建、以及 C 与 Python 绑定，适合自动化与系统级输入控制场景。仓库同时包含示例与接口边界设计，便于按模块接入现有桌面端或工具链项目。',
    en: 'A cross-platform HID input library for keyboard/mouse event listening and simulation across Windows, macOS, and Linux, with thread-safe singleton modules, static/shared build options, and C/Python bindings for automation and system-level input workflows. The repository also includes integration-oriented interface boundaries and examples for easier adoption in existing desktop and tooling stacks.',
    screenshot: null
  },
  {
    display: 'Global Hotkey',
    repo: 'global_hotkey',
    url: 'https://github.com/JaderoChan/global_hotkey',
    lang: 'C++',
    zh: '独立全局热键库，提供 Register 与 Hook 两类管理器，支持控制台与 GUI 程序并兼容 Windows/macOS/Linux；可配合 C/Python 绑定使用，适用于跨平台快捷键服务、事件分发与应用级热键集成。项目将平台差异封装在统一接口下，方便构建可扩展的快捷键系统。',
    en: 'An independent global hotkey library with both register-based and hook-based managers, designed for console and GUI applications on Windows/macOS/Linux, with C/Python bindings for cross-platform shortcut services and event-driven integrations. It encapsulates platform differences behind a unified API so hotkey systems can scale with fewer platform-specific branches.',
    screenshot: null
  },
  {
    display: 'MC NBT',
    repo: 'mcnbt',
    url: 'https://github.com/JaderoChan/mcnbt',
    lang: 'C++',
    zh: '面向 Minecraft NBT 的高性能 Header-only 读写库，支持 Java/基岩版字节序、SNBT 与 gzip 解压流程，并提供便捷 Tag 构造与结构化编辑接口，适合地图工具与数据处理项目直接嵌入。仓库强调零侵入集成与清晰数据模型，便于快速开发编辑器或批处理工具。',
    en: 'A high-performance header-only library for Minecraft NBT parsing and writing, supporting Java/Bedrock endianness, SNBT, and gzip workflows, with convenient tag construction and editing APIs for map tools and data-processing pipelines. The design emphasizes low-friction embedding and a clear data model for quickly building editors and batch processing utilities.',
    screenshot: null
  },
  {
    display: 'BPNN',
    repo: 'BPNN',
    url: 'https://github.com/JaderoChan/BPNN',
    lang: 'C',
    zh: '纯 C99 实现的三层全连接 BP 神经网络学习项目，内置多种激活函数与损失函数，支持训练回调、参数持久化与推理流程；配套 MNIST 手写数字识别示例在 50 轮训练后可达约 98% 准确率。代码结构按教学与实验复现组织，便于理解反向传播细节并扩展更多网络实验。',
    en: 'A pure C99 three-layer backpropagation neural network project for learning fundamentals, featuring multiple activation/loss functions, train callbacks, parameter persistence, and inference APIs, plus an MNIST digit recognizer example reaching around 98% accuracy after 50 epochs. The code organization is designed for study and reproducible experiments, making it easier to inspect and extend core backpropagation steps.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/BPNN/main/example/digit_recognizer/images/predict_result.png'
  },
  {
    display: 'Taylor Series Compute Log',
    repo: 'Taylor-Series-compute-log',
    url: 'https://github.com/JaderoChan/Taylor-Series-compute-log',
    lang: 'C',
    zh: '以泰勒级数实现 ln() 计算的数学与工程练习项目，不依赖标准数学库，结合浮点表示分解与参数标准化策略（如 2/3、√2/2 缩放）提升数值精度，并附带精度/性能对比实验。项目完整展示从公式推导到工程实现的路径，适合用于数值方法学习与性能验证。',
    en: 'A mathematical and engineering practice project implementing ln() via Taylor series without relying on the standard math library, combining floating-point decomposition and normalization strategies (e.g., 2/3 and √2/2 scaling) to improve precision, with benchmark comparisons included. It demonstrates an end-to-end path from formula reasoning to practical implementation for numerical-method learning and performance validation.',
    screenshot: null
  },
  {
    display: 'Content Aware Image Crop',
    repo: 'ContentAwareImageCrop',
    url: 'https://github.com/JaderoChan/ContentAwareImageCrop',
    lang: 'C++',
    zh: '基于接缝雕刻（Seam Carving）的内容感知图像裁切工具，包含后端动态规划算法库与 Qt 前端，支持能量图可视化、接缝高亮、实时进度、撤销重做与多语言界面，面向可交互图像处理流程。仓库提供完整桌面交互链路，适合展示算法可视化与工程化 UI 的结合。',
    en: 'A seam-carving-based content-aware image cropping application with a dynamic-programming backend and Qt frontend, supporting energy-map visualization, seam highlighting, real-time progress, undo/redo, and bilingual UI for interactive image-processing workflows. It delivers a complete desktop interaction flow and showcases how algorithm visualization can be integrated with production-style UI design.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/ContentAwareImageCrop/main/screenshot/sufer_cropped.png'
  },
  {
    display: 'Easy Link',
    repo: 'EasyLinks',
    url: 'https://github.com/JaderoChan/EasyLinks',
    lang: 'C++',
    zh: '桌面链接管理工具，支持符号链接、硬链接与 Pattern Link 批量策略，结合 GUI 与全局热键实现“复制-定位-一键链接”流程，并提供冲突处理、Review 预审与重命名模板等工程化能力。项目关注高频文件整理场景，强调批处理效率与可回溯操作体验。',
    en: 'A desktop link-management tool supporting symbolic links, hard links, and Pattern Link batch workflows, combining GUI and global hotkeys for copy-target-fast-link operations, with conflict handling, review-stage filtering, and naming-template customization. It targets high-frequency file organization work and emphasizes both batch efficiency and traceable operations.',
    screenshot: 'https://raw.githubusercontent.com/JaderoChan/EasyLinks/main/doc/screenshots/progress_dialog_en.png'
  },
  {
    display: 'Open CMD Anywhere',
    repo: 'OpenCmdAnywhere',
    url: 'https://github.com/JaderoChan/OpenCmdAnywhere',
    lang: 'C++',
    zh: '快捷键驱动的命令行启动工具，可按前台窗口上下文或文件管理器目录快速打开终端，减少右键层级操作；基于 Qt 界面并结合 global_hotkey 与 easy_translate，适合日常开发效率场景。它面向高频终端切换需求，可与现有工作流配合形成更顺滑的开发入口。',
    en: 'A hotkey-driven command launcher that opens terminals directly from the active window context or file-manager directory to reduce right-click friction, built with Qt and integrated with global_hotkey and easy_translate for daily development productivity. It is designed for frequent terminal-switch workflows and fits naturally into existing development habits.',
    screenshot: null
  }
];

const state = {
  lang: localStorage.getItem('lang') || 'zh',
  theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
};

let cachedUser = null;
let cachedRepoMap = {};
let cachedCommits = {};

async function apiFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getCommitCount(repo) {
  try {
    const res = await fetch(`${API}/repos/${GITHUB_USER}/${repo}/commits?per_page=1`);
    if (!res.ok) return null;
    const link = res.headers.get('Link');
    if (!link) {
      const data = await res.json();
      return Array.isArray(data) ? data.length : null;
    }
    const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    return m ? parseInt(m[1], 10) : 1;
  } catch {
    return null;
  }
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function renderStats() {
  const grid = document.getElementById('statsGrid');
  const isZh = state.lang === 'zh';

  const totalStars = projects.reduce((sum, p) => sum + (cachedRepoMap[p.repo]?.stargazers_count || 0), 0);
  const totalForks = projects.reduce((sum, p) => sum + (cachedRepoMap[p.repo]?.forks_count || 0), 0);

  const tiles = [
    { icon: '📦', val: fmt(cachedUser?.public_repos), label: isZh ? '公开仓库' : 'Public Repos' },
    { icon: '🧑‍🤝‍🧑', val: fmt(cachedUser?.followers), label: isZh ? '关注者' : 'Followers' },
    { icon: '⭐', val: fmt(totalStars), label: isZh ? '精选星标' : 'Featured Stars' },
    { icon: '🔀', val: fmt(totalForks), label: isZh ? '精选分叉' : 'Featured Forks' }
  ];

  grid.innerHTML = tiles.map((t) => `
    <div class="stat-tile">
      <span class="stat-icon">${t.icon}</span>
      <span class="stat-value">${t.val}</span>
      <span class="stat-label">${t.label}</span>
    </div>
  `).join('');
}

function renderProjects() {
  const list = document.getElementById('projectList');
  const isZh = state.lang === 'zh';
  const commitLabel = isZh ? '提交' : 'commits';

  list.innerHTML = projects.map((p) => {
    const repo = cachedRepoMap[p.repo] || {};
    const stars = fmt(repo.stargazers_count);
    const forks = fmt(repo.forks_count);
    const lang = repo.language || p.lang || 'N/A';
    const commits = fmt(cachedCommits[p.repo]);
    const desc = isZh ? p.zh : p.en;
    const languageBadge = `<img class="shield-badge" src="https://img.shields.io/github/languages/top/${GITHUB_USER}/${p.repo}?style=flat-square" alt="${isZh ? '语言' : 'Language'}: ${lang}" loading="lazy" />`;
    const versionBadge = `<img class="shield-badge" src="https://img.shields.io/github/v/release/${GITHUB_USER}/${p.repo}?style=flat-square" alt="${isZh ? '版本' : 'Version'}" loading="lazy" />`;

    const ssHtml = p.screenshot ? `
      <div class="project-screenshot-wrap">
        <img class="project-screenshot" src="${p.screenshot}" alt="${p.display} screenshot" loading="lazy" onerror="this.closest('.project-screenshot-wrap').style.display='none'" />
      </div>` : '';

    return `
      <article class="project-item">
        <div class="project-body">
          <h3><a href="${p.url}" target="_blank" rel="noreferrer">${p.display}</a></h3>
          <p class="project-desc">${desc}</p>
          <div class="project-meta-row">
            ${languageBadge}
            ${versionBadge}
            <span class="badge">⭐ ${stars}</span>
            <span class="badge">🔀 ${forks}</span>
            <span class="badge">🧾 ${commits} ${commitLabel}</span>
          </div>
        </div>
        ${ssHtml}
      </article>`;
  }).join('');
}

function renderAll() {
  renderStats();
  renderProjects();
}

async function loadData() {
  renderAll();

  const [user, allRepos] = await Promise.all([
    apiFetch(`${API}/users/${GITHUB_USER}`),
    apiFetch(`${API}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
  ]);

  cachedUser = user;
  if (Array.isArray(allRepos)) {
    for (const r of allRepos) {
      cachedRepoMap[r.name] = r;
    }
  }
  renderAll();

  const commitResults = await Promise.all(
    projects.map(async (p) => [p.repo, await getCommitCount(p.repo)])
  );

  cachedCommits = Object.fromEntries(commitResults);
  renderAll();
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.zh').forEach((el) => el.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach((el) => el.classList.toggle('lang-hidden', lang !== 'en'));
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

setTheme(state.theme);
setLang(state.lang);
setupEmail();
const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;
document.getElementById('year2').textContent = currentYear;

loadData();
