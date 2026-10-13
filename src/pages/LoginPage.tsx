import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../audio/soundFX';
import { HairlineGrid } from '../components/common/HairlineGrid';
import { 
  Key, 
  Mail, 
  ArrowRight, 
  ShieldAlert, 
  ArrowLeft,
  UserPlus
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, checkSubscription } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg(null);
    setIsSubmitting(true);
    soundFX.playPunch();

    try {
      const loggedRole = await login({ email: email.trim(), password });
      soundFX.playTick();

      // Check subscription requirement for students
      if (loggedRole === 'STUDENT') {
        const isSubscribed = await checkSubscription();
        if (!isSubscribed) {
          navigate('/subscribe?required=true');
          return;
        }
      }

      // Staff and Admin, or already subscribed students proceed directly
      navigate('/app');
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Invalid username or password';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HairlineGrid className="min-h-screen bg-[#08090c] text-[#f4f5f7] flex flex-col justify-between selection:bg-[#ff4800] selection:text-white px-4 py-8">
      {/* Mini HUD Navigation Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10 font-mono text-xs">
        <Link 
          to="/" 
          onClick={() => soundFX.playTick()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO PLATFORM</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ff4800] rounded-xs flex items-center justify-center text-white font-bold text-[10px]">
            TK
          </div>
          <span className="font-bold tracking-widest text-white">TICKETER // AUTH GATEWAY</span>
        </div>
      </header>

      {/* Main Login Module */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#0e1017] border border-white/12 rounded-xs p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Top Notch Indicators */}
          <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pb-3 border-b border-white/8">
            <span className="text-[#ff4800] flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] animate-pulse" />
              REST_AUTH_V1 // RBAC VERIFIED
            </span>
            <span>PORT 0x443</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
              AUTHENTICATE SESSION
            </h1>
            <p className="font-mono text-xs text-white/50">
              Input registered campus credentials to launch your role workbench.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xs flex items-start gap-2.5 font-mono text-xs text-red-300 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div>{errorMsg}</div>
                {errorMsg.toLowerCase().includes('verify') && (
                  <Link 
                    to={`/verify?email=${encodeURIComponent(email)}`}
                    className="text-[#ff4800] underline font-bold hover:text-white block pt-1"
                  >
                    Click here to enter OTP and complete email verification &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/60">
                <label className="uppercase tracking-wider">CAMPUS EMAIL ADDRESS</label>
                <span className="text-[10px] text-[#ff4800]/80">@sitpune.edu.in</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@sitpune.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/60">
                <label className="uppercase tracking-wider">PASSWORD / SECRET</label>
                <Link to="/verify" className="text-[10px] text-white/40 hover:text-[#ff4800]">
                  NEED OTP?
                </Link>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 disabled:hover:bg-[#ff4800] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,72,0,0.25)]"
            >
              <span>{isSubmitting ? "AUTHENTICATING..." : "SIGN IN TO WORKBENCH"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration / Signup Callout */}
          <div className="p-4 bg-white/4 border border-white/8 rounded-xs space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-white/80 font-bold">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>NEW TO THE PLATFORM?</span>
            </div>
            <p className="text-white/50 text-[11px] leading-relaxed">
              Students and staff must register their institutional account and verify with email OTP before filing or reviewing tickets.
            </p>
            <Link
              to="/signup"
              onClick={() => soundFX.playTick()}
              className="inline-flex items-center gap-1.5 text-[#ff4800] hover:text-white font-bold text-xs underline pt-1"
            >
              <span>Create an institutional account &rarr;</span>
            </Link>
          </div>

          {/* Auxiliary Links */}
          <div className="pt-2 text-center font-mono text-[11px] text-white/50 space-y-1.5 border-t border-white/8">
            <div>
              Received a 6-digit OTP code?{' '}
              <Link to="/verify" className="text-white/80 hover:text-white underline">
                Verify OTP code
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center font-mono text-[10px] text-white/30 pt-4 border-t border-white/8">
        TICKETER RBAC SECURE GATEWAY &bull; SYMBIOSIS INSTITUTE OF TECHNOLOGY
      </footer>
    </HairlineGrid>
  );
};

export default LoginPage;
