import { LinksRoute, linksMetadata } from '@/lib/pages';

export const metadata = linksMetadata('tr');

export default function Page() {
  return <LinksRoute lang="tr" />;
}
