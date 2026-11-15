import { PostRoute, postMetadata, postParams } from '@/lib/pages';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => postParams('tr');

export async function generateMetadata({ params }: Props) {
  return postMetadata('tr', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <PostRoute lang="tr" slug={(await params).slug} />;
}
