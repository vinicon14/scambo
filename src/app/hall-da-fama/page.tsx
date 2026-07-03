import { getServiceSupabase } from '@/lib/supabase';
import HallOfFameView from '@/components/HallOfFameView';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hall da Fama',
  description: 'Veja os vencedores de todos os meses do ranking Scambo. Confira quem ganhou os prêmios em dinheiro!',
  openGraph: {
    title: 'Hall da Fama - Scambo',
    description: 'Veja os vencedores de todos os meses do ranking Scambo.',
  },
};

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

export default async function HallOfFamaPage() {
  const entries = await getHallOfFame();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800">Hall da Fama</h1>
        <p className="text-gray-500 text-sm mt-1">Vencedores de todos os meses</p>
      </div>
      <HallOfFameView entries={entries} loading={false} />
    </div>
  );
}
