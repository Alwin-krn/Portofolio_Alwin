import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Membungkus halaman admin: belum login -> diarahkan ke /admin/login
export default function RequireAdmin({ children }) {
  const [state, setState] = useState('loading'); // loading | in | out

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setState(session ? 'in' : 'out')
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface text-on-surface-variant dark:text-dark-on-surface-variant">
        Memuat...
      </div>
    );
  }
  if (state === 'out') return <Navigate to="/admin/login" replace />;
  return children;
}
