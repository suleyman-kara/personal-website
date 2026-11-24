// Fetches the live forecast status published by suleyman-kara/crypto-forecasting-live
// and writes it to src/data/forecast.json, the snapshot the page renders first
// (the card then refreshes from the same URL in the browser). If the fetch fails
// or the file does not match schema 1, the existing snapshot is kept and the
// build continues.
import { writeFile } from 'node:fs/promises';

export const STATUS_URL =
  'https://raw.githubusercontent.com/suleyman-kara/crypto-forecasting-live/main/live/status.json';
const OUT = new URL('../src/data/forecast.json', import.meta.url);

/** Minimal shape check for schema 1; throws with a short reason. */
export function validate(s) {
  const fail = (why) => {
    throw new Error(`invalid status.json: ${why}`);
  };
  if (!s || typeof s !== 'object') fail('not an object');
  if (s.schema !== 1) fail(`schema ${JSON.stringify(s.schema)}, expected 1`);
  if (typeof s.generatedAt !== 'string' || Number.isNaN(Date.parse(s.generatedAt))) fail('generatedAt');
  if (!s.stats || typeof s.stats !== 'object') fail('stats');
  if (!Array.isArray(s.equity)) fail('equity');
  if (!Array.isArray(s.recent)) fail('recent');
  if (s.current != null && typeof s.current !== 'object') fail('current');
  if (s.backtest != null && typeof s.backtest !== 'object') fail('backtest');
  return s;
}

async function main() {
  const res = await fetch(STATUS_URL, {
    headers: { 'user-agent': 'portfolio-build' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = validate(await res.json());
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`[forecast] snapshot from ${data.generatedAt}, ${data.stats.predictions ?? 0} predictions`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.warn(`[forecast] fetch failed, keeping existing forecast.json: ${e.message}`);
  });
}
