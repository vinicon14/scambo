'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Trophy, LogIn, PlusCircle, Award, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('scambo_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setLoggedUser(u.username);
      } catch {
        setLoggedUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('scambo_user');
    setLoggedUser(null);
    router.push('/');
    router.refresh();
  };

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
          {loggedUser ? (
            <>
              <Link href="/criar-postagem" className="flex items-center gap-1 bg-yellow-500 text-gray-900 px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-400 transition">
                <PlusCircle className="w-4 h-4" />
                Postar
              </Link>
              <span className="text-purple-200 text-xs">{loggedUser}</span>
              <button onClick={handleLogout} className="text-purple-200 hover:text-white text-xs">Sair</button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition">
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
