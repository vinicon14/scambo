'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Settings, CreditCard, Save, RefreshCw, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { PaymentConfig } from '@/types';

export default function AdminPagamentosPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [accessToken, setAccessToken] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [sandbox, setSandbox] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState('disconnected');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/admin/payment-config');
        if (res.status === 401) {
          router.push('/admin');
          return;
        }
        const data = await res.json();
        if (data.config) {
          setAccessToken(data.config.access_token || '');
          setPublicKey(data.config.public_key || '');
          setPixKey(data.config.pix_key || '');
          setSandbox(data.config.sandbox ?? true);
          setIntegrationStatus(data.config.integration_status || 'disconnected');
        }
        setIsAdmin(true);
      } catch {
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, publicKey, pixKey, sandbox }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setIntegrationStatus(data.integrationStatus);
      setSuccess(data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!accessToken) {
      setError('Informe o token de acesso primeiro.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, publicKey, pixKey, sandbox }),
      });

      const data = await res.json();
      setIntegrationStatus(data.integrationStatus);
      if (data.integrationStatus === 'connected') {
        setSuccess('Conexão com Mercado Pago funcionando!');
      } else {
        setError('Falha na conexão. Verifique o token.');
      }
    } catch {
      setError('Erro ao testar conexão');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">Configurações de Pagamento</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/50 border border-green-800 text-green-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Mercado Pago</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              integrationStatus === 'connected' ? 'bg-green-900/50 text-green-400' :
              integrationStatus === 'error' ? 'bg-red-900/50 text-red-400' :
              'bg-gray-800 text-gray-400'
            }`}>
              {integrationStatus === 'connected' ? 'Conectado' :
               integrationStatus === 'error' ? 'Erro' : 'Desconectado'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Token de Acesso</label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="APP_USR-..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Chave Pública</label>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="APP_USR-..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Chave Pix da Plataforma</label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, email ou chave aleatória"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sandbox}
                onChange={(e) => setSandbox(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
            </label>
            <span className="text-sm text-gray-300">Modo Sandbox (testes)</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="w-4 h-4" /> Salvar Configurações</>
              )}
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={saving}
              className="bg-gray-800 text-gray-300 px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Testar
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-yellow-400" />
          Instruções
        </h2>
        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
          <li>Crie uma conta no <a href="https://www.mercadopago.com.br" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Mercado Pago</a></li>
          <li>Acesse &quot;Suas Integrações&quot; e crie uma aplicação</li>
          <li>Copie o Access Token (começa com APP_USR-) e cole acima</li>
          <li>No modo Sandbox, use cartões de teste fornecidos pelo Mercado Pago</li>
          <li>Configure o webhook no Mercado Pago para: <code className="bg-gray-800 px-2 py-0.5 rounded text-yellow-300">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/mercadopago</code></li>
        </ul>
      </div>
    </div>
  );
}
