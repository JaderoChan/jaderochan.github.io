import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const owner = process.env.GITHUB_OWNER || 'JaderoChan';
const user = process.env.GITHUB_USER || owner;
const token = process.env.GITHUB_TOKEN || '';

const FEATURED_REPOS = [
  'hidtool',
  'global_hotkey',
  'mcnbt',
  'BPNN',
  'Taylor-Series-compute-log',
  'ContentAwareImageCrop',
  'EasyLinks',
  'OpenCmdAnywhere'
];

const outputPath = resolve(process.cwd(), 'assets', 'github-stats.json');

function buildHeaders(extra = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-stats-generator',
    ...extra
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubJson(path, extra = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: buildHeaders(extra.headers || {}),
    method: extra.method || 'GET'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status} for ${path}: ${text.slice(0, 240)}`);
  }

  return response.json();
}

async function getCommitCount(repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
    headers: buildHeaders()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status} for commits ${repo}: ${text.slice(0, 240)}`);
  }

  const link = response.headers.get('link');
  if (!link) {
    const data = await response.json();
    return Array.isArray(data) ? data.length : 0;
  }

  const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return match ? Number.parseInt(match[1], 10) : 1;
}

async function getLastYearCommits() {
  const now = new Date();
  const targetYear = now.getUTCFullYear() - 1;
  const targetMonth = now.getUTCMonth();
  const targetDay = now.getUTCDate();
  const maxDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const safeDay = Math.min(targetDay, maxDay);
  const since = new Date(Date.UTC(targetYear, targetMonth, safeDay)).toISOString().slice(0, 10);
  const query = encodeURIComponent(`author:${user} committer-date:>=${since}`);
  const data = await githubJson(`/search/commits?q=${query}&per_page=1`);
  return typeof data?.total_count === 'number' ? data.total_count : null;
}

async function main() {
  const [userData, repos] = await Promise.all([
    githubJson(`/users/${user}`),
    githubJson(`/users/${user}/repos?per_page=100&sort=updated`)
  ]);

  const reposMap = {};
  if (Array.isArray(repos)) {
    for (const repo of repos) {
      reposMap[repo.name] = {
        stargazers_count: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : null,
        forks_count: typeof repo.forks_count === 'number' ? repo.forks_count : null,
        language: repo.language || null,
        default_branch: repo.default_branch || 'main',
        updated_at: repo.updated_at || null
      };
    }
  }

  const commitPairs = await Promise.all(
    FEATURED_REPOS.map(async (repo) => [repo, await getCommitCount(repo)])
  );

  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    user: {
      public_repos: typeof userData?.public_repos === 'number' ? userData.public_repos : null,
      followers: typeof userData?.followers === 'number' ? userData.followers : null
    },
    repos: reposMap,
    commits: Object.fromEntries(commitPairs),
    lastYearCommits: await getLastYearCommits()
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
