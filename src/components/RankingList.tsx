'use client';

import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Medal, Trophy, Award, Crown, TrendingUp } from 'lucide-react';
import { RankingEntry } from '@/types';
import { useLocale, useTranslations } from 'next-intl';

interface RankingListProps {
  entries: RankingEntry[];
  prize: number;
  loading: boolean;
}

export default function RankingList({ entries, prize, loading }: RankingListProps) {
  const locale = useLocale();
  const t = useTranslations('rankingList');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 font-medium">{t('loading')}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-purple-300" />
        </div>
        <p className="text-2xl font-bold text-gray-300">{t('emptyHeading')}</p>
        <p className="text-gray-400 mt-2">{t('emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div>
      {prize > 0 && (
        <div className="animate-slide-down mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 p-[1px]">
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-5 text-center relative">
            <div className="absolute inset-0 animate-shimmer rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <p className="text-amber-700 text-xs uppercase tracking-widest font-semibold">{t('estimatedPrize')}</p>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {formatCurrency(prize, locale)}
              </p>
              <p className="text-amber-500 text-xs mt-1 font-medium">{t('firstPlace')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.map((entry, index) => {
          const delay = index * 100;
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;
          const isTop3 = isFirst || isSecond || isThird;

          return (
            <div
              key={entry.post_id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${delay}ms` }}
            >
              {isFirst ? (
                <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-5 animate-glow-pulse">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 relative">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md">
                        <Image
                          src={entry.image_url}
                          alt={entry.username}
                          fill
                          className="object-cover"
                          sizes="96px"
                          unoptimized
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg sm:text-xl font-bold text-yellow-900 truncate">{entry.username}</p>
                      <p className="text-2xl sm:text-3xl font-black text-yellow-700 mt-1">{formatCurrency(entry.amount, locale)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                  isSecond
                    ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                    : isThird
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50/30 border-amber-200'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}>
                  <div className="flex-shrink-0 w-9 text-center">
                    {isSecond && <Medal className="w-6 h-6 text-gray-400 mx-auto" />}
                    {isThird && <Award className="w-6 h-6 text-amber-600 mx-auto" />}
                    {!isTop3 && <span className="text-base font-bold text-gray-300">#{entry.pos}</span>}
                  </div>

                  <div className={`relative rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                    isSecond ? 'w-14 h-14 border-gray-300' :
                    isThird ? 'w-12 h-12 border-amber-300' :
                    'w-10 h-10 border-gray-200 rounded-full'
                  }`}>
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
                    <p className={`font-semibold truncate ${
                      isSecond ? 'text-gray-800 text-base' :
                      isThird ? 'text-gray-800 text-sm' :
                      'text-gray-600 text-sm'
                    }`}>
                      {entry.username}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold ${
                      isSecond ? 'text-gray-700 text-base' :
                      isThird ? 'text-amber-700 text-sm' :
                      'text-gray-500 text-sm'
                    }`}>
                      {formatCurrency(entry.amount, locale)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {entries.length >= 3 && (
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: `${entries.length * 100}ms` }}>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 rounded-2xl p-5 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {t('prizeSection')}
            </p>
            <p className="leading-relaxed">
              {t('prizeDescription')}
            </p>
            <p className="text-gray-400 mt-1">
              {t('prizeExample')}{' '}
              <strong className="text-purple-600">{formatCurrency(300, locale)}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
