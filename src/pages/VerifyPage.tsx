import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../audio/soundFX';
import { HairlineGrid } from '../components/common/HairlineGrid';
import { 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verify, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    soundFX.playPunch();

    try {
      await verify({ email: email.trim(), otp: otp.trim() });
      soundFX.playTick();
      setSuccessMsg('Email verified successfully! You can now sign in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Invalid or expired OTP code';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrorMsg('Please specify your registered institutional email first.');
      return;
    }

    setResending(true);
    setErrorMsg(null);
    setResendNotice(null);
    soundFX.playTick();

    try {
      // Re-triggering signup generates a fresh OTP in redis
      await signup({
        name: 'Student User',
        email: email.trim(),
        password: 'TemporaryPassword123!',
        institute: 'Symbiosis Institute of Technology',
      });
      setResendNotice('A fresh 6-digit OTP code has been dispatched to your email.');
    } catch {
      // Even if user exists, backend sends OTP to unverified users!
      setResendNotice('If your account is registered, a new verification OTP was dispatched.');
    } finally {
      setResending(false);
    }
  };

  return (
    <HairlineGrid className="min-h-screen bg-[#08090c] text-[#f4f5f7] flex flex-col justify-between selection:bg-[#ff4800] selection:text-white px-4 py-8">
      {/* Mini HUD Navigation Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10 font-mono text-xs">
        <Link 
          to="/login" 
          onClick={() => soundFX.playTick()}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO SIGN IN</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ff4800] rounded-xs flex items-center justify-center text-white font-bold text-[10px]">
            TK
          </div>
          <span className="font-bold tracking-widest text-white">TICKETER // VERIFY</span>
        </div>
      </header>

      {/* Main Verification Module */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#0e1017] border border-white/12 rounded-xs p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Top Notch Indicators */}
          <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pb-3 border-b border-white/8">
            <span className="text-amber-400 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              OTP CHALLENGE // REST_VERIFY
            </span>
            <span>EXPIRY: 5 MINUTES</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
              VERIFY EMAIL ADDRESS
            </h1>
            <p className="font-mono text-xs text-white/50">
              Input the 6-digit confirmation code transmitted to your campus inbox.
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xs flex items-start gap-3 font-mono text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <div className="font-bold">{successMsg}</div>
                <div>Redirecting to sign-in terminal...</div>
                <Link to="/login" className="text-white underline font-bold inline-block pt-1">
                  Click here if not redirected automatically &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs flex items-start gap-2.5 font-mono text-xs text-red-300 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Resend Notice */}
          {resendNotice && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xs font-mono text-xs text-cyan-300 animate-in fade-in">
              {resendNotice}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-white/60 mb-1.5">
                REGISTERED EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@sitpune.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/60">
                <label className="uppercase tracking-wider">6-DIGIT VERIFICATION CODE (OTP)</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[10px] text-[#ff4800] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{resending ? 'DISPATCHING...' : 'RESEND OTP'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-base tracking-[0.4em] font-mono text-center py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || otp.length < 6}
              className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 disabled:hover:bg-[#ff4800] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,72,0,0.25)]"
            >
              <span>{isSubmitting ? "VERIFYING CHALLENGE..." : "CONFIRM VERIFICATION"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Auxiliary Links */}
          <div className="pt-2 text-center font-mono text-[11px] text-white/50 space-y-1.5 border-t border-white/8">
            <div>
              Already verified?{' '}
              <Link to="/login" className="text-[#ff4800] hover:underline font-bold">
                Sign in to your account &rarr;
              </Link>
            </div>
            <div>
              Need to register first?{' '}
              <Link to="/signup" className="text-white/80 hover:text-white underline">
                Sign up here
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center font-mono text-[10px] text-white/30 pt-4 border-t border-white/8">
        TICKETER CRYPTOGRAPHIC VERIFICATION &bull; REDIS EXPIRATION BUFFER
      </footer>
    </HairlineGrid>
  );
};

export default VerifyPage;
