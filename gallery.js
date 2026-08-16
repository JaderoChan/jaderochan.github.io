const GALLERY_DIR = 'pages_data/gallery';
const CONFIG_FILE = `${GALLERY_DIR}/config.json`;
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_PREFIX = 'jadero:gh:gallery:';

const state = {
  lang: localStorage.getItem('lang') || 'zh',
  galleryItems: [],
  initialized: false
};

function imageUrl(fileName) {
  return `./${GALLERY_DIR}/${encodeURIComponent(fileName)}`;
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeDescription(value) {
  if (!value || typeof value !== 'object') return { zh: '', en: '' };
  return {
    zh: typeof value.zh === 'string' ? value.zh.trim() : '',
    en: typeof value.en === 'string' ? value.en.trim() : ''
  };
}

function resolveDescription(desc, lang) {
  return (lang === 'zh' ? desc.zh : desc.en) || desc.zh || desc.en || '';
}


function readCache(key) {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (Date.now() > Number(parsed.expiresAt || 0)) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(key, value, ttlMs = CACHE_TTL_MS) {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({
        expiresAt: Date.now() + ttlMs,
        value
      })
    );
  } catch {
    // Ignore storage failures.
  }
}

async function fetchConfig() {
  const cacheKey = 'gallery-config';
  const cached = readCache(cacheKey);
  if (cached && typeof cached === 'object') return cached;

  try {
    const response = await fetch(`./${CONFIG_FILE}`, { cache: 'no-store' });
    if (!response.ok) return {};
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    writeCache(cacheKey, data, CACHE_TTL_MS);
    return data;
  } catch {
    return {};
  }
}

function renderGallery() {
  const container = document.getElementById('galleryMasonry');
  if (!container) return;

  if (!state.galleryItems.length) {
    container.innerHTML = `
      <p class="readme-loading zh">当前画廊没有可展示的图片。</p>
      <p class="readme-loading en lang-hidden">No gallery images are available.</p>
    `;
    return;
  }

  container.innerHTML = state.galleryItems.map((item, index) => {
    const caption = resolveDescription(item.description, state.lang);
    const altText = caption || item.file;
    const captionHtml = caption
      ? `<figcaption class="gallery-card-caption">${escapeHtml(caption)}</figcaption>`
      : '';

    return `
      <figure class="gallery-card" data-gallery-index="${index}">
        <img
          class="gallery-card-image"
          src="${imageUrl(item.file)}"
          alt="${escapeHtml(altText)}"
          loading="lazy"
          decoding="async"
          onerror="this.closest('figure').style.display='none'"
        />
        ${captionHtml}
      </figure>
    `;
  }).join('');

  container.querySelectorAll('[data-gallery-index]').forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.getAttribute('data-gallery-index'));
      openLightbox(index);
    });
  });
}

function openLightbox(index) {
  const item = state.galleryItems[index];
  if (!item) return;

  const caption = resolveDescription(item.description, state.lang);
  const lightbox = document.getElementById('galleryLightbox');
  const image = document.getElementById('lightboxImage');
  const captionNode = document.getElementById('lightboxCaption');
  if (!lightbox || !image || !captionNode) return;

  image.src = imageUrl(item.file);
  image.alt = caption || item.file;
  captionNode.textContent = caption;
  captionNode.style.display = caption ? '' : 'none';
  lightbox.classList.add('gallery-lightbox-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('gallery-lightbox-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = lang === 'zh' ? '頔珞 JaderoChan Website · 画廊' : '頔珞 JaderoChan Website · Gallery';
  document.querySelectorAll('.zh').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'en'));
  renderGallery();
}

async function initializeGallery() {
  if (state.initialized) return;
  state.initialized = true;

  try {
    const config = await fetchConfig();
    state.galleryItems = Object.entries(config).map(([file, entry]) => ({
      file,
      description: normalizeDescription(entry && entry.descriptions)
    }));
  } catch {
    state.galleryItems = [];
  }

  renderGallery();
}

document.getElementById('langBtn').addEventListener('click', () => setLang(state.lang === 'zh' ? 'en' : 'zh'));
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

document.getElementById('galleryLightbox').addEventListener('click', (event) => {
  if (event.target.id === 'galleryLightbox') {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;
document.getElementById('year2').textContent = currentYear;

document.documentElement.setAttribute('data-theme', 'dark');
setLang(state.lang);
initializeGallery();
