import Link from 'next/link';
import type { Metadata } from 'next';
import { Trophy, DollarSign, Camera, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Como Funciona o Ranking de Fotos | Concurso de Fotos com Prêmio - Scambo',
  description: 'Descubra como participar do concurso de fotos do Scambo. Envie sua foto, pague via Pix, apareça no ranking e concorra a prêmios em dinheiro todo mês!',
  openGraph: {
    title: 'Como Funciona | Participe do Ranking Scambo',
    description: 'Veja o passo a passo para participar do ranking mensal de fotos e concorrer a prêmios em dinheiro via Pix.',
  },
};

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800">
          Como Funciona o <span className="text-purple-600">Scambo</span>
        </h1>
        <p className="text-gray-500 text-lg">
          O concurso de fotos mais fácil do Brasil. Envie, pague e concorra a prêmios todo mês.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">1. Envie sua foto</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Clique em <Link href="/criar-postagem" className="text-purple-600 font-semibold hover:underline">Criar Postagem</Link> e faça upload da sua foto.
            Você também escolhe o valor que quer pagar — quanto maior o valor, maior o prêmio!
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">2. Pague via Pix</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Após enviar a foto, você é redirecionado para o pagamento. Pague via <strong>Pix</strong> (QR Code ou copia e cola) ou cartão de crédito pelo Mercado Pago. O pagamento é processado na hora.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">3. Apareça no ranking</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Assim que o pagamento for aprovado, sua foto aparece no <Link href="/" className="text-purple-600 font-semibold hover:underline">ranking mensal</Link>.
            Você pode acompanhar sua posição em tempo real e ver quantas pessoas já participaram.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">4. Concorra ao prêmio</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            No final do mês, o primeiro colocado leva o prêmio total. O valor inclui 100% do que você pagou + 50% do valor de todas as outras postagens. Quanto mais pessoas participam, maior o prêmio!
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Prêmio — Como é calculado?</h2>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            O prêmio funciona de forma simples e transparente. Digamos que você participe com R$ 50 e outras
            5 pessoas participem com valores que somam R$ 300. O cálculo do prêmio para o primeiro lugar é:
          </p>
          <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
            <p className="text-lg font-bold text-purple-700">
              Prêmio = R$ 50 (seu valor) + 50% de R$ 300 = R$ 50 + R$ 150 = <span className="text-2xl">R$ 200</span>
            </p>
          </div>
          <p>
            Ou seja, você recebe de volta o valor que pagou + metade do valor total dos outros participantes.
            Isso significa que <strong>todo mundo contribui para o prêmio do vencedor</strong>, e o valor
            cresce quanto mais pessoas participam.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Vantagens de participar</h2>
        <ul className="space-y-3">
          {[
            'Pagamento via Pix — aprovado em segundos',
            'Prêmio calculado automaticamente, sem pegadinhas',
            'Ranking atualizado em tempo real',
            'Fácil e rápido: leva menos de 2 minutos para participar',
            'Hall da Fama para os campeões de cada mês',
            'Valor mínimo baixo — a partir de R$ 5',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-4 pb-8">
        <p className="text-gray-600">
          Pronto para participar? O ranking desse mês já está aberto!
        </p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
        >
          Quero participar agora
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-400">
          Ou veja o <Link href="/" className="text-purple-600 hover:underline font-medium">ranking atual</Link>
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
