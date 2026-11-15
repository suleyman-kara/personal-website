import { rss } from '@/lib/feeds';

export const dynamic = 'force-static';

export function GET() {
  return rss('tr');
}
