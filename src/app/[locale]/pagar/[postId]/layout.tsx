import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento',
  description: 'Finalize seu pagamento via Pix ou Mercado Pago e apareça no ranking do Scambo!',
  robots: { index: false, follow: false },
};

export default function PagarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
