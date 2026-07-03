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

  const { data: config, error } = await supabase
    .from('payment_config')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ config: config || null });
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { accessToken, publicKey, pixKey, sandbox } = await request.json();

    const supabase = getServiceSupabase();

    // Test Mercado Pago connection
    let integrationStatus = 'disconnected';
    if (accessToken) {
      try {
        const baseUrl = sandbox
          ? 'https://api.mercadopago.com/sandbox/v1'
          : 'https://api.mercadopago.com/v1';

        const testRes = await fetch(`${baseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        integrationStatus = testRes.ok ? 'connected' : 'error';
      } catch {
        integrationStatus = 'error';
      }
    }

    // Upsert payment config
    const { data: existing } = await supabase
      .from('payment_config')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('payment_config')
        .update({
          access_token: accessToken || null,
          public_key: publicKey || null,
          pix_key: pixKey || null,
          sandbox: sandbox ?? true,
          integration_status: integrationStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('payment_config')
        .insert({
          access_token: accessToken || null,
          public_key: publicKey || null,
          pix_key: pixKey || null,
          sandbox: sandbox ?? true,
          integration_status: integrationStatus,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      config: result,
      integrationStatus,
      message: integrationStatus === 'connected'
        ? 'Conexão com Mercado Pago estabelecida!'
        : 'Configurações salvas, mas a conexão falhou.',
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
