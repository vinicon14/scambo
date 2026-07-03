'use client';

import Image from 'next/image';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { HallOfFameEntry } from '@/types';
import { Trophy, Crown } from 'lucide-react';

interface HallOfFameViewProps {
  entries: HallOfFameEntry[];
  loading: boolean;
}

export default function HallOfFameView({ entries, loading }: HallOfFameViewProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto" />
        <p className="mt-4 text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-400">Nenhum vencedor ainda</p>
        <p className="text-gray-400 mt-2">Participe do ranking mensal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 flex-shrink-0">
              <Image
                src={entry.winner_image_url}
                alt={entry.username}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <p className="font-bold text-lg text-gray-800">{entry.username}</p>
              </div>
              <p className="text-sm text-purple-600 font-medium capitalize">
                {formatMonthYear(entry.month)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Postado</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(entry.posted_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Prêmio Recebido</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(entry.prize_amount)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
