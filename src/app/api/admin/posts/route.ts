import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';

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

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || getCurrentMonth();

  const supabase = getServiceSupabase();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      users!inner(username, phone, pix_key)
    `)
    .eq('ranking_month', month)
    .is('deleted_at', null)
    .order('amount', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts || [] });
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { postId, action } = await request.json();

    if (!postId || !action) {
      return NextResponse.json({ error: 'postId e action são obrigatórios' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    switch (action) {
      case 'approve_payment': {
        const { error } = await supabase
          .from('posts')
          .update({ payment_status: 'approved' })
          .eq('id', postId);
        if (error) throw error;
        return NextResponse.json({ message: 'Pagamento aprovado' });
      }

      case 'reject_payment': {
        const { error } = await supabase
          .from('posts')
          .update({ payment_status: 'rejected' })
          .eq('id', postId);
        if (error) throw error;
        return NextResponse.json({ message: 'Pagamento rejeitado' });
      }

      case 'delete': {
        const { error } = await supabase
          .from('posts')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', postId);
        if (error) throw error;
        return NextResponse.json({ message: 'Postagem removida' });
      }

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
