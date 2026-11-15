import { AboutRoute, aboutMetadata } from '@/lib/pages';

export const metadata = aboutMetadata('tr');

export default function Page() {
  return <AboutRoute lang="tr" />;
}
