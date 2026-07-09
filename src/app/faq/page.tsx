import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes | Concurso de Fotos Scambo',
  description: 'Tire suas dúvidas sobre o concurso de fotos do Scambo: como participar, como é o prêmio, como receber o dinheiro, pagamento via Pix e mais.',
  openGraph: {
    title: 'FAQ - Perguntas Frequentes | Scambo',
    description: 'Tire todas as suas dúvidas sobre o concurso de fotos com prêmio em dinheiro do Scambo.',
  },
};

const faqs = [
  {
    question: 'O que é o Scambo?',
    answer: 'O Scambo é um concurso de fotos online onde você envia sua foto, paga um valor via Pix, aparece em um ranking público e concorre a prêmios em dinheiro no final do mês. O primeiro colocado leva o valor que pagou + 50% do total das outras postagens.',
  },
  {
    question: 'Como faço para participar?',
    answer: 'É simples: acesse a página de Criar Postagem, faça upload da sua foto, escolha o valor que deseja pagar (mínimo R$ 5), preencha seus dados e finalize o pagamento via Pix. Assim que o pagamento for aprovado, sua foto aparece no ranking.',
  },
  {
    question: 'Quanto custa para participar?',
    answer: 'O valor mínimo é de R$ 5. Você pode escolher qualquer valor acima disso. Quanto maior o valor que você pagar, maior será o prêmio total do mês — já que 50% do valor de cada participante vai para o prêmio do primeiro lugar.',
  },
  {
    question: 'Como funciona o prêmio?',
    answer: 'O primeiro lugar do ranking recebe 100% do valor que pagou de volta + 50% da soma de todas as outras postagens do mês. Por exemplo: se você pagou R$ 50 e os outros participantes somaram R$ 300, você ganha R$ 50 + R$ 150 = R$ 200.',
  },
  {
    question: 'Como recebo o prêmio se eu ganhar?',
    answer: 'O pagamento do prêmio é feito via Pix para a chave Pix que você cadastrou ao criar sua postagem. O organizador entra em contato e transfere o valor diretamente para sua conta.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos pagamento via Pix (QR Code ou copia e cola) e cartão de crédito processado pelo Mercado Pago. O Pix é a forma mais rápida — a aprovação é instantânea.',
  },
  {
    question: 'Posso participar mais de uma vez no mesmo mês?',
    answer: 'Sim, você pode criar quantas postagens quiser. Cada postagem é uma entrada separada no ranking com seu próprio valor.',
  },
  {
    question: 'O que acontece no final do mês?',
    answer: 'No último dia do mês, o ranking é fechado automaticamente. O primeiro colocado é declarado vencedor e entra para o Hall da Fama. As fotos dos outros participantes são arquivadas e um novo ranking começa no mês seguinte.',
  },
  {
    question: 'Meus dados pessoais ficam protegidos?',
    answer: 'Sim. Sua chave Pix, telefone e senha nunca são expostos publicamente. Apenas seu nome de usuário e sua foto aparecem no ranking. Todos os dados são armazenados de forma segura no Supabase.',
  },
  {
    question: 'Posso denunciar uma foto ou conduta inadequada?',
    answer: 'Todas as fotos passam por validação automática de formato e segurança. Fotos impróprias podem ser removidas pelos administradores. Se você encontrar algo inadequado, entre em contato.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800">
          Perguntas Frequentes
        </h1>
        <p className="text-gray-500 text-lg">
          Tire suas dúvidas sobre o <Link href="/" className="text-purple-600 hover:underline font-semibold">concurso de fotos Scambo</Link>.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group open:shadow-md transition-shadow"
          >
            <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-purple-700 transition-colors list-none flex items-center justify-between gap-4">
              <span>{faq.question}</span>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Ainda tem dúvidas?</h2>
        <p className="text-gray-600 text-sm">
          Veja <Link href="/como-funciona" className="text-purple-600 font-semibold hover:underline">como funciona</Link> o Scambo
          ou <Link href="/criar-postagem" className="text-purple-600 font-semibold hover:underline">crie sua postagem</Link> agora mesmo!
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </div>
  );
}
