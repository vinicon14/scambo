'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';

const localeLabels: Record<string, string> = {
  pt: 'Português',
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
  no: 'Norsk',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  ro: 'Română',
};

function getNeutralPath(pathname: string): string {
  for (const loc of routing.locales) {
    const prefix = `/${loc}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(prefix + '/')) return pathname.slice(prefix.length);
  }
  return pathname;
}

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const neutralPath = getNeutralPath(pathname);

  return (
    <select
      value={locale}
      onChange={(e) => {
        const target = e.target.value;
        const href = target === 'pt' ? neutralPath : `/${target}${neutralPath}`;
        window.location.href = href;
      }}
      className="bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20 cursor-pointer outline-none hover:bg-white/20 transition"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc} className="bg-gray-800 text-white">
          {localeLabels[loc] || loc}
        </option>
      ))}
    </select>
  );
}
