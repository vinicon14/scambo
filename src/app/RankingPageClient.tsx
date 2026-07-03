'use client';

import { useState } from 'react';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import RankingList from '@/components/RankingList';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { RankingEntry } from '@/types';
import { Award, PlusCircle, Trophy } from 'lucide-react';

interface Props {
  ranking: RankingEntry[];
  prize: number;
  endsAt: string;
  month: string;
}

export default function RankingPageClient({ ranking: initialRanking, prize: initialPrize, endsAt, month }: Props) {
  const [ranking] = useState(initialRanking);
  const [prize] = useState(initialPrize);

  return (
    <div className="space-y-6">
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
    </div>
  );
}
