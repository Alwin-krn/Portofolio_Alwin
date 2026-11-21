import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Detail teknis tampil di konsol browser (F12) untuk memudahkan pelacakan
        console.error('Login gagal:', error);
        setError(
          error.message === 'Invalid login credentials'
            ? 'Email atau password salah.'
            : `Gagal masuk: ${error.message}`
        );
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      // Misalnya jaringan putus atau URL Supabase tidak bisa dijangkau
      console.error('Login gagal:', err);
      setError(`Gagal masuk: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border bg-surface-lowest dark:bg-dark-surface-lowest border-outline-variant dark:border-dark-outline-variant focus:outline-none focus:border-primary';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface">
      <form
        onSubmit={submit}
        className="w-full max-w-sm p-6 md:p-8 rounded-2xl border bg-surface-low dark:bg-dark-surface-low border-outline-variant dark:border-dark-outline-variant space-y-4"
      >
        <h1 className="text-2xl font-bold">Masuk admin</h1>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" required autoComplete="username" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" type="password" required autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full py-2.5 rounded-xl font-semibold bg-primary text-black hover:opacity-90 disabled:opacity-50 transition">
          {busy ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}