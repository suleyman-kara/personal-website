// Fetches public GitHub activity at build time and writes src/data/github.json.
// Needs GITHUB_TOKEN (provided automatically in GitHub Actions). Without a
// token, or if the request fails, the existing file is left as is and the
// build continues; the site hides the section when there is no data.
import { writeFile } from 'node:fs/promises';

const LOGIN = 'suleyman-kara';
const OUT = new URL('../src/data/github.json', import.meta.url);
const API = process.env.GITHUB_GRAPHQL_URL ?? 'https://api.github.com/graphql';
const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    repositories(first: 4, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false,
                 orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { name url description pushedAt primaryLanguage { name color } }
    }
  }
}`;

export function transform(user, now = new Date()) {
  const cal = user.contributionsCollection.contributionCalendar;
  return {
    fetchedAt: now.toISOString(),
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
    ),
    repos: user.repositories.nodes.map((r) => ({
      name: r.name,
      url: r.url,
      description: r.description ?? '',
      pushedAt: r.pushedAt,
      language: r.primaryLanguage?.name ?? null,
      languageColor: r.primaryLanguage?.color ?? null,
    })),
  };
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN not set, keeping existing github.json');
    return;
  }
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'portfolio-build',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.data?.user) {
    throw new Error(`HTTP ${res.status} ${JSON.stringify(body?.errors ?? body)?.slice(0, 300)}`);
  }
  const data = transform(body.data.user);
  await writeFile(OUT, JSON.stringify(data) + '\n');
  console.log(`[github] ${data.total} contributions, ${data.repos.length} repos`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.warn(`[github] fetch failed, keeping existing github.json: ${e.message}`);
  });
}
