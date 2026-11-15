// Route glue shared by the English (src/app/(en)) and Turkish (src/app/(tr)/tr)
// route files, which only pick the language. Runs at build time.
import { notFound } from 'next/navigation';
import { PROFILE_DATA, PROJECTS } from '@/data/portfolioData';
import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectDetail from '@/components/pages/ProjectDetail';
import BlogIndex from '@/components/pages/BlogIndex';
import PostPage from '@/components/pages/PostPage';
import AboutPage from '@/components/pages/AboutPage';
import LinksPage from '@/components/pages/LinksPage';
import { getLatestArticles, getPost, getPosts, getStream, hasPost } from './content';
import { renderMarkdown } from './markdown';
import { hasBlog } from './routes';
import { pageMetadata } from './seo';
import { otherLang, type Lang } from './site';

const tt = (lang: Lang, en: string, tr: string) => (lang === 'en' ? en : tr);

/* Home */
export const homeMetadata = (lang: Lang) =>
  pageMetadata({
    lang,
    path: '/',
    title: tt(lang, 'Süleyman Kara | Computer Engineering & Machine Learning', 'Süleyman Kara | Bilgisayar Mühendisliği & Makine Öğrenmesi'),
    description: tt(
      lang,
      'Third-year Computer Engineering student at Çukurova University, focused on machine learning and building web and AI-powered applications with AI coding agents.',
      'Çukurova Üniversitesi 3. sınıf Bilgisayar Mühendisliği öğrencisi; makine öğrenmesi ve AI kodlama ajanlarıyla web ve yapay zeka destekli uygulamalar geliştirmeye odaklanıyor.',
    ),
  });
export const HomeRoute = ({ lang }: { lang: Lang }) => <HomePage lang={lang} articles={getLatestArticles(lang)} />;

/* Projects */
export const projectsMetadata = (lang: Lang) =>
  pageMetadata({
    lang,
    path: '/projects/',
    section: tt(lang, 'Projects', 'Projeler'),
    description: tt(
      lang,
      'Competition entries, products and tools, grouped by focus area: machine learning, web and full-stack, systems and automation.',
      'Yarışma projeleri, ürünler ve araçlar; makine öğrenmesi, web ve full-stack, sistem ve otomasyon olarak gruplandı.',
    ),
  });
export const ProjectsRoute = ({ lang }: { lang: Lang }) => <ProjectsPage lang={lang} />;

/* Project detail */
export const projectParams = () => PROJECTS.map((p) => ({ id: p.id }));
export function projectMetadata(lang: Lang, id: string) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return {};
  return pageMetadata({
    lang,
    path: `/projects/${p.id}/`,
    section: p.name,
    description: p.summary[lang],
    image: p.image ? `/${p.image}` : undefined,
    imageAlt: p.image ? tt(lang, `${p.name} screenshot`, `${p.name} ekran görüntüsü`) : undefined,
  });
}
export function ProjectRoute({ lang, id }: { lang: Lang; id: string }) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) notFound();
  return <ProjectDetail lang={lang} project={p} />;
}

/* Blog */
export const blogMetadata = (lang: Lang) =>
  pageMetadata({
    lang,
    path: '/blog/',
    section: 'Blog',
    description: tt(lang, `Articles, notes and videos by ${PROFILE_DATA.name}.`, `${PROFILE_DATA.name}: yazılar, notlar ve videolar.`),
  });
export const BlogRoute = ({ lang }: { lang: Lang }) => <BlogIndex lang={lang} items={getStream(lang)} />;

/* Post */
// A static export cannot have a dynamic route with no pages, so an empty language gets one
// placeholder that renders the 404 page and is removed from dist/ by scripts/postbuild.mjs.
export const EMPTY_SLUG = '__none__';
export const postParams = (lang: Lang) => {
  const slugs = getPosts(lang).map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: EMPTY_SLUG }];
};
export function postMetadata(lang: Lang, slug: string) {
  const post = getPost(lang, slug);
  if (!post) return {};
  return pageMetadata({
    lang,
    path: `/blog/${slug}/`,
    section: post.title,
    description: post.summary,
    image: post.cover ?? (post.youtube ? `https://i.ytimg.com/vi/${post.youtube}/hqdefault.jpg` : undefined),
    type: 'article',
    publishedTime: post.date,
  });
}
export async function PostRoute({ lang, slug }: { lang: Lang; slug: string }) {
  const post = getPost(lang, slug);
  if (!post) notFound();
  const posts = getPosts(lang);
  const i = posts.findIndex((p) => p.slug === slug);
  const pick = (p: (typeof posts)[number] | undefined) => (p ? { slug: p.slug, title: p.title } : null);
  return (
    <PostPage
      lang={lang}
      post={post}
      html={await renderMarkdown(post.body)}
      newer={pick(posts[i - 1])}
      older={pick(posts[i + 1])}
      otherExists={hasPost(otherLang(lang), slug)}
    />
  );
}

/* About */
export const aboutMetadata = (lang: Lang) =>
  pageMetadata({
    lang,
    path: '/about/',
    section: tt(lang, 'About', 'Hakkımda'),
    description: tt(
      lang,
      'Experience, skills, GitHub activity, awards and education of Süleyman Kara, Computer Engineering student at Çukurova University.',
      'Çukurova Üniversitesi Bilgisayar Mühendisliği öğrencisi Süleyman Kara: deneyim, beceriler, GitHub etkinliği, dereceler ve eğitim.',
    ),
  });
export const AboutRoute = ({ lang }: { lang: Lang }) => <AboutPage lang={lang} />;

/* Links */
export const linksMetadata = (lang: Lang) =>
  pageMetadata({
    lang,
    path: '/links/',
    section: tt(lang, 'Links', 'Bağlantılar'),
    description: hasBlog(lang)
      ? tt(lang, 'Projects, blog and social profiles of Süleyman Kara.', 'Süleyman Kara: projeler, blog ve sosyal medya hesapları.')
      : tt(lang, 'Projects and social profiles of Süleyman Kara.', 'Süleyman Kara: projeler ve sosyal medya hesapları.'),
  });
export const LinksRoute = ({ lang }: { lang: Lang }) => <LinksPage lang={lang} hasBlog={hasBlog(lang)} />;
