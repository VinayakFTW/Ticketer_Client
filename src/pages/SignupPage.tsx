import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../audio/soundFX';
import { HairlineGrid } from '../components/common/HairlineGrid';
import { 
  User, 
  Mail, 
  Key, 
  Building, 
  ArrowRight, 
  ShieldAlert, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institute, setInstitute] = useState('Symbiosis Institute of Technology');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isSitDomain = email.trim().toLowerCase().endsWith('@sitpune.edu.in');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !institute) return;

    if (!isSitDomain) {
      soundFX.playBump();
      setErrorMsg('Institutional Domain Required: Email must end with @sitpune.edu.in');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    soundFX.playPunch();

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        institute: institute.trim(),
      });
      soundFX.playTick();
      // Navigate to verification page with email query param
      navigate(`/verify?email=${encodeURIComponent(email.trim())}`);
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Registration failed';
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
          <span className="font-bold tracking-widest text-white">TICKETER // REGISTER</span>
        </div>
      </header>

      {/* Main Registration Module */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#0e1017] border border-white/12 rounded-xs p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
          
          {/* Top Notch Indicators */}
          <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pb-3 border-b border-white/8">
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IDENTITY ENROLLMENT
            </span>
            <span>OTP_VERIFICATION_REQUIRED</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
              CREATE ACCOUNT
            </h1>
            <p className="font-mono text-xs text-white/50">
              Enroll in the institutional ticketing cluster. A 6-digit verification OTP will be transmitted to your email.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs flex items-start gap-2.5 font-mono text-xs text-red-300 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Domain Notice Banner */}
          <div className="p-3 bg-white/4 border border-white/10 rounded-xs flex items-start gap-2.5 font-mono text-[11px] text-white/70">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Campus Tenancy Policy:</strong> Server limits registrations strictly to SIT Pune email accounts ending in <span className="text-[#ff4800]">@sitpune.edu.in</span>.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-[11px] text-white/60 mb-1.5">
                FULL NAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/60">
                <label className="uppercase tracking-wider">CAMPUS EMAIL ADDRESS</label>
                {email && (
                  <span className={`text-[10px] font-bold ${isSitDomain ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isSitDomain ? 'VALID DOMAIN' : 'DOMAIN REQUIRED'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.name@sitpune.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-[#08090c] border text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20 ${
                    email && !isSitDomain ? 'border-amber-500/60 focus:border-amber-400' : 'border-white/15 focus:border-[#ff4800]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[11px] text-white/60 mb-1.5">
                SECURE PASSWORD
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[11px] text-white/60 mb-1.5">
                INSTITUTE / CAMPUS DEPARTMENT
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-white/30 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Symbiosis Institute of Technology"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs pl-9 pr-3 py-2.5 rounded-xs outline-none transition-colors placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !password || !institute}
              className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 disabled:hover:bg-[#ff4800] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,72,0,0.25)]"
            >
              <span>{isSubmitting ? "DISPATCHING OTP..." : "SUBMIT & RECEIVE OTP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Auxiliary Links */}
          <div className="pt-2 text-center font-mono text-[11px] text-white/50 space-y-1.5 border-t border-white/8">
            <div>
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff4800] hover:underline font-bold">
                Sign in here &rarr;
              </Link>
            </div>
            <div>
              Already have an unverified OTP?{' '}
              <Link to="/verify" className="text-white/80 hover:text-white underline">
                Go to OTP verification
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center font-mono text-[10px] text-white/30 pt-4 border-t border-white/8">
        TICKETER IDENTITY ENROLLMENT &bull; SUB-MILLISECOND DISPATCH
      </footer>
    </HairlineGrid>
  );
};

export default SignupPage;
