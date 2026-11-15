import { AboutRoute, aboutMetadata } from '@/lib/pages';

export const metadata = aboutMetadata('en');

export default function Page() {
  return <AboutRoute lang="en" />;
}
