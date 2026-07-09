const localeMap: Record<string, string> = {
  pt: 'pt-BR',
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  nl: 'nl-NL',
  pl: 'pl-PL',
  sv: 'sv-SE',
  da: 'da-DK',
  fi: 'fi-FI',
  no: 'nb-NO',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ru: 'ru-RU',
  ar: 'ar-SA',
  hi: 'hi-IN',
  tr: 'tr-TR',
  ro: 'ro-RO',
};

function toLocaleTag(locale?: string): string {
  return (locale && localeMap[locale]) || 'pt-BR';
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatCurrency(value: number, locale?: string): string {
  return value.toLocaleString(toLocaleTag(locale), {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(dateString: string, locale?: string): string {
  return new Date(dateString).toLocaleDateString(toLocaleTag(locale), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatMonthYear(month: string, locale?: string): string {
  const [year, m] = month.split('-');
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString(toLocaleTag(locale), { month: 'long', year: 'numeric' });
}

export function getMonthName(month: string): string {
  return formatMonthYear(month);
}

export function getRemainingTime(endsAt: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = new Date(endsAt).getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total };
}

export function isImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
}

export function validateImageFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return 'Formato de imagem inválido. Use JPEG, PNG, WebP ou GIF.';
  }

  if (file.size > maxSize) {
    return 'Imagem muito grande. Máximo de 5MB.';
  }

  return null;
}

export function getStorageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/post_images/${path}`;
}
