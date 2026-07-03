import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId é obrigatório' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data: post } = await supabase
      .from('posts')
      .select('payment_status, payment_id')
      .eq('id', postId)
      .single();

    if (!post) {
      return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      status: post.payment_status,
      paymentId: post.payment_id,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
