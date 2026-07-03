import { getServiceSupabase } from '@/lib/supabase';
import { getCurrentMonth } from '@/lib/utils';

const BASE_URL = 'https://www.scambo.shop';

export default async function sitemap() {
  const supabase = getServiceSupabase();
  const month = getCurrentMonth();

  const { data: ranking } = await supabase
    .rpc('get_public_ranking', { p_month: month });

  const { data: hallOfFame } = await supabase
    .from('hall_of_fame')
    .select('created_at');

  const rankingEntries = (ranking || []).map((entry: { post_id: string }) => ({
    url: `${BASE_URL}/?post=${entry.post_id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/criar-postagem`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hall-da-fama`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...rankingEntries,
  ];
}
