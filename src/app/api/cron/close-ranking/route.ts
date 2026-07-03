import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    if (today.getDate() !== lastDay) {
      return NextResponse.json({ ok: true, skipped: 'not last day of month' });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.rpc('close_monthly_ranking');

    if (error && !error.message?.includes('No active ranking')) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, closed: !error });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
