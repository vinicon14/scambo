'use client';

import { useState } from 'react';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import RankingList from '@/components/RankingList';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { RankingEntry } from '@/types';
import { Award, Trophy } from 'lucide-react';

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

      <div className="flex justify-center">
        <Link
          href="/hall-da-fama"
          className="flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:bg-purple-50 transition shadow-sm"
        >
          <Award className="w-5 h-5" />
          Ver Hall da Fama
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
