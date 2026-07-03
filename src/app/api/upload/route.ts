import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import crypto from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Arquivo e userId são obrigatórios' }, { status: 400 });
    }

    // Validate file type by extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Formato de arquivo não permitido' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo inválido' }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 });
    }

    // Validate real file type by reading magic bytes
    const buffer = Buffer.from(await file.arrayBuffer());
    const header = buffer.toString('hex', 0, 4).toUpperCase();

    const validHeaders: Record<string, string[]> = {
      'image/jpeg': ['FFD8FFE0', 'FFD8FFE1', 'FFD8FFE2', 'FFD8FFDB'],
      'image/png': ['89504E47'],
      'image/webp': ['52494646'],
      'image/gif': ['47494638'],
    };

    const isValidHeader = Object.values(validHeaders).some((headers) =>
      headers.some((h) => header.startsWith(h.substring(0, header.length)))
    );

    if (!isValidHeader) {
      return NextResponse.json({ error: 'Arquivo corrompido ou tipo inválido' }, { status: 400 });
    }

    // Check for dangerous content (basic SVG/script injection)
    const contentStr = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
    const dangerousPatterns = [
      /<script/i, /javascript:/i, /onerror/i, /onload/i,
      /<svg/i, /<!DOCTYPE/i, /<\?xml/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(contentStr)) {
        return NextResponse.json({ error: 'Arquivo rejeitado por segurança' }, { status: 400 });
      }
    }

    // Generate unique filename
    const safeUserId = userId && userId !== 'pending' ? userId : 'uploads';
    const filename = `${safeUserId}/${crypto.randomUUID()}${ext}`;

    const supabase = getServiceSupabase();

    const { error: uploadError } = await supabase.storage
      .from('post_images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Erro ao fazer upload: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('post_images')
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl, filename });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
