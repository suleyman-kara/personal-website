import { ProjectsRoute, projectsMetadata } from '@/lib/pages';

export const metadata = projectsMetadata('en');

export default function Page() {
  return <ProjectsRoute lang="en" />;
}
