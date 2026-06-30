const GITHUB_OWNER = 'JaderoChan';
const GITHUB_REPO = 'jaderochan.github.io';
const GALLERY_DIR = 'gallery';
const DESCRIPTIONS_FILE = `${GALLERY_DIR}/descriptions.json`;
const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|avif)$/i;
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
  if (typeof value !== 'string') return '';
  return value.trim();
}

function isImageFile(fileName) {
  return IMAGE_EXTENSIONS.test(fileName);
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

async function fetchGalleryFileNames() {
  const cacheKey = 'gallery-file-names';
  const cached = readCache(cacheKey);
  if (Array.isArray(cached)) return cached;

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodeURIComponent(GALLERY_DIR)}?ref=main`;
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      const stale = readCache(`${cacheKey}:stale`);
      if (Array.isArray(stale)) return stale;
      throw new Error(`Failed to load gallery directory: ${response.status}`);
    }

    const entries = await response.json();
    if (!Array.isArray(entries)) return [];

    const fileNames = entries
      .filter((entry) => entry && entry.type === 'file' && isImageFile(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));

    writeCache(cacheKey, fileNames, CACHE_TTL_MS);
    writeCache(`${cacheKey}:stale`, fileNames, 7 * 24 * 60 * 60 * 1000);
    return fileNames;
  } catch {
    const stale = readCache(`${cacheKey}:stale`);
    if (Array.isArray(stale)) return stale;
    throw new Error('Failed to load gallery directory.');
  }
}

async function fetchDescriptions() {
  try {
    const response = await fetch(`./${DESCRIPTIONS_FILE}`, { cache: 'no-store' });
    if (!response.ok) return {};
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return data;
  } catch {
    return {};
  }
}

function buildGalleryItems(fileNames, descriptionsMap) {
  return fileNames.map((fileName) => ({
    file: fileName,
    description: normalizeDescription(descriptionsMap[fileName])
  }));
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
    const caption = item.description;
    const altText = caption || item.file;
    const captionHtml = caption
      ? `<figcaption class="gallery-card-caption">${escapeHtml(caption)}</figcaption>`
      : '';

    return `
      <figure class="gallery-card" data-gallery-index="${index}">
        <img class="gallery-card-image" src="${imageUrl(item.file)}" alt="${escapeHtml(altText)}" loading="lazy" />
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

  const caption = item.description;
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
  document.querySelectorAll('.zh').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'zh'));
  document.querySelectorAll('.en').forEach((element) => element.classList.toggle('lang-hidden', lang !== 'en'));
}

async function initializeGallery() {
  if (state.initialized) return;
  state.initialized = true;

  try {
    const [fileNames, descriptionsMap] = await Promise.all([
      fetchGalleryFileNames(),
      fetchDescriptions()
    ]);
    state.galleryItems = buildGalleryItems(fileNames, descriptionsMap);
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
