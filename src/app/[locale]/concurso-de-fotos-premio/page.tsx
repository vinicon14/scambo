import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Trophy, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('contestTitle'),
    description: t('contestDescription'),
    openGraph: {
      title: t('contestOgTitle'),
      description: t('contestOgDescription'),
    },
  };
}

export default async function ConcursoDeFotosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contestPage' });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          {t('badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center space-y-4 shadow-xl">
        <p className="text-lg font-semibold opacity-90">{t('estimatedPrize')}</p>
        <p className="text-5xl sm:text-6xl font-black">{t('defaultPrize')}</p>
        <p className="text-sm opacity-75">{t('prizeDescription')}</p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition shadow-lg mt-2"
        >
          {t('ctaButton')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { num: '1', title: t('step1Title'), desc: t('step1Desc') },
          { num: '2', title: t('step2Title'), desc: t('step2Desc') },
          { num: '3', title: t('step3Title'), desc: t('step3Desc') },
        ].map((step) => (
          <div key={step.num} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-700 font-bold text-lg">
              {step.num}
            </div>
            <h3 className="font-bold text-gray-800">{step.title}</h3>
            <p className="text-gray-500 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{t('benefitsHeading')}</h2>
        <ul className="space-y-3 max-w-lg mx-auto">
          {[t('benefit1'), t('benefit2'), t('benefit3'), t('benefit4'), t('benefit5'), t('benefit6')].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-3 pb-8">
        <p className="text-gray-600">
          <Link href="/" className="text-purple-600 hover:underline font-semibold">{t('linkRanking')}</Link> ou{' '}
          <Link href="/hall-da-fama" className="text-purple-600 hover:underline font-semibold">
            {t('linkWinners')}
          </Link>.
        </p>
      </div>
    </div>
  );
}
