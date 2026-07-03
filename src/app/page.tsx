import { supabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';
import RankingPageClient from './RankingPageClient';

export const dynamic = 'force-dynamic';

async function getRankingData() {
  const month = getCurrentMonth();

  try {
    // Ensure current month ranking exists
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
    return {
      ranking: [],
      prize: 0,
      endsAt: '',
      month,
    };
  }
}

export default async function HomePage() {
  const data = await getRankingData();
  return <RankingPageClient {...data} />;
}
