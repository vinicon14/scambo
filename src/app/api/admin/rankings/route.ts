import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

async function checkAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  if (!match) return null;

  const supabase = getServiceSupabase();
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', match[1])
    .single();

  return admin;
}

export async function GET(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = getServiceSupabase();

  const { data: rankings, error } = await supabase
    .from('monthly_rankings')
    .select('*, hall_of_fame(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rankings: rankings || [] });
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { action } = await request.json();

    if (action !== 'close_month') {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase.rpc('close_monthly_ranking');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Ranking mensal encerrado com sucesso!' });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { rankingId, prizePaid } = await request.json();

    if (!rankingId) {
      return NextResponse.json({ error: 'rankingId é obrigatório' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('monthly_rankings')
      .update({ prize_paid: prizePaid })
      .eq('id', rankingId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Status do prêmio atualizado' });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
