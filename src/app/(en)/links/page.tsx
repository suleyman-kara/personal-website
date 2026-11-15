import { LinksRoute, linksMetadata } from '@/lib/pages';

export const metadata = linksMetadata('en');

export default function Page() {
  return <LinksRoute lang="en" />;
}
