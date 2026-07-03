import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scambo - Ranking Mensal',
  description: 'Participe do ranking mensal e concorra a prêmios!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
