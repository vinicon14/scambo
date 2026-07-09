import Link from 'next/link';
import type { Metadata } from 'next';
import { DollarSign, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ganhe Dinheiro com Fotos | Concurso de Fotos com Prêmio - Scambo',
  description: 'Ganhe dinheiro enviando fotos! Participe do concurso de fotos do Scambo, pague via Pix e concorra a prêmios em dinheiro todo mês. Fácil, rápido e divertido.',
  openGraph: {
    title: 'Ganhe Dinheiro com Fotos | Scambo',
    description: 'Participe do concurso de fotos e ganhe prêmios em dinheiro via Pix. Envie sua foto agora!',
  },
};

export default function GanheDinheiroPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          Ganhe dinheiro online
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
          Ganhe Dinheiro com Fotos<br />
          <span className="text-green-600">sem sair de casa</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Participe do concurso de fotos do Scambo e concorra a prêmios em dinheiro todo mês.
          Envie sua foto, pague via Pix e torça para ficar em primeiro lugar!
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center space-y-3 shadow-xl">
        <DollarSign className="w-12 h-12 mx-auto opacity-80" />
        <p className="text-lg font-semibold opacity-90">Prêmio em dinheiro todo mês</p>
        <p className="text-4xl font-black">Pagamento via Pix</p>
        <p className="text-sm opacity-75">Direto para sua conta — sem burocracia</p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-50 transition shadow-lg mt-2"
        >
          Quero ganhar dinheiro
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Como funciona</h2>
        <p className="text-gray-600 text-sm text-center max-w-lg mx-auto">
          Diferente de outros sites, no Scambo você não precisa de seguidores, não precisa ser influencer
          e não precisa de nenhuma habilidade especial. Basta enviar sua foto e participar!
        </p>
        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          {[
            { title: 'Valor mínimo baixo', desc: 'Participe a partir de R$ 5' },
            { title: 'Prêmio cresce junto', desc: 'Quanto mais gente, maior o prêmio' },
            { title: 'Pagamento na hora', desc: 'Pix aprovado em segundos' },
            { title: 'Ranking ao vivo', desc: 'Veja sua posição em tempo real' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 rounded-xl p-4 space-y-1">
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">Exemplo de prêmio</h2>
        <div className="bg-white rounded-xl p-4 border border-amber-200 text-center">
          <p className="text-gray-600 text-sm">
            Você participa com R$ 50 + outras pessoas somam R$ 300:
          </p>
          <p className="text-2xl font-black text-amber-700 mt-2">
            Seu prêmio = R$ 50 + R$ 150 = R$ 200
          </p>
          <p className="text-xs text-gray-400 mt-1">50% do valor dos outros participantes vai para o vencedor</p>
        </div>
      </div>

      <div className="text-center space-y-3 pb-8">
        <p className="text-gray-600">
          Não perca tempo! O ranking desse mês já está aberto.
        </p>
        <Link
          href="/criar-postagem"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
        >
          Enviar minha foto agora
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-400">
          <Link href="/" className="text-purple-600 hover:underline font-medium">Ver ranking</Link> · <Link href="/como-funciona" className="text-purple-600 hover:underline font-medium">Como funciona</Link>
        </p>
      </div>
    </div>
  );
}
