import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Handle both JSON webhook and form-encoded IPN
    const contentType = request.headers.get('content-type') || '';
    let paymentId: string | null = null;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      paymentId = body.data?.id || body.id || null;
    } else {
      const formData = await request.formData();
      paymentId = (formData.get('id') as string) || null;
      // IPN sends topic + id in URL params
      const url = new URL(request.url);
      paymentId = paymentId || url.searchParams.get('id');
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento não fornecido' }, { status: 400 });
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento não fornecido' }, { status: 400 });
    }

    const supabaseAdmin = getServiceSupabase();

    // Get payment config
    const { data: config } = await supabaseAdmin
      .from('payment_config')
      .select('*')
      .limit(1)
      .single();

    if (!config?.access_token) {
      return NextResponse.json({ error: 'Mercado Pago não configurado' }, { status: 400 });
    }

    // Fetch payment details from Mercado Pago
    const baseUrl = config.sandbox
      ? 'https://api.mercadopago.com/sandbox/v1/payments'
      : 'https://api.mercadopago.com/v1/payments';

    const paymentRes = await fetch(`${baseUrl}/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${config.access_token}`,
      },
    });

    if (!paymentRes.ok) {
      return NextResponse.json({ error: 'Erro ao validar pagamento no Mercado Pago' }, { status: 502 });
    }

    const payment = await paymentRes.json();

    // Validate payment
    if (payment.status !== 'approved') {
      return NextResponse.json({ message: 'Pagamento não aprovado', status: payment.status });
    }

    const externalReference = payment.external_reference;
    if (!externalReference) {
      return NextResponse.json({ error: 'Referência da postagem não encontrada' }, { status: 400 });
    }

    // external_reference is the post UUID
    const { data: post } = await supabaseAdmin
      .from('posts')
      .select('id, amount, payment_status')
      .eq('id', externalReference)
      .single();

    if (!post) {
      return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
    }

    // Validate amount matches
    const paidAmount = parseFloat(payment.transaction_amount);
    if (paidAmount !== post.amount) {
      return NextResponse.json({ error: 'Valor do pagamento não corresponde à postagem' }, { status: 400 });
    }

    // Update post status to approved
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ payment_status: 'approved' })
      .eq('id', post.id);

    if (updateError) {
      return NextResponse.json({ error: 'Erro ao atualizar postagem' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Pagamento aprovado com sucesso!' });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
