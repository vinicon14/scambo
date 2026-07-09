import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Trophy, DollarSign, Camera, Users, ArrowRight, CheckCircle } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('howItWorksTitle'),
    description: t('howItWorksDescription'),
    openGraph: {
      title: t('howItWorksOgTitle'),
      description: t('howItWorksOgDescription'),
    },
  };
}

export default async function ComoFuncionaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorks' });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('step1Title')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t('step1Desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('step2Title')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t('step2Desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('step3Title')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t('step3Desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t('step4Title')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t('step4Desc')}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{t('prizeSection')}</h2>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            {t('prizeExplanation')}
          </p>
          <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
            <p className="text-lg font-bold text-purple-700">
              {t('prizeFormula')}
            </p>
          </div>
          <p>
            {t('prizeDetail')}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{t('benefitsSection')}</h2>
        <ul className="space-y-3">
          {[t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'), t('benefit5'), t('benefit6')].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-4 pb-8">
        <p className="text-gray-600">
          {t('ctaText')}
        </p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
        >
          {t('ctaButton')}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-400">
          {t('ctaLink')}
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Como participar do Scambo',
            description: 'Participe do concurso de fotos mensal e concorra a prêmios em dinheiro.',
            step: [
              { '@type': 'HowToStep', name: 'Envie sua foto', text: 'Faça upload da sua foto no site.' },
              { '@type': 'HowToStep', name: 'Pague via Pix', text: 'Escolha o valor e pague via Pix ou cartão.' },
              { '@type': 'HowToStep', name: 'Apareça no ranking', text: 'Sua foto aparece no ranking após pagamento aprovado.' },
              { '@type': 'HowToStep', name: 'Concorra ao prêmio', text: 'O primeiro colocado ganha o prêmio no fim do mês.' },
            ],
          }),
        }}
      />
    </div>
  );
}
