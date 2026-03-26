import { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Props {
  onClose: () => void;
}

const translateAuthError = (message: string) => {
  if (!message) return '發生錯誤，請稍後再試。';
  if (message.includes('Invalid login credentials')) return '信箱或密碼錯誤。';
  if (message.includes('Email not confirmed')) return '信箱尚未驗證，請前往信箱尋找驗證信並點擊連結。';
  if (message.includes('User already registered')) return '這個信箱已經註冊過囉！請改為登入。';
  if (message.includes('Password should be at least')) return '密碼太短囉，請至少輸入 6 個字元。';
  return message;
};

export function AuthModal({ onClose }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      // 網頁會自動跳轉，所以不需要 onClose
    } catch (err: any) {
      setError(translateAuthError(err.message));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up logic
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name, // Save display name to Auth metadata
            }
          }
        });

        if (signUpError) throw signUpError;

        // Profiles are linked via trigger ideally, or directly inserted here:
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert([
            { id: data.user.id, name: name || email.split('@')[0] }
          ]);
          if (profileError) console.error('Error creating profile:', profileError);
        }

        alert('註冊成功！請查看信箱進行驗證 (如果已開啟信箱驗證)，或直接登入。');
        onClose();
      } else {
        // Sign in logic
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        onClose();
      }
    } catch (err: any) {
      setError(translateAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-apple-bg dark:bg-apple-bg-dark rounded-apple-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-soft-dark dark:shadow-black/40 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-apple-text dark:text-apple-text-dark">
            {isSignUp ? '建立帳號' : '登入 Easy Split'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-500 text-sm p-3 rounded-xl border border-red-100 dark:border-red-500/20">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm text-gray-500 mb-1 ml-1">顯示名稱</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="分帳用的名稱"
                  required
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all text-apple-text dark:text-apple-text-dark placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all text-apple-text dark:text-apple-text-dark placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1 ml-1">密碼</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入密碼"
                required
                minLength={6}
                className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all text-apple-text dark:text-apple-text-dark placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-apple-blue-heavy text-white font-medium rounded-2xl shadow-soft-blue flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? '註冊帳號' : '登入')}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? '已經有帳號了嗎？' : '還沒有帳號嗎？'}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-apple-blue-heavy font-medium ml-1 hover:underline outline-none"
              >
                {isSignUp ? '登入' : '註冊'}
              </button>
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2 mb-1">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
            <span className="text-sm font-medium text-gray-400">或使用以下方式繼續</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full h-12 bg-white dark:bg-black text-gray-800 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium text-[15px]">使用 Google 繼續</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
