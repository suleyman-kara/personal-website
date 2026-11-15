import type { Metadata } from 'next';
import RootDocument from '@/components/RootDocument';
import LangLink from '@/components/LangLink';
import { primaryBtn, secondaryBtn } from '@/components/styles';

// Served as dist/404.html for any unknown URL, in either language, so it speaks both.
export const metadata: Metadata = {
  title: 'Page not found · Sayfa bulunamadı | Süleyman Kara',
  description: 'This page does not exist. Bu sayfa yok.',
  robots: { index: false },
  icons: { icon: [{ url: '/favicon.png', type: 'image/png' }] },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <main className="min-h-screen flex items-center">
        <div className="relative w-full overflow-hidden">
          <div className="stripe-hero absolute inset-x-0 top-0 h-[420px] -skew-y-6 origin-top-left -translate-y-32" />
          <div className="relative max-w-3xl mx-auto px-5 py-24">
            <img src="/profile.jpg" alt="" className="w-14 h-14 rounded-full object-cover ring-4 ring-card shadow-xl shadow-[#635BFF]/20" />
            <div className="mt-8 text-sm font-semibold text-accent">404</div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-ink">Page not found.</h1>
            <p className="mt-4 text-lg text-muted">The link may be old, or the address has a typo.</p>
            <div lang="tr" className="mt-8 pt-8 border-t border-line/70">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">Sayfa bulunamadı.</h2>
              <p className="mt-3 text-lg text-muted">Bağlantı eski olabilir ya da adreste bir yazım hatası var.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <LangLink lang="en" href="/" className={primaryBtn}>
                Home page
              </LangLink>
              <LangLink lang="tr" href="/tr/" className={secondaryBtn}>
                Ana sayfa
              </LangLink>
            </div>
          </div>
        </div>
      </main>
    </RootDocument>
  );
}
