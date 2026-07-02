import { useState } from 'react';
import { useAdminAuth } from './AdminAuth';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #FAF8F3 0%, #F4EFE6 50%, #E8E3D8 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #9FAF93 0%, #8A9B80 100%)' }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-playfair text-3xl font-medium text-text-primary mb-2">Admin Dashboard</h1>
          <p className="font-montserrat text-sm text-text-secondary">Nutrition with Teagan</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="font-montserrat text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-montserrat text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-sage/20 font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-montserrat text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-sage/20 font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-sage text-white font-montserrat font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 hover:bg-sage-dark hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-montserrat text-xs text-text-light mt-8">
          Secure admin access for authorised personnel only
        </p>
      </div>
    </div>
  );
}
