'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import RankingList from '@/components/RankingList';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { RankingEntry } from '@/types';
import ShareButtons from '@/components/ShareButtons';
import { Award, CheckCircle, XCircle, PlusCircle, Trophy, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
  ranking: RankingEntry[];
  prize: number;
  endsAt: string;
  month: string;
}

export default function RankingPageClient({ ranking: initialRanking, prize: initialPrize, endsAt, month }: Props) {
  const locale = useLocale();
  const t = useTranslations('home');
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
      setPaymentMessage({ type: 'success', text: t('paymentApproved') });
    } else if (status === 'failure') {
      setPaymentMessage({ type: 'error', text: t('paymentError') });
    } else if (status === 'pending') {
      setPaymentMessage({ type: 'error', text: t('paymentPending') });
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
          Ranking {formatMonthYear(month, locale)}
        </h1>
      </div>

      {endsAt && <Countdown endsAt={endsAt} />}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/criar-postagem"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          {t('createPost')}
        </Link>
        <Link
          href="/hall-da-fama"
          className="flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:bg-purple-50 transition shadow-sm"
        >
          <Award className="w-5 h-5" />
          {t('hallOfFame')}
        </Link>
      </div>

      <div className="flex justify-center">
        <ShareButtons />
      </div>

      <RankingList entries={ranking} prize={prize} loading={false} />

      {ranking.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-sm text-gray-500 shadow-sm">
          <p className="font-semibold text-gray-700 mb-1">{t('prizeSection')}</p>
          <p>
            {t('prizeDescription')}{' '}{t('prizeExample')}{' '}
            <strong className="text-purple-700">{formatCurrency(300, locale)}</strong>.
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-800">{t('faqMini.heading')}</h2>
        <div className="space-y-2 text-sm">
          {[
            { q: t('faqMini.q1'), a: t('faqMini.a1') },
            { q: t('faqMini.q2'), a: t('faqMini.a2') },
            { q: t('faqMini.q3'), a: t('faqMini.a3') },
            { q: t('faqMini.q4'), a: t('faqMini.a4') },
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
          Veja <Link href="/faq" className="text-purple-600 hover:underline">{t('faqMini.allQuestions')}</Link> · <Link href="/como-funciona" className="text-purple-600 hover:underline">{t('faqMini.howItWorks')}</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: t('faqMini.q1'), acceptedAnswer: { '@type': 'Answer', text: t('faqMini.a1') } },
              { '@type': 'Question', name: t('faqMini.q2'), acceptedAnswer: { '@type': 'Answer', text: t('faqMini.a2') } },
              { '@type': 'Question', name: t('faqMini.q3'), acceptedAnswer: { '@type': 'Answer', text: t('faqMini.a3') } },
              { '@type': 'Question', name: t('faqMini.q4'), acceptedAnswer: { '@type': 'Answer', text: t('faqMini.a4') } },
            ],
          }),
        }}
      />
    </div>
  );
}
