import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import crypto from 'crypto';

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

    const { data: config } = await supabase
      .from('payment_config')
      .select('*')
      .limit(1)
      .single();

    if (!config?.access_token) {
      return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 400 });
    }

    const paymentRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.access_token}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount: Number(post.amount),
        description: 'Postagem Ranking Scambo',
        payment_method_id: 'pix',
        payer: { email: 'pagamento@scambo.shop' },
        external_reference: post.id,
        notification_url: 'https://www.scambo.shop/api/webhook/mercadopago',
      }),
    });

    if (!paymentRes.ok) {
      const errBody = await paymentRes.text();
      return NextResponse.json({ error: 'Erro ao criar pagamento Pix' }, { status: 502 });
    }

    const payment = await paymentRes.json();
    const txData = payment.point_of_interaction?.transaction_data;

    // Store MP payment ID in the post
    await supabase
      .from('posts')
      .update({ payment_id: String(payment.id) })
      .eq('id', post.id);

    return NextResponse.json({
      paymentId: payment.id,
      qrCode: txData?.qr_code || '',
      qrCodeBase64: txData?.qr_code_base64 || '',
      ticketUrl: txData?.ticket_url || '',
      status: payment.status,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
