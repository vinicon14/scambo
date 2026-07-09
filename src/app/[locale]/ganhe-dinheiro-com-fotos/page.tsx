import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { DollarSign, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('makeMoneyTitle'),
    description: t('makeMoneyDescription'),
    openGraph: {
      title: t('makeMoneyOgTitle'),
      description: t('makeMoneyOgDescription'),
    },
  };
}

export default async function GanheDinheiroPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'makeMoneyPage' });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          {t('badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center space-y-3 shadow-xl">
        <DollarSign className="w-12 h-12 mx-auto opacity-80" />
        <p className="text-lg font-semibold opacity-90">{t('highlightPrize')}</p>
        <p className="text-4xl font-black">{t('highlightPix')}</p>
        <p className="text-sm opacity-75">{t('highlightPixDesc')}</p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition shadow-lg mt-2"
        >
          {t('ctaButton')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{t('howItWorksHeading')}</h2>
        <p className="text-gray-600 text-sm text-center max-w-lg mx-auto">
          {t('howItWorksDesc')}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          {[
            { title: t('feature1Title'), desc: t('feature1Desc') },
            { title: t('feature2Title'), desc: t('feature2Desc') },
            { title: t('feature3Title'), desc: t('feature3Desc') },
            { title: t('feature4Title'), desc: t('feature4Desc') },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-4 space-y-1">
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">{t('exampleHeading')}</h2>
        <div className="bg-white rounded-xl p-4 border border-amber-200 text-center">
          <p className="text-gray-600 text-sm">
            {t('exampleDesc')}
          </p>
          <p className="text-2xl font-black text-amber-700 mt-2">
            {t('exampleResult')}
          </p>
          <p className="text-xs text-gray-400 mt-1">{t('exampleNote')}</p>
        </div>
      </div>

      <div className="text-center space-y-3 pb-8">
        <p className="text-gray-600">
          {t('ctaText')}
        </p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
        >
          {t('ctaButton2')}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-400">
          <Link href="/" className="text-purple-600 hover:underline font-medium">{t('linkRanking')}</Link> · <Link href="/como-funciona" className="text-purple-600 hover:underline font-medium">{t('linkHowItWorks')}</Link>
        </p>
      </div>
    </div>
  );
}
