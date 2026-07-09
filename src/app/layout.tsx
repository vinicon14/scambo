import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scambo - Ranking Mensal',
  description: 'Participe do ranking mensal de fotos e concorra a prêmios em dinheiro via Pix.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
