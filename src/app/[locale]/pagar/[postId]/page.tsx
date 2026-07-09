'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Copy, Check, Loader2, ArrowLeft, AlertCircle, RefreshCw, QrCode } from 'lucide-react';

type PaymentStep = 'loading' | 'pix' | 'checkout' | 'approved' | 'error';

export default function PagarPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const [step, setStep] = useState<PaymentStep>('loading');
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(0);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/check-payment?postId=${postId}`);
      const data = await res.json();
      if (data.status === 'approved') {
        setStep('approved');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [postId]);

  useEffect(() => {
    const init = async () => {
      try {
        // Try creating Pix payment
        const res = await fetch('/api/create-pix-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });

        if (!res.ok) {
          // Fallback to Checkout Pro
          setStep('checkout');
          return;
        }

        const data = await res.json();
        setQrCodeBase64(data.qrCodeBase64);
        setQrCode(data.qrCode);
        setTicketUrl(data.ticketUrl);
        setStep('pix');

        // Start polling
      } catch {
        setStep('checkout');
      }
    };

    init();
  }, [postId]);

  // Poll for payment status
  useEffect(() => {
    if (step !== 'pix') return;
    const interval = setInterval(async () => {
      const done = await checkStatus();
      if (done) clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [step, checkStatus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = qrCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRedirectCheckout = async () => {
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        const { initPoint } = await res.json();
        if (initPoint) window.location.href = initPoint;
      }
    } catch {
      setError('Erro ao redirecionar para pagamento');
    }
  };

  const handleRefresh = async () => {
    const done = await checkStatus();
    if (done) setStep('approved');
  };

  if (step === 'loading') {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Preparando pagamento...</p>
        </div>
      </div>
    );
  }

  if (step === 'approved') {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento aprovado!</h2>
          <p className="text-gray-500 mb-6">Sua foto aparecerá no ranking em instantes.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver Ranking
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pagamento</h2>
          <p className="text-gray-500 text-sm mb-6">
            Escolha como pagar sua postagem no ranking.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Link
              href={`/pagar/${postId}`}
              className="flex items-center gap-4 w-full p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition text-left"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Pix</p>
                <p className="text-xs text-gray-400">QR Code ou copia e cola</p>
              </div>
            </Link>

            <button
              onClick={handleRedirectCheckout}
              className="flex items-center gap-4 w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition text-left"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Cartão, Boleto ou Saldo</p>
                <p className="text-xs text-gray-400">Pagamento via Mercado Pago</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pix step
  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Pagamento via Pix</h2>
        <p className="text-gray-500 text-sm mb-6">
          Escaneie o QR Code abaixo ou copie o código Pix para pagar.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
            {qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-52 h-52"
              />
            ) : (
              <div className="w-52 h-52 bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Código Pix (copia e cola)</p>
          <p className="text-sm text-gray-700 font-mono break-all leading-relaxed mb-3">{qrCode}</p>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copiado!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copiar Código Pix</>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
          <span>Aguardando pagamento...</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Verificar
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-400">
            Após o pagamento, sua foto aparecerá automaticamente no ranking.
          </p>
        </div>
      </div>
    </div>
  );
}
