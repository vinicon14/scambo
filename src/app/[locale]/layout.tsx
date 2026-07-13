import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import Header from '@/components/Header';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    keywords: [t('keywords')],
    authors: [{ name: 'Scambo' }],
    creator: 'Scambo',
    publisher: 'Scambo',
    metadataBase: new URL('https://scambo.shop'),
    alternates: {
      canonical: '/',
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === 'pt' ? '/' : `/${l}`])
      ),
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    verification: {
      google: 'b1lmBH_K68tLv38jBvK3Oz_xx3OiMBT4STiiZBL8gJI',
      other: {
        'google-site-verification': 'b1lmBH_K68tLv38jBvK3Oz_xx3OiMBT4STiiZBL8gJI',
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      siteName: 'Scambo',
      locale: 'pt_BR',
      type: 'website',
      url: 'https://scambo.shop',
      countryName: 'Brasil',
      emails: ['contato@scambo.shop'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('twitterDescription'),
      site: '@scambo',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'entertainment',
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'footer' });

  return (
    <html lang={locale === 'pt' ? 'pt-BR' : locale}>
      <head>
        <meta name="google-site-verification" content="b1lmBH_K68tLv38jBvK3Oz_xx3OiMBT4STiiZBL8gJI" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Scambo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=yes" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] text-white`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18320384493"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18320384493');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Scambo',
url: 'https://scambo.shop',
              description: 'Ranking mensal de fotos com prêmio em dinheiro via Pix.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://scambo.shop/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-6 min-h-[60vh]">
            {children}
          </div>
          <footer className="border-t border-gray-800 mt-12">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div className="space-y-2">
                  <p className="font-bold text-gray-300">{t('brand')}</p>
                  <ul className="space-y-1.5 text-gray-400">
                    <li><Link href="/" className="hover:text-purple-400 transition">{t('ranking')}</Link></li>
                    <li><Link href="/criar-postagem" className="hover:text-purple-400 transition">{t('createPost')}</Link></li>
                    <li><Link href="/hall-da-fama" className="hover:text-purple-400 transition">{t('hallOfFame')}</Link></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-gray-300">{t('infoHeading')}</p>
                  <ul className="space-y-1.5 text-gray-400">
                    <li><Link href="/como-funciona" className="hover:text-purple-400 transition">{t('howItWorks')}</Link></li>
                    <li><Link href="/faq" className="hover:text-purple-400 transition">{t('faq')}</Link></li>
                    <li><Link href="/concurso-de-fotos-premio" className="hover:text-purple-400 transition">{t('photoContest')}</Link></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-gray-300">{t('participateHeading')}</p>
                  <ul className="space-y-1.5 text-gray-400">
                    <li><Link href="/ganhe-dinheiro-com-fotos" className="hover:text-purple-400 transition">{t('makeMoney')}</Link></li>
                    <li><Link href="/criar-postagem" className="hover:text-purple-400 transition">{t('sendPhoto')}</Link></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-gray-300">{t('contactHeading')}</p>
                  <ul className="space-y-1.5 text-gray-400">
                    <li>{t('contactEmail')}</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Scambo. {t('copyright')}
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
