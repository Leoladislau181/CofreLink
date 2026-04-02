'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isRegister
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <form onSubmit={handleAuth} className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Logo size={40} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100">
          {isRegister ? 'Criar Conta' : 'Bem-vindo'}
        </h2>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
          {isRegister ? 'Comece a organizar seus links hoje.' : 'Entre para acessar seus atalhos.'}
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm mb-6 border border-red-100 dark:border-red-900/30 animate-in shake-1">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-zinc-900 dark:text-zinc-100"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-zinc-900 dark:text-zinc-100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold mt-8 mb-4 disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          {loading ? 'Processando...' : (isRegister ? 'Criar Minha Conta' : 'Entrar Agora')}
        </button>
        
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
        >
          {isRegister ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se grátis'}
        </button>
      </form>
    </div>
  );
}
