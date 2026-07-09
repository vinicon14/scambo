import Link from 'next/link';
import type { Metadata } from 'next';
import { Trophy, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Concurso de Fotos com Prêmio em Dinheiro | Participe Agora - Scambo',
  description: 'Participe do concurso de fotos online com prêmio em dinheiro via Pix. Envie sua foto, pague e concorra a prêmios todo mês. Ranking em tempo real!',
  openGraph: {
    title: 'Concurso de Fotos com Prêmio em Dinheiro | Scambo',
    description: 'Participe do concurso de fotos mensal e concorra a prêmios em dinheiro. Envio simples, pagamento via Pix, ranking ao vivo!',
  },
};

export default function ConcursoDeFotosPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Concurso de fotos online
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
          Concurso de Fotos com<br />
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Prêmio em Dinheiro
          </span>
        </h1>
        <p className="text-gray-500 text-lg">
          Envie sua foto, pague via Pix e concorra a prêmios todo mês. O ranking é atualizado em tempo real!
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center space-y-4 shadow-xl">
        <p className="text-lg font-semibold opacity-90">Prêmio estimado do mês</p>
        <p className="text-5xl sm:text-6xl font-black">R$ 5,00</p>
        <p className="text-sm opacity-75">1º lugar — quanto mais participantes, maior o prêmio!</p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition shadow-lg mt-2"
        >
          Participar agora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { num: '1', title: 'Envie', desc: 'Faça upload da sua foto em segundos' },
          { num: '2', title: 'Pague', desc: 'Via Pix — aprovação instantânea' },
          { num: '3', title: 'Ganhe', desc: 'Fique em 1º e receba o prêmio' },
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
        <h2 className="text-2xl font-bold text-gray-800 text-center">Por que participar?</h2>
        <ul className="space-y-3 max-w-lg mx-auto">
          {[
            'Concurso 100% online — participe de casa',
            'Pagamento via Pix, a forma mais rápida do Brasil',
            'Prêmio em dinheiro real transferido por Pix',
            'Ranking atualizado em tempo real',
            'Concorra todo mês — novo concurso a cada mês',
            'Valor mínimo baixo: a partir de R$ 5',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center space-y-3 pb-8">
        <p className="text-gray-600">
          <Link href="/" className="text-purple-600 hover:underline font-semibold">Veja o ranking atual</Link> ou
          confira os <Link href="/hall-da-fama" className="text-purple-600 hover:underline font-semibold">vencedores anteriores</Link>.
        </p>
      </div>
    </div>
  );
}
