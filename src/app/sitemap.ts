import { routing } from '@/i18n/routing';
import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';

const BASE_URL = 'https://scambo.shop';

type PathnamesConfig = Record<string, string | Record<string, string>>;

const staticPages: { path: string; priority: number; changeFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1.0, changeFrequency: 'hourly' },
  { path: '/criar-postagem', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/hall-da-fama', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/como-funciona', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/concurso-de-fotos-premio', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ganhe-dinheiro-com-fotos', priority: 0.8, changeFrequency: 'monthly' },
];

function getLocalizedUrl(locale: string, ptPath: string): string {
  const prefix = locale === 'pt' ? '' : `/${locale}`;
  const pathnames = routing.pathnames as unknown as PathnamesConfig;
  const pathConfig = pathnames[ptPath];

  if (pathConfig && typeof pathConfig === 'object') {
    const slugs = pathConfig as Record<string, string>;
    const localized = slugs[locale];
    if (localized) return `${BASE_URL}${prefix}${localized}`;
  }

  return `${BASE_URL}${prefix}${ptPath}`;
}

function getAlternates(ptPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = getLocalizedUrl(locale, ptPath);
  }
  return languages;
}

export default async function sitemap() {
  const supabase = getServiceSupabase();
  const month = getCurrentMonth();

  const { data: ranking } = await supabase
    .rpc('get_public_ranking', { p_month: month });

  const rankingEntries = (ranking || []).map((entry: { post_id: string }) => ({
    url: `${BASE_URL}/?post=${entry.post_id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages.map((page) => ({
      url: getLocalizedUrl('pt', page.path),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: getAlternates(page.path),
      },
    })),
    ...rankingEntries,
  ];
}
