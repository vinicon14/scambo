import { getTranslations } from 'next-intl/server';
import { getServiceSupabase } from '@/lib/supabase';
import HallOfFameView from '@/components/HallOfFameView';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('hallOfFameTitle'),
    description: t('hallOfFameDescription'),
    openGraph: {
      title: t('hallOfFameOgTitle'),
      description: t('hallOfFameOgDescription'),
    },
  };
}

async function getHallOfFame() {
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from('hall_of_fame')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function HallOfFamaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hallOfFame' });
  const entries = await getHallOfFame();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800">{t('title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
      </div>
      <HallOfFameView entries={entries} loading={false} />
    </div>
  );
}
