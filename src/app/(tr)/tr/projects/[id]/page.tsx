import { ProjectRoute, projectMetadata, projectParams } from '@/lib/pages';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: Props) {
  return projectMetadata('tr', (await params).id);
}

export default async function Page({ params }: Props) {
  return <ProjectRoute lang="tr" id={(await params).id} />;
}
