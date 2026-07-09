'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { validateImageFile } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PostFormProps {
  onLoginSuccess?: (id: string, name: string) => void;
}

export default function PostForm({ onLoginSuccess }: PostFormProps) {
  const t = useTranslations('postForm');
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
      setError(t('errorNoPhoto'));
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError(t('errorInvalidAmount'));
      return;
    }
    if (amountNum > 100000) {
      setError(t('errorMaxAmount'));
      return;
    }

    if (!newUsername.trim()) {
      setError(t('errorNoUsername'));
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
        throw new Error(uploadData.error || t('errorUpload'));
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
        throw new Error(postData.error || t('errorCreate'));
      }

      const postResult = await postRes.json();

      // Save user session
      const savedId = postResult.userId;
      localStorage.setItem('scambo_user', JSON.stringify({ id: savedId, username: newUsername }));
      if (onLoginSuccess && savedId) {
        onLoginSuccess(savedId, newUsername);
      }

      setSuccess(t('redirecting'));

      setTimeout(() => {
        router.push(`/pagar/${postResult.post.id}`);
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorCreate'));
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder={t('usernamePlaceholder')}
          required
          minLength={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('phonePlaceholder')}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          required
          minLength={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('pixKey')}</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder={t('pixKeyPlaceholder')}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')}</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('amountPlaceholder')}
          min="1"
          max="100000"
          step="0.01"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo')}</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        {preview ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-200">
            <img src={preview} alt={t('photoPreview')} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setFile(null); setPreview(null); fileInputRef.current!.value = ''; }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {t('removePhoto')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition w-full"
          >
            <Camera className="w-5 h-5" />
            <span>{t('selectPhoto')}</span>
          </button>
        )}
        <p className="text-xs text-gray-400 mt-1">{t('photoHelp')}</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('creating')}
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            {t('submit')}
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        {t('privacyNote')}
      </p>
    </form>
  );
}
