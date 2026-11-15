import { PostRoute, postMetadata, postParams } from '@/lib/pages';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => postParams('en');

export async function generateMetadata({ params }: Props) {
  return postMetadata('en', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <PostRoute lang="en" slug={(await params).slug} />;
}
