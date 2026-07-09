import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const manifestByLocale: Record<string, { name: string; description: string }> = {
  pt: { name: 'Scambo - Ranking Mensal', description: 'Participe do ranking mensal de fotos e concorra a prêmios em dinheiro via Pix.' },
  es: { name: 'Scambo - Ranking Mensual', description: 'Participa en el ranking mensual de fotos y compite por premios en dinero vía Pix.' },
  en: { name: 'Scambo - Monthly Ranking', description: 'Join the monthly photo ranking and compete for cash prizes via Pix.' },
  fr: { name: 'Scambo - Classement Mensuel', description: 'Participez au classement photo mensuel et gagnez des prix en argent via Pix.' },
  de: { name: 'Scambo - Monatliches Ranking', description: 'Nimm am monatlichen Foto-Ranking teil und gewinne Geldpreise via Pix.' },
  it: { name: 'Scambo - Classifica Mensile', description: 'Partecipa alla classifica fotografica mensile e vinci premi in denaro via Pix.' },
  nl: { name: 'Scambo - Maandelijkse Ranglijst', description: 'Doe mee aan de maandelijkse fotoranglijst en win geldprijzen via Pix.' },
  pl: { name: 'Scambo - Miesięczny Ranking', description: 'Dołącz do comiesięcznego rankingu zdjęć i wygrywaj nagrody pieniężne przez Pix.' },
  sv: { name: 'Scambo - Månatlig Ranking', description: 'Delta i den månatliga fotorankingen och tävla om kontantpriser via Pix.' },
  da: { name: 'Scambo - Månedlig Rangering', description: 'Deltag i den månedlige fotorangering og vind kontantpræmier via Pix.' },
  fi: { name: 'Scambo - Kuukausittainen Ranking', description: 'Osallistu kuukausittaiseen valokuvasijoitukseen ja voita rahapalkintoja Pixin kautta.' },
  no: { name: 'Scambo - Månedlig Rangering', description: 'Bli med i den månedlige bilderangeringen og konkurrer om pengepremier via Pix.' },
  ja: { name: 'Scambo - 月間ランキング', description: '毎月のフォトランキングに参加して、Pixで賞金を獲得しましょう。' },
  ko: { name: 'Scambo - 월간 랭킹', description: '월간 사진 랭킹에 참여하고 Pix를 통해 상금에 도전하세요.' },
  zh: { name: 'Scambo - 月度排名', description: '参加月度照片排名，通过Pix竞争现金奖励。' },
  ru: { name: 'Scambo - Ежемесячный Рейтинг', description: 'Участвуйте в ежемесячном рейтинге фотографий и выигрывайте денежные призы через Pix.' },
  ar: { name: 'Scambo - الترتيب الشهري', description: 'شارك في ترتيب الصور الشهري وتنافس على جوائز نقدية عبر Pix.' },
  hi: { name: 'Scambo - मासिक रैंकिंग', description: 'मासिक फोटो रैंकिंग में भाग लें और Pix के माध्यम से नकद पुरस्कार जीतें।' },
  tr: { name: 'Scambo - Aylık Sıralama', description: 'Aylık fotoğraf sıralamasına katılın ve Pix ile para ödülleri kazanın.' },
  ro: { name: 'Scambo - Clasament Lunar', description: 'Participă la clasamentul foto lunar și câștigă premii în bani prin Pix.' },
};

export async function GET(request: Request) {
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  let detectedLocale = 'pt';
  for (const locale of routing.locales) {
    if (acceptLanguage.startsWith(locale) || acceptLanguage.includes(locale)) {
      detectedLocale = locale;
      break;
    }
  }

  const localized = manifestByLocale[detectedLocale] || manifestByLocale.pt;

  return NextResponse.json({
    name: localized.name,
    short_name: 'Scambo',
    description: localized.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  });
}
