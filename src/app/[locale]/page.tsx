import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import RankingPageClient from '../RankingPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const month = getCurrentMonth();

async function ensureMonthlyRanking() {
  const supabase = getServiceSupabase();
  try {
    const { data: existing } = await supabase
      .from('monthly_rankings')
      .select('id')
      .eq('month', month)
      .maybeSingle();

    if (!existing) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await supabase.from('monthly_rankings').insert({
        month,
        starts_at: now.toISOString(),
        ends_at: new Date(nextMonth.getTime() - 1).toISOString(),
        status: 'active',
      });
    }
  } catch {}
}

async function fetchRankingOnly() {
  const supabase = getServiceSupabase();
  try {
    const [rankingRes, prizeRes, currentRes] = await Promise.all([
      supabase.rpc('get_public_ranking', { p_month: month }),
      supabase.rpc('calculate_prize', { p_month: month }),
      supabase.from('monthly_rankings').select('ends_at, prize_amount, month').eq('month', month).single(),
    ]);

    return {
      ranking: rankingRes.data || [],
      prize: prizeRes.data?.[0]?.estimated_prize || 0,
      endsAt: currentRes.data?.ends_at || '',
      month: currentRes.data?.month || month,
    };
  } catch {
    return { ranking: [], prize: 0, endsAt: '', month };
  }
}

let rankingPromise: ReturnType<typeof fetchRankingOnly> | null = null;

async function getRankingData() {
  await ensureMonthlyRanking();
  if (!rankingPromise) {
    rankingPromise = fetchRankingOnly();
  }
  return rankingPromise;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  const { ranking } = await getRankingData();
  const firstImage = ranking?.[0]?.image_url;

  return {
    openGraph: {
      title: t('ogTitle'),
      description: firstImage ? 'Confira o ranking do mês!' : t('ogDescription'),
      images: firstImage ? [{ url: firstImage, width: 800, height: 800 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: firstImage ? 'Confira o ranking do mês!' : t('twitterDescription'),
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await getRankingData();
  return <RankingPageClient {...data} />;
}
