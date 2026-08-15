/**
 * sync-cache.mjs
 * Reads config.json, fetches GitHub data, and writes to the cache/ directory.
 * Skips projects whose latest commit hash has not changed since last sync.
 */
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const token = process.env.GITHUB_TOKEN || '';

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------

function ghHeaders() {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sync-cache/1.0',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function ghJson(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function tryFetch(url) {
  try {
    const res = await fetch(url);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function extractRepo(url) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1);
}

async function getCommitCount(user, repo) {
  const res = await fetch(
    `https://api.github.com/repos/${user}/${repo}/commits?per_page=1`,
    { headers: ghHeaders() }
  );
  if (!res.ok) return null;
  const link = res.headers.get('link') || '';
  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (match) return parseInt(match[1], 10);
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

async function getLastYearCommits(user) {
  const now = new Date();
  const y = now.getUTCFullYear() - 1;
  const m = now.getUTCMonth();
  const maxDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const d = Math.min(now.getUTCDate(), maxDay);
  const since = new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
  const q = encodeURIComponent(`author:${user} committer-date:>=${since}`);
  const data = await ghJson(`/search/commits?q=${q}&per_page=1`);
  return typeof data?.total_count === 'number' ? data.total_count : null;
}

async function getLatestCommitHash(user, repo, branch) {
  try {
    const data = await ghJson(`/repos/${user}/${repo}/commits/${encodeURIComponent(branch)}`);
    return data?.sha || null;
  } catch {
    return null;
  }
}

// Auto-discover README for a given language.
// Tries localized paths first, then falls back to the default README.
async function discoverReadme(user, repo, branch, lang) {
  const sfx = lang === 'zh' ? 'ZH' : 'EN';
  const raw = `https://raw.githubusercontent.com/${user}/${repo}/${branch}`;
  const candidates = [
    `${raw}/README_${sfx}.md`,
    `${raw}/doc/README_${sfx}.md`,
    `${raw}/docs/README_${sfx}.md`,
    `${raw}/README.md`
  ];
  for (const url of candidates) {
    const res = await tryFetch(url);
    if (res) return { filename: url.split('/').pop(), content: await res.text() };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Meta sync
// ---------------------------------------------------------------------------

async function syncMeta(config) {
  const { github_user: user } = config;
  const metaDir = join(ROOT, 'cache', 'meta');
  const assetsDir = join(metaDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  const [userData, allRepos] = await Promise.all([
    ghJson(`/users/${user}`),
    ghJson(`/users/${user}/repos?per_page=100&sort=updated`)
  ]);

  let total_stars = 0;
  let total_forks = 0;
  if (Array.isArray(allRepos)) {
    for (const r of allRepos) {
      total_stars += r.stargazers_count || 0;
      total_forks += r.forks_count || 0;
    }
  }

  const last_year_commits = await getLastYearCommits(user);

  // Download and compress avatar to 200x200 PNG
  const avatarRes = await tryFetch(userData.avatar_url);
  if (avatarRes) {
    const buf = Buffer.from(await avatarRes.arrayBuffer());
    await sharp(buf).resize(200, 200, { fit: 'cover' }).png().toFile(join(assetsDir, 'avatar.png'));
  }

  const info = {
    login: userData.login,
    name: userData.name || userData.login,
    avatar: 'cache/meta/assets/avatar.png',
    public_repos: userData.public_repos,
    followers: userData.followers,
    following: userData.following,
    total_stars,
    total_forks,
    last_year_commits,
    updated_at: new Date().toISOString()
  };

  await writeFile(join(metaDir, 'info.json'), JSON.stringify(info, null, 2) + '\n', 'utf8');
  console.log('✓ meta');
}

// ---------------------------------------------------------------------------
// Per-project sync
// ---------------------------------------------------------------------------

async function syncProject(user, project) {
  const repo = extractRepo(project.url);
  const projectDir = join(ROOT, 'cache', 'featured_projects', repo);
  const assetsDir = join(projectDir, 'assets');

  // Read existing info to check commit_hash
  let existingInfo = null;
  try {
    existingInfo = JSON.parse(await readFile(join(projectDir, 'info.json'), 'utf8'));
  } catch { /* new project */ }

  // Fetch repo metadata (also provides default_branch)
  const repoData = await ghJson(`/repos/${user}/${repo}`);
  const branch = repoData.default_branch || 'main';

  // Skip if latest commit unchanged
  const latestHash = await getLatestCommitHash(user, repo, branch);
  if (latestHash && existingInfo?.commit_hash === latestHash) {
    console.log(`  skip ${repo} (unchanged)`);
    return;
  }

  await mkdir(assetsDir, { recursive: true });

  // Fetch additional data in parallel
  const [languages, commits] = await Promise.all([
    ghJson(`/repos/${user}/${repo}/languages`).catch(() => ({})),
    getCommitCount(user, repo)
  ]);

  // Compute percentage breakdown
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const language_breakdown = totalBytes > 0
    ? Object.fromEntries(
        Object.entries(languages).map(([l, b]) => [l, Math.round(b / totalBytes * 1000) / 10])
      )
    : {};

  // Latest release
  let has_release = false;
  let latest_release = null;
  try {
    const rel = await ghJson(`/repos/${user}/${repo}/releases/latest`);
    has_release = true;
    latest_release = rel.tag_name || null;
  } catch { /* no release */ }

  // Discover and cache READMEs
  const [readmeZh, readmeEn] = await Promise.all([
    discoverReadme(user, repo, branch, 'zh'),
    discoverReadme(user, repo, branch, 'en')
  ]);
  if (readmeZh) await writeFile(join(projectDir, 'readme_zh.md'), readmeZh.content, 'utf8');
  if (readmeEn) await writeFile(join(projectDir, 'readme_en.md'), readmeEn.content, 'utf8');

  // Download and compress screenshot (max 1200px wide, JPEG 85%)
  let screenshot = null;
  if (project.screenshot) {
    const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${project.screenshot}`;
    const imgRes = await tryFetch(rawUrl);
    if (imgRes) {
      const buf = Buffer.from(await imgRes.arrayBuffer());
      await sharp(buf)
        .resize(1200, null, { withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(join(assetsDir, 'screenshot.jpg'));
      screenshot = 'assets/screenshot.jpg';
    }
  }

  const info = {
    name: repo,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language,
    language_breakdown,
    commits,
    has_release,
    latest_release,
    default_branch: branch,
    commit_hash: latestHash,
    readme: {
      zh: readmeZh ? 'readme_zh.md' : null,
      en: readmeEn ? 'readme_en.md' : null
    },
    screenshot,
    updated_at: new Date().toISOString()
  };

  await writeFile(
    join(projectDir, 'info.json'),
    JSON.stringify(info, null, 2) + '\n',
    'utf8'
  );
  console.log(`✓ ${repo}`);
}

// ---------------------------------------------------------------------------
// Cleanup removed projects
// ---------------------------------------------------------------------------

async function cleanupRemovedProjects(config) {
  const activeRepos = new Set(config.featured_projects.map(p => extractRepo(p.url)));
  const dir = join(ROOT, 'cache', 'featured_projects');
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !activeRepos.has(entry.name)) {
        await rm(join(dir, entry.name), { recursive: true, force: true });
        console.log(`✓ removed ${entry.name}`);
      }
    }
  } catch { /* directory may not exist yet */ }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const config = JSON.parse(await readFile(join(ROOT, 'config.json'), 'utf8'));
  const { github_user: user, featured_projects: projects } = config;

  console.log('Syncing meta...');
  await syncMeta(config);

  console.log('Syncing projects...');
  for (const project of projects) {
    await syncProject(user, project);
  }

  await cleanupRemovedProjects(config);
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
