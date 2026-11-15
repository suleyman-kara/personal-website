import { BlogRoute, blogMetadata } from '@/lib/pages';

export const metadata = blogMetadata('en');

export default function Page() {
  return <BlogRoute lang="en" />;
}
