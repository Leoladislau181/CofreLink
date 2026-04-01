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
      <form onSubmit={handleAuth} className="w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-center mb-6">
          <Logo size={48} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-zinc-900 dark:text-zinc-100">
          {isRegister ? 'Criar Conta' : 'Entrar no CofreLink'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold mb-4 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : (isRegister ? 'Registrar' : 'Entrar')}
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-sm text-zinc-500 dark:text-zinc-400"
        >
          {isRegister ? 'Já tem uma conta? Entrar' : 'Não tem conta? Registrar'}
        </button>
      </form>
    </div>
  );
}
