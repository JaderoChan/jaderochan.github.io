const CONTACT_EMAIL = 'c_dl_cn@outlook.com';
const ICONS = {
  repos:  './assets/repos.svg',
  people: './assets/people.svg',
  commit: './assets/commit.svg',
  star:   './assets/star.svg',
  fork:   './assets/fork.svg',
  email:  './assets/email.svg'
};

const CONFIG_URL      = './config.json';
const META_URL        = './cache/meta/info.json';
const PROJECTS_CACHE  = './cache/featured_projects/';

const state = { lang: localStorage.getItem('lang') || 'zh' };

let siteConfig   = null;
let metaInfo     = null;
let projectInfos = {};

function extractRepo(url) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1);
}

function fmt(value) {
  if (value === null || value === undefined) return '—';
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeUrl(url, allowMail = true) {
  if (!url) return '#';
  try {
    const p = new URL(url, window.location.origin);
    const ok = allowMail ? ['http:', 'https:', 'mailto:', 'tel:'] : ['http:', 'https:'];
    return ok.includes(p.protocol) ? p.toString() : '#';
  } catch { return '#'; }
}

function renderMarkdown(md) {
  if (typeof marked === 'undefined') return `<pre>${escapeHtml(md)}</pre>`;
  const raw = marked.parse(String(md || ''));
  const doc = new DOMParser().parseFromString(`<div>${raw}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  root.querySelectorAll('script,iframe,object,embed,form').forEach(el => el.remove());
  root.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(a => {
      if (/^on/i.test(a.name) || a.name === 'srcdoc') el.removeAttribute(a.name);
    });
  });
  return root.innerHTML;
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

function renderStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  const isZh = state.lang === 'zh';
  const info = metaInfo || {};
  const tiles = [
    { icon: ICONS.repos,  iconAlt: isZh ? '仓库图标' : 'repos icon',   val: fmt(info.public_repos),       label: isZh ? '公开仓库'   : 'Public Repos' },
    { icon: ICONS.people, iconAlt: isZh ? '用户图标' : 'people icon',   val: fmt(info.followers),          label: isZh ? '关注者'     : 'Followers' },
    { icon: ICONS.commit, iconAlt: isZh ? '提交图标' : 'commit icon',   val: fmt(info.last_year_commits),  label: isZh ? '近一年提交' : 'Last Year Commits' },
    { icon: ICONS.star,   iconAlt: isZh ? '星标图标' : 'star icon',     val: fmt(info.total_stars),        label: isZh ? '全部星标'   : 'Total Stars' },
    { icon: ICONS.fork,   iconAlt: isZh ? '分叉图标' : 'fork icon',     val: fmt(info.total_forks),        label: isZh ? '全部 Fork' : 'Total Forks' }
  ];
  grid.innerHTML = tiles.map(t => `
    <div class="stat-tile">
      <span class="stat-icon"><img class="icon-img" src="${t.icon}" alt="${t.iconAlt}" loading="lazy" /></span>
      <span class="stat-value">${t.val}</span>
      <span class="stat-label">${t.label}</span>
    </div>`).join('');
}

function renderProjects() {
  const list = document.getElementById('projectList');
  if (!list || !siteConfig?.featured_projects?.length) return;
  const isZh = state.lang === 'zh';
  const commitLabel = isZh ? '次提交' : 'commits';

  list.innerHTML = siteConfig.featured_projects.map(project => {
    const repo  = extractRepo(project.url);
    const info  = projectInfos[repo] || {};
    const desc  = isZh ? project.description?.zh : project.description?.en;
    const ver   = info.has_release && info.latest_release ? info.latest_release : null;

    const langBadge = info.language_breakdown
      ? Object.entries(info.language_breakdown)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, pct]) => `<span class="badge">${escapeHtml(name)} ${pct}%</span>`)
          .join('')
      : (info.language ? `<span class="badge">${escapeHtml(info.language)}</span>` : '');
    const verBadge  = ver  ? `<span class="badge">${escapeHtml(ver)}</span>`  : '';
    const screenshotHtml = info.screenshot
      ? `<div class="project-screenshot-wrap">
           <img class="project-screenshot"
             src="${PROJECTS_CACHE}${encodeURIComponent(repo)}/${info.screenshot}"
             alt="${escapeHtml(project.name)} screenshot"
             loading="lazy"
             onerror="this.closest('.project-screenshot-wrap').style.display='none'" />
         </div>`
      : '';

    return `
      <article class="project-item">
        <div class="project-body">
          <h3><a href="${sanitizeUrl(project.url)}" target="_blank" rel="noreferrer">${escapeHtml(project.name)}</a></h3>
          <p class="project-desc">${escapeHtml(desc || '')}</p>
          <div class="project-meta-row">
            ${langBadge}${verBadge}
            <span class="badge"><img class="icon-img" src="${ICONS.star}" alt="stars" loading="lazy" /> ${fmt(info.stars)}</span>
            <span class="badge"><img class="icon-img" src="${ICONS.fork}" alt="forks" loading="lazy" /> ${fmt(info.forks)}</span>
            <span class="badge"><img class="icon-img" src="${ICONS.commit}" alt="commits" loading="lazy" /> ${fmt(info.commits)} ${commitLabel}</span>
          </div>
          <details class="readme-details" data-readme-repo="${escapeHtml(repo)}">
            <summary>${isZh ? 'README 详情' : 'README Details'}</summary>
            <div class="readme-panel" data-readme-panel>
              <p class="readme-loading">${isZh ? '点击展开后自动加载项目 README' : 'Expand to load the project README'}</p>
            </div>
          </details>
        </div>
        ${screenshotHtml}
      </article>`;
  }).join('');

  bindReadmeDetails();
}

function bindReadmeDetails() {
  document.querySelectorAll('.readme-details').forEach(details => {
    if (details.dataset.bound === '1') return;
    details.dataset.bound = '1';
    details.addEventListener('toggle', async () => {
      if (!details.open) return;
      const panel = details.querySelector('[data-readme-panel]');
      if (!panel || panel.dataset.loadedLang === state.lang) return;

      const repo  = details.dataset.readmeRepo;
      const info  = projectInfos[repo] || {};
      const fname = state.lang === 'zh'
        ? (info.readme?.zh || info.readme?.en)
        : (info.readme?.en || info.readme?.zh);

      panel.innerHTML = `<p class="readme-loading">${state.lang === 'zh' ? 'README 加载中...' : 'Loading README...'}</p>`;

      if (!fname) {
        panel.innerHTML = `<p class="readme-loading">${state.lang === 'zh' ? '未找到可用 README。' : 'No README found.'}</p>`;
        panel.dataset.loadedLang = state.lang;
        return;
      }

      try {
        const res = await fetch(`${PROJECTS_CACHE}${encodeURIComponent(repo)}/${fname}`);
        if (!res.ok) throw new Error('fetch failed');
        const html = renderMarkdown(await res.text());
        panel.innerHTML = `<div class="readme-content">${html}</div>`;
        renderMath(panel);
        panel.dataset.loadedLang = state.lang;
      } catch {
        panel.innerHTML = `<p class="readme-loading">${state.lang === 'zh' ? 'README 加载失败。' : 'Failed to load README.'}</p>`;
      }
    });
  });
}

function renderAll() {
  renderStats();
  renderProjects();
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.zh').forEach(el => el.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('lang-hidden', lang !== 'en'));
  renderAll();
}

function setupEmail() {
  const link = document.getElementById('emailLink');
  if (!link) return;
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.innerHTML = `<img class="icon-img" src="${ICONS.email}" alt="email" /> ${CONTACT_EMAIL}`;
}

async function loadData() {
  const [cfg, meta] = await Promise.all([
    fetch(CONFIG_URL).then(r => r.ok ? r.json() : null).catch(() => null),
    fetch(META_URL, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null)
  ]);
  siteConfig = cfg;
  metaInfo   = meta;
  renderAll();

  if (!siteConfig?.featured_projects?.length) return;

  await Promise.all(siteConfig.featured_projects.map(async project => {
    const repo = extractRepo(project.url);
    const info = await fetch(`${PROJECTS_CACHE}${encodeURIComponent(repo)}/info.json`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null).catch(() => null);
    if (info) projectInfos[repo] = info;
  }));

  renderProjects();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

document.getElementById('langBtn').addEventListener('click', () => setLang(state.lang === 'zh' ? 'en' : 'zh'));
document.documentElement.setAttribute('data-theme', 'dark');
setLang(state.lang);
setupEmail();
const _year = new Date().getFullYear();
document.getElementById('year').textContent  = _year;
document.getElementById('year2').textContent = _year;
loadData();
