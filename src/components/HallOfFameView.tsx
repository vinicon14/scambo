'use client';

import Image from 'next/image';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { HallOfFameEntry } from '@/types';
import { Trophy, Crown, Medal } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HallOfFameViewProps {
  entries: HallOfFameEntry[];
  loading: boolean;
}

const rankIcons = [
  <Crown key="c" className="w-5 h-5 text-yellow-500" />,
  <Medal key="m" className="w-5 h-5 text-gray-400" />,
  <Medal key="a" className="w-5 h-5 text-amber-600" />,
];

export default function HallOfFameView({ entries, loading }: HallOfFameViewProps) {
  const t = useTranslations('hallOfFame');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
        <p className="text-gray-400 font-medium">{t('loading')}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-amber-300" />
        </div>
        <p className="text-2xl font-bold text-gray-300">{t('noWinner')}</p>
        <p className="text-gray-400 mt-2">{t('noWinnerDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, idx) => (
        <div
          key={entry.id}
          className="animate-fade-in-up bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
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
                <span className={idx < 3 ? '' : 'hidden'}>{rankIcons[idx] || null}</span>
                <p className="font-bold text-lg text-gray-800">{entry.username}</p>
              </div>
              <p className="text-sm text-purple-600 font-medium capitalize">
                {formatMonthYear(entry.month)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('postedValue')}</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(entry.posted_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('prizeReceived')}</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(entry.prize_amount)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
