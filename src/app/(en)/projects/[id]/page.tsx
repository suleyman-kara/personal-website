import { ProjectRoute, projectMetadata, projectParams } from '@/lib/pages';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: Props) {
  return projectMetadata('en', (await params).id);
}

export default async function Page({ params }: Props) {
  return <ProjectRoute lang="en" id={(await params).id} />;
}
