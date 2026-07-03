import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

async function getPaymentConfig() {
  const supabase = getServiceSupabase();
  const { data } = await supabase
    .from('payment_config')
    .select('*')
    .limit(1)
    .single();
  return data;
}

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'ID da postagem é obrigatório' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, amount')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
    }

    const config = await getPaymentConfig();
    if (!config?.access_token) {
      return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'https://www.scambo.shop';

    const preferenceRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          title: 'Postagem Ranking Scambo',
          quantity: 1,
          unit_price: Number(post.amount),
          currency_id: 'BRL',
        }],
        external_reference: post.id,
        back_urls: {
          success: `${origin}/?payment=success`,
          failure: `${origin}/?payment=failure`,
          pending: `${origin}/?payment=pending`,
        },
        auto_return: 'approved',
        binary_mode: true,
        notification_url: `${origin}/api/webhook/mercadopago`,
      }),
    });

    if (!preferenceRes.ok) {
      const errBody = await preferenceRes.text();
      return NextResponse.json({ error: 'Erro ao criar pagamento no Mercado Pago' }, { status: 502 });
    }

    const preference = await preferenceRes.json();

    await supabase
      .from('posts')
      .update({ payment_id: preference.id })
      .eq('id', post.id);

    return NextResponse.json({
      initPoint: preference.init_point,
      preferenceId: preference.id,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
