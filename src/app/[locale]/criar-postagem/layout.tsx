import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Postagem',
  description: 'Envie sua foto e participe do ranking mensal do Scambo. Concorra a prêmios em dinheiro via Pix!',
  openGraph: {
    title: 'Criar Postagem - Scambo',
    description: 'Envie sua foto e participe do ranking mensal. Concorra a prêmios!',
  },
};

export default function CriarPostagemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
