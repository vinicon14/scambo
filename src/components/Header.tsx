'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, PlusCircle, Award, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isSeoPage = pathname === '/como-funciona' || pathname === '/faq' || pathname === '/concurso-de-fotos-premio' || pathname === '/ganhe-dinheiro-com-fotos';

  if (pathname.startsWith('/admin')) {
    return (
      <header className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="w-6 h-6 text-yellow-400" />
            Admin Scambo
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:text-yellow-400 transition">Painel</Link>
            <Link href="/admin/pagamentos" className="hover:text-yellow-400 transition">Pagamentos</Link>
            <Link href="/" className="hover:text-yellow-400 transition">Ver Site</Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Trophy className="w-7 h-7 text-yellow-400" />
          Scambo
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/hall-da-fama" className="flex items-center gap-1 hover:text-yellow-300 transition px-3 py-1.5 rounded-lg hover:bg-white/10">
            <Award className="w-4 h-4" />
            Hall da Fama
          </Link>
          <Link href="/criar-postagem" className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition shadow-lg">
            <PlusCircle className="w-5 h-5" />
            Criar Postagem
          </Link>
        </nav>
      </div>
    </header>
  );
}
