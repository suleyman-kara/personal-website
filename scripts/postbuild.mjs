// Tidies the static export in dist/ after `next build`.
// A language with no posts gets a placeholder /blog/__none__/ page (a static export
// cannot have a dynamic route without pages); it is not a real page, so drop it.
import { rm } from 'node:fs/promises';

const DIST = new URL('../dist/', import.meta.url);
for (const dir of ['blog/__none__', 'tr/blog/__none__']) {
  await rm(new URL(dir, DIST), { recursive: true, force: true });
}
