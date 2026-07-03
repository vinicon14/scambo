import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { imageUrl, amount, phone, password, pixKey, username } = await request.json();

    if (!imageUrl || !amount || !phone || !password || !pixKey || !username) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > 100000) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .maybeSingle();

    let finalUserId: string;

    if (existingUser) {
      finalUserId = existingUser.id;
      // Update user data
      const passwordHash = await bcrypt.hash(password, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({ phone, pix_key: pixKey, password_hash: passwordHash })
        .eq('id', finalUserId);

      if (updateError) {
        return NextResponse.json({ error: 'Erro ao atualizar dados do usuário' }, { status: 500 });
      }
    } else {
      // Create new user
      finalUserId = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: finalUserId,
          username,
          phone,
          password_hash: passwordHash,
          pix_key: pixKey,
        });

      if (createError) {
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
      }
    }

    const month = getCurrentMonth();

    // Verify month exists
    const { data: ranking } = await supabase
      .from('monthly_rankings')
      .select('id')
      .eq('month', month)
      .eq('status', 'active')
      .maybeSingle();

    if (!ranking) {
      return NextResponse.json({ error: 'Nenhum ranking ativo para este mês' }, { status: 400 });
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: finalUserId,
        image_url: imageUrl,
        amount: amountNum,
        ranking_month: month,
      })
      .select()
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
    }

    return NextResponse.json({
      post,
      userId: finalUserId,
      message: 'Postagem criada com sucesso!',
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
