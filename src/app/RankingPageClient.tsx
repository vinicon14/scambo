'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import RankingList from '@/components/RankingList';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { RankingEntry } from '@/types';
import ShareButtons from '@/components/ShareButtons';
import { Award, CheckCircle, XCircle, PlusCircle, Trophy, ChevronDown } from 'lucide-react';

interface Props {
  ranking: RankingEntry[];
  prize: number;
  endsAt: string;
  month: string;
}

export default function RankingPageClient({ ranking: initialRanking, prize: initialPrize, endsAt, month }: Props) {
  const [ranking] = useState(initialRanking);
  const [prize] = useState(initialPrize);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getPaymentStatus = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('payment');
  }, []);

  useEffect(() => {
    const status = getPaymentStatus();
    if (status === 'success') {
      setPaymentMessage({ type: 'success', text: 'Pagamento aprovado! Sua foto aparecerá no ranking em instantes.' });
    } else if (status === 'failure') {
      setPaymentMessage({ type: 'error', text: 'Pagamento não foi concluído. Tente novamente.' });
    } else if (status === 'pending') {
      setPaymentMessage({ type: 'error', text: 'Pagamento está pendente. Assim que for aprovado, sua foto aparecerá no ranking.' });
    }
    if (status) {
      window.history.replaceState({}, '', '/');
    }
  }, [getPaymentStatus]);

  return (
    <div className="space-y-6">
      {paymentMessage && (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium ${
          paymentMessage.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {paymentMessage.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
            : <XCircle className="w-5 h-5 flex-shrink-0" />
          }
          {paymentMessage.text}
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Ranking {formatMonthYear(month)}
        </h1>
      </div>

      {endsAt && <Countdown endsAt={endsAt} />}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/criar-postagem"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          Criar Postagem
        </Link>
        <Link
          href="/hall-da-fama"
          className="flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:bg-purple-50 transition shadow-sm"
        >
          <Award className="w-5 h-5" />
          Hall da Fama
        </Link>
      </div>

      <div className="flex justify-center">
        <ShareButtons />
      </div>

      <RankingList entries={ranking} prize={prize} loading={false} />

      {ranking.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-sm text-gray-500 shadow-sm">
          <p className="font-semibold text-gray-700 mb-1">Como funciona o prêmio?</p>
          <p>
            O primeiro lugar recebe o valor que pagou + 50% da soma de todas as outras postagens.
            Exemplo: você posta R$100 e as outras postagens somam R$400. Seu prêmio = R$100 + R$200 ={' '}
            <strong className="text-purple-700">{formatCurrency(300)}</strong>.
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Dúvidas frequentes</h2>
        <div className="space-y-2 text-sm">
          {[
            { q: 'O que é o Scambo?', a: 'É um concurso de fotos online. Você envia sua foto, paga um valor via Pix e concorre a prêmios em dinheiro todo mês.' },
            { q: 'Quanto custa?', a: 'A partir de R$ 5. Você escolhe o valor.' },
            { q: 'Como recebo se ganhar?', a: 'O prêmio é transferido via Pix para a chave que você cadastrou.' },
            { q: 'Preciso ser influencer?', a: 'Não! Qualquer pessoa pode participar.' },
          ].map((item) => (
            <details key={item.q} className="group">
              <summary className="cursor-pointer font-medium text-gray-700 hover:text-purple-700 transition-colors list-none flex items-center justify-between gap-2 py-1">
                {item.q}
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <p className="text-gray-500 pt-1 pb-2 pl-1">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center pt-1">
          Veja <Link href="/faq" className="text-purple-600 hover:underline">todas as perguntas</Link> · <Link href="/como-funciona" className="text-purple-600 hover:underline">como funciona</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'O que é o Scambo?', acceptedAnswer: { '@type': 'Answer', text: 'É um concurso de fotos online. Você envia sua foto, paga um valor via Pix e concorre a prêmios em dinheiro todo mês.' } },
              { '@type': 'Question', name: 'Quanto custa para participar?', acceptedAnswer: { '@type': 'Answer', text: 'A partir de R$ 5. Você escolhe o valor que deseja pagar.' } },
              { '@type': 'Question', name: 'Como recebo o prêmio se ganhar?', acceptedAnswer: { '@type': 'Answer', text: 'O prêmio é transferido via Pix para a chave que você cadastrou ao criar sua postagem.' } },
              { '@type': 'Question', name: 'Preciso ser influencer para participar?', acceptedAnswer: { '@type': 'Answer', text: 'Não! Qualquer pessoa pode participar, não precisa de seguidores ou habilidades especiais.' } },
            ],
          }),
        }}
      />
    </div>
  );
}
