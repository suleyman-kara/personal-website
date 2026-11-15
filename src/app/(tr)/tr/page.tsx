import { HomeRoute, homeMetadata } from '@/lib/pages';

export const metadata = homeMetadata('tr');

export default function Page() {
  return <HomeRoute lang="tr" />;
}
