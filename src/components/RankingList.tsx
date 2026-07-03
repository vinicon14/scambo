'use client';

import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Medal, Trophy, Award, Crown } from 'lucide-react';
import { RankingEntry } from '@/types';

interface RankingListProps {
  entries: RankingEntry[];
  prize: number;
  loading: boolean;
}

const positionIcons = [
  <Crown key="1" className="w-6 h-6 text-yellow-400" />,
  <Medal key="2" className="w-6 h-6 text-gray-300" />,
  <Award key="3" className="w-6 h-6 text-amber-600" />,
];

export default function RankingList({ entries, prize, loading }: RankingListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto" />
        <p className="mt-4 text-gray-500">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div>
      {prize > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-center mb-6 shadow-lg">
          <p className="text-white/80 text-sm uppercase tracking-wide font-semibold">Prêmio Estimado do 1º Lugar</p>
          <p className="text-4xl font-black text-white mt-1">{formatCurrency(prize)}</p>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-400">Nenhuma postagem ainda</p>
          <p className="text-gray-400 mt-2">Seja o primeiro a participar!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={entry.post_id}
              className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition hover:shadow-md ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex-shrink-0 w-10 text-center">
                {index < 3 ? (
                  positionIcons[index]
                ) : (
                  <span className="text-lg font-bold text-gray-400">#{entry.position}</span>
                )}
              </div>

              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <Image
                  src={entry.image_url}
                  alt={entry.username}
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${index === 0 ? 'text-lg text-yellow-800' : 'text-gray-800'}`}>
                  {entry.username}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={`font-bold ${index === 0 ? 'text-yellow-700 text-lg' : 'text-purple-700'}`}>
                  {formatCurrency(entry.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
