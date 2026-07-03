import { supabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';
import RankingPageClient from './RankingPageClient';

export const dynamic = 'force-dynamic';

async function getRankingData() {
  const supabaseService = supabase;
  const month = getCurrentMonth();

  // Ensure current month ranking exists
  const { data: existing } = await supabaseService
    .from('monthly_rankings')
    .select('id')
    .eq('month', month)
    .maybeSingle();

  if (!existing) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const endsAtDate = new Date(nextMonth.getTime() - 1).toISOString();

    await supabaseService
      .from('monthly_rankings')
      .insert({
        month,
        starts_at: now.toISOString(),
        ends_at: endsAtDate,
        status: 'active',
      });
  }

  const { data: ranking } = await supabaseService
    .rpc('get_public_ranking', { p_month: month });

  const { data: prize } = await supabaseService
    .rpc('calculate_prize', { p_month: month });

  const { data: currentRanking } = await supabaseService
    .from('monthly_rankings')
    .select('ends_at, prize_amount, month')
    .eq('month', month)
    .single();

  return {
    ranking: ranking || [],
    prize: prize?.[0]?.estimated_prize || 0,
    endsAt: currentRanking?.ends_at || '',
    month: currentRanking?.month || month,
  };
}

export default async function HomePage() {
  const data = await getRankingData();
  return <RankingPageClient {...data} />;
}
