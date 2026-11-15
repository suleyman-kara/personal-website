import { BlogRoute, blogMetadata } from '@/lib/pages';

export const metadata = blogMetadata('tr');

export default function Page() {
  return <BlogRoute lang="tr" />;
}
