import { ProjectsRoute, projectsMetadata } from '@/lib/pages';

export const metadata = projectsMetadata('tr');

export default function Page() {
  return <ProjectsRoute lang="tr" />;
}
