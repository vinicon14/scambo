import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const month = getCurrentMonth();

    // Ensure current month ranking exists
    const { data: existing } = await supabase
      .from('monthly_rankings')
      .select('id')
      .eq('month', month)
      .maybeSingle();

    if (!existing) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const endsAtDate = new Date(nextMonth.getTime() - 1).toISOString();

      await supabase
        .from('monthly_rankings')
        .insert({
          month,
          starts_at: now.toISOString(),
          ends_at: endsAtDate,
          status: 'active',
        });
    }

    const { data: ranking, error: rankingError } = await supabase
      .rpc('get_public_ranking', { p_month: month });

    if (rankingError) {
      return NextResponse.json({ error: rankingError.message }, { status: 500 });
    }

    const { data: prize, error: prizeError } = await supabase
      .rpc('calculate_prize', { p_month: month });

    if (prizeError) {
      return NextResponse.json({ error: prizeError.message }, { status: 500 });
    }

    const { data: currentRanking } = await supabase
      .from('monthly_rankings')
      .select('ends_at, month')
      .eq('month', month)
      .single();

    return NextResponse.json({
      ranking: ranking || [],
      prize: prize?.[0]?.estimated_prize || 0,
      endsAt: currentRanking?.ends_at || '',
      month: currentRanking?.month || month,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
