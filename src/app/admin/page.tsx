'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, LogOut, Search, CheckCircle, XCircle, Trash2, Award, Trophy, Eye, EyeOff, DollarSign, Clock, Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils';
import { Post, User, MonthlyRanking } from '@/types';

interface PostWithUser extends Post {
  users: Pick<User, 'username' | 'phone' | 'pix_key'>;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [rankings, setRankings] = useState<MonthlyRanking[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showPrivate, setShowPrivate] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = useCallback(async () => {
    try {
      const [postsRes, rankingsRes] = await Promise.all([
        fetch(`/api/admin/posts?month=${selectedMonth}`),
        fetch('/api/admin/rankings'),
      ]);

      if (postsRes.status === 401 || rankingsRes.status === 401) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const postsData = await postsRes.json();
      const rankingsData = await rankingsRes.json();

      setPosts(postsData.posts || []);
      setRankings(rankingsData.rankings || []);
      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Credenciais inválidas');
      }

      setUsername('');
      setPassword('');
      await fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      setLoading(false);
    }
  };

  const handleAction = async (postId: string, action: string) => {
    setActionLoading(`${postId}-${action}`);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(data.message);
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseMonth = async () => {
    if (!confirm('Tem certeza que deseja encerrar o ranking mensal? Esta ação não pode ser desfeita.')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close_month' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg('Ranking encerrado com sucesso!');
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPrizePaid = async (rankingId: string, paid: boolean) => {
    setActionLoading(`prize-${rankingId}`);
    try {
      const res = await fetch('/api/admin/rankings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rankingId, prizePaid: paid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMsg(data.message);
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_session=; max-age=0; path=/';
    setIsAdmin(false);
    router.refresh();
  };

  const togglePrivate = (postId: string) => {
    setShowPrivate((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading && !isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">Admin Scambo</h1>
            <p className="text-gray-400 text-sm mt-1">Acesso restrito</p>
          </div>
          {error && (
            <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeRanking = rankings.find((r) => r.status === 'active');
  const winner = posts[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-yellow-400" />
          Painel Administrativo
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-900/50 border border-green-800 text-green-300 px-4 py-3 rounded-xl text-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {activeRanking && (
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Ranking Ativo: {activeRanking.month}</h2>
              <p className="text-gray-400 text-sm">Encerra em {formatDate(activeRanking.ends_at)}</p>
            </div>
            <button
              onClick={handleCloseMonth}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
              Encerrar Mês
            </button>
          </div>

          {winner && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-yellow-300 font-bold">1º Lugar - {winner.users?.username}</p>
                  <p className="text-gray-400 text-sm">
                    Valor: {formatCurrency(winner.amount)} | 
                    Pix: {showPrivate[winner.id] ? winner.users?.pix_key : '••••••••'}
                    <button onClick={() => togglePrivate(winner.id)} className="ml-2 text-yellow-400 hover:text-yellow-300">
                      {showPrivate[winner.id] ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <Search className="w-5 h-5 text-gray-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Foto</th>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-left">Pix</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    Nenhuma postagem neste mês
                  </td>
                </tr>
              ) : (
                posts.map((post, index) => (
                  <tr key={post.id} className={`hover:bg-gray-800/50 ${index === 0 ? 'bg-yellow-900/10' : ''}`}>
                    <td className="p-3 font-bold">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      {index > 0 && `#${index + 1}`}
                    </td>
                    <td className="p-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                        <Image
                          src={post.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="p-3 font-medium text-white">{post.users?.username}</td>
                    <td className="p-3">
                      {showPrivate[post.id] ? (
                        <span className="text-gray-300">{post.users?.phone}</span>
                      ) : (
                        <span className="text-gray-600">••••</span>
                      )}
                    </td>
                    <td className="p-3">
                      {showPrivate[post.id] ? (
                        <span className="text-gray-300">{post.users?.pix_key}</span>
                      ) : (
                        <span className="text-gray-600">••••</span>
                      )}
                      <button onClick={() => togglePrivate(post.id)} className="ml-2 text-gray-500 hover:text-yellow-400">
                        {showPrivate[post.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="p-3 font-semibold text-white">{formatCurrency(post.amount)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.payment_status === 'approved' ? 'bg-green-900/50 text-green-400' :
                        post.payment_status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {post.payment_status === 'approved' ? 'Aprovado' :
                         post.payment_status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-400">{formatDate(post.created_at)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {post.payment_status !== 'approved' && (
                          <button
                            onClick={() => handleAction(post.id, 'approve_payment')}
                            disabled={actionLoading === `${post.id}-approve_payment`}
                            className="p-1.5 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition disabled:opacity-50"
                            title="Aprovar pagamento"
                          >
                            {actionLoading === `${post.id}-approve_payment` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        )}
                        {post.payment_status === 'pending' && (
                          <button
                            onClick={() => handleAction(post.id, 'reject_payment')}
                            disabled={actionLoading === `${post.id}-reject_payment`}
                            className="p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition disabled:opacity-50"
                            title="Rejeitar pagamento"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(post.id, 'delete')}
                          disabled={actionLoading === `${post.id}-delete`}
                          className="p-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition disabled:opacity-50"
                          title="Remover postagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archived Rankings */}
      {rankings.filter((r) => r.status === 'archived').length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Rankings Arquivados
          </h2>
          <div className="space-y-2">
            {rankings.filter((r) => r.status === 'archived').map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{r.month}</p>
                  {r.winner_user_id && (
                    <p className="text-sm text-gray-400">
                      Prêmio: {formatCurrency(r.prize_amount || 0)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    r.prize_paid ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {r.prize_paid ? 'Pago' : 'Pendente'}
                  </span>
                  <button
                    onClick={() => handleMarkPrizePaid(r.id, !r.prize_paid)}
                    disabled={actionLoading === `prize-${r.id}`}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    {r.prize_paid ? 'Marcar não pago' : 'Marcar pago'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
