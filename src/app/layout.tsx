import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ThemeProvider, Theme } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchProvider } from '@/components/SearchContext';
import { BackToTop } from '@/components/BackToTop';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'DenizenM Meta Documentation',
  description: 'Fast, high-performance meta-documentation explorer for DenizenM script commands, tags, events, mechanisms, and object types.',
  keywords: ['DenizenM', 'Denizen', 'DenizenScript', 'Minecraft', 'Scripting', 'Tags', 'Commands', 'Mechanisms', 'Events'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('cookie_theme')?.value;
  const initialTheme: Theme =
    themeCookie === 'dark' ? 'dark' :
    themeCookie === 'graphite' ? 'graphite' :
    themeCookie === 'light' ? 'light' : 'black';
  const htmlClass =
    initialTheme === 'black' ? 'dark theme-black' :
    initialTheme === 'graphite' ? 'dark theme-graphite' :
    initialTheme === 'dark' ? 'dark' : '';

  return (
    <html lang="en" className={htmlClass} data-theme={initialTheme} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#00bc8c]/25 selection:text-[#00bc8c] relative">
        {/* Ambient Gradient & Mesh Background (Fast static, 0% GPU overhead) */}
        <div className="ambient-mesh fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,188,140,0.14),transparent_70%)] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />

        <ThemeProvider initialTheme={initialTheme}>
          <SearchProvider>
            <Navbar />
            <main className="flex-1 w-full relative z-0">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </SearchProvider>
        </ThemeProvider>

        <Script src="/js/flasher.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
