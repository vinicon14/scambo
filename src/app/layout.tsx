import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Header from '@/components/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Scambo - Ranking Mensal',
    template: '%s | Scambo',
  },
  description: 'Participe do ranking mensal de fotos e concorra a prêmios em dinheiro via Pix. Envie sua foto, pague via Pix e veja sua posição no ranking ao vivo!',
  keywords: ['ranking', 'concurso de fotos', 'prêmio em dinheiro', 'Pix', 'Scambo', 'ranking mensal', 'foto', 'concorrer', 'dinheiro fácil'],
  authors: [{ name: 'Scambo' }],
  creator: 'Scambo',
  publisher: 'Scambo',
  metadataBase: new URL('https://www.scambo.shop'),
  alternates: {
    canonical: '/',
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
    title: 'Scambo - Ranking Mensal de Fotos',
    description: 'Participe do ranking mensal e concorra a prêmios em dinheiro via Pix. Envie sua foto, pague, ganhe!',
    siteName: 'Scambo',
    locale: 'pt_BR',
    type: 'website',
    url: 'https://www.scambo.shop',
    countryName: 'Brasil',
    emails: ['contato@scambo.shop'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scambo - Ranking Mensal de Fotos',
    description: 'Participe do ranking mensal e concorra a prêmios em dinheiro via Pix!',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
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
      <body className={`${inter.className} bg-gray-50`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Scambo',
              url: 'https://www.scambo.shop',
              description: 'Ranking mensal de fotos com prêmio em dinheiro via Pix.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.scambo.shop/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6 min-h-[60vh]">
          {children}
        </div>
        <footer className="bg-gray-100 border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Scambo</p>
                <ul className="space-y-1.5 text-gray-500">
                  <li><Link href="/" className="hover:text-purple-600 transition">Ranking</Link></li>
                  <li><Link href="/criar-postagem" className="hover:text-purple-600 transition">Criar Postagem</Link></li>
                  <li><Link href="/hall-da-fama" className="hover:text-purple-600 transition">Hall da Fama</Link></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Informações</p>
                <ul className="space-y-1.5 text-gray-500">
                  <li><Link href="/como-funciona" className="hover:text-purple-600 transition">Como Funciona</Link></li>
                  <li><Link href="/faq" className="hover:text-purple-600 transition">FAQ</Link></li>
                  <li><Link href="/concurso-de-fotos-premio" className="hover:text-purple-600 transition">Concurso de Fotos</Link></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Participe</p>
                <ul className="space-y-1.5 text-gray-500">
                  <li><Link href="/ganhe-dinheiro-com-fotos" className="hover:text-purple-600 transition">Ganhe Dinheiro</Link></li>
                  <li><Link href="/criar-postagem" className="hover:text-purple-600 transition">Enviar Foto</Link></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-gray-800">Contato</p>
                <ul className="space-y-1.5 text-gray-500">
                  <li>contato@scambo.shop</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-6 pt-4 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Scambo. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
