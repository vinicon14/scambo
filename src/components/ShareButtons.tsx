'use client';

import { useState } from 'react';
import { Share2, MessageCircle, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ShareButtons() {
  const t = useTranslations('shareButtons');
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : 'https://scambo.shop';
  const text = t('shareText');

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t('shareTitle'), text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl hover:bg-green-600 transition text-sm font-medium shadow-sm"
      >
        <MessageCircle className="w-4 h-4" />
        {t('whatsapp')}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
        {copied ? t('copied') : t('share')}
      </button>
    </div>
  );
}
