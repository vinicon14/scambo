import { supabase } from '@/lib/supabase';
import HallOfFameView from '@/components/HallOfFameView';

export const dynamic = 'force-dynamic';

async function getHallOfFame() {
  try {
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
