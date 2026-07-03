'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { validateImageFile } from '@/lib/utils';

interface PostFormProps {
  onLoginSuccess?: (id: string, name: string) => void;
}

export default function PostForm({ onLoginSuccess }: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const validationError = validateImageFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(f);
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Selecione uma foto para postar.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }
    if (amountNum > 100000) {
      setError('Valor máximo permitido: R$ 100.000,00');
      return;
    }

    if (!newUsername.trim()) {
      setError('Informe um nome de usuário.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'new');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        throw new Error(uploadData.error || 'Erro ao fazer upload da imagem');
      }

      const { url: imageUrl } = await uploadRes.json();

      // 2. Create post (also handles user registration)
      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          amount: amountNum,
          phone,
          password,
          pixKey,
          username: newUsername,
        }),
      });

      if (!postRes.ok) {
        const postData = await postRes.json();
        throw new Error(postData.error || 'Erro ao criar postagem');
      }

      const postResult = await postRes.json();

      // Save user session
      const savedId = postResult.userId;
      localStorage.setItem('scambo_user', JSON.stringify({ id: savedId, username: newUsername }));
      if (onLoginSuccess && savedId) {
        onLoginSuccess(savedId, newUsername);
      }

      setSuccess('Redirecionando para pagamento...');

      // Create Mercado Pago payment
      const paymentRes = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postResult.post.id }),
      });

      if (!paymentRes.ok) {
        router.push('/');
        router.refresh();
        return;
      }

      const { initPoint } = await paymentRes.json();

      if (initPoint) {
        window.location.href = initPoint;
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar postagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário (público)</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Seu nome no ranking"
          required
          minLength={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (privado)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(11) 99999-9999"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha para sua conta"
          required
          minLength={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pix (para receber prêmio)</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="CPF, email, telefone ou chave aleatória"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Postagem (R$)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00"
          min="1"
          max="100000"
          step="0.01"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        {preview ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setFile(null); setPreview(null); fileInputRef.current!.value = ''; }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              X
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition w-full"
          >
            <Camera className="w-5 h-5" />
            <span>Selecionar foto</span>
          </button>
        )}
        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP ou GIF. Máximo 5MB.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Criando postagem...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Criar Postagem
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Seus dados privados (telefone, Pix, senha) ficam protegidos e só aparecem no painel administrativo.
      </p>
    </form>
  );
}
