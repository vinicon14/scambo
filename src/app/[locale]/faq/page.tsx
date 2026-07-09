import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    title: t('faqPageTitle'),
    description: t('faqPageDescription'),
    openGraph: {
      title: t('faqOgTitle'),
      description: t('faqOgDescription'),
    },
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  const faqs = t.raw('items') as { q: string; a: string }[];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-lg">
          {t('subtitle')}{' '}
          <Link href="/como-funciona" className="text-purple-600 hover:underline font-semibold">
            {t('subtitleLink')}
          </Link>.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group open:shadow-md transition-shadow"
          >
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-purple-700 transition-colors list-none flex items-center justify-between gap-4">
              <span>{faq.q}</span>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{t('ctaHeading')}</h2>
        <p className="text-gray-600 text-sm">
          {t('ctaSee')}{' '}
          <Link href="/como-funciona" className="text-purple-600 font-semibold hover:underline">
            {t('ctaHowItWorks')}
          </Link>{' '}
          {t('ctaScambo')}{' '}
          {t('ctaOr')}{' '}
          <Link href="/criar-postagem" className="text-purple-600 font-semibold hover:underline">
            {t('ctaCreate')}
          </Link>{' '}
          {t('ctaNow')}
        </p>
      </div>
    </div>
  );
}
