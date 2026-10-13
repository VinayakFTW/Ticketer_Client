import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../audio/soundFX';
import { HairlineGrid } from '../components/common/HairlineGrid';
import { 
  getClientSubscriptionApi, 
  renewClientSubscriptionApi 
} from '../api/users';
import { 
  Check, 
  ArrowLeft, 
  Activity,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const SubscribePage: React.FC = () => {
  const { isAuthenticated, checkSubscription, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRequiredNotice = searchParams.get('required') === 'true';

  const [isActive, setIsActive] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Require login to view subscription portal, and redirect non-students to /app
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role !== 'STUDENT') {
      navigate('/app');
      return;
    }

    const fetchSub = async () => {
      try {
        const res = await getClientSubscriptionApi();
        if (res.data) {
          setIsActive(res.data.active);
        }
      } catch {
        setIsActive(false);
      }
    };

    fetchSub();
  }, [isAuthenticated, role, navigate]);

  const handleActivateSubscription = async () => {
    soundFX.playPunch();
    setUpdating(true);
    setStatusMessage(null);

    try {
      await renewClientSubscriptionApi(true);
      await checkSubscription();
      setIsActive(true);
      soundFX.playTick();
      setStatusMessage('Institutional subscription activated successfully. You are authorized to proceed to the desk.');
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Error updating subscription status';
      setStatusMessage(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleProceedToApp = () => {
    soundFX.playPunch();
    navigate('/app');
  };

  return (
    <HairlineGrid className="min-h-screen bg-[#08090c] text-[#f4f5f7] flex flex-col justify-between selection:bg-[#ff4800] selection:text-white px-4 py-8">
      {/* Header */}
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
          <span className="font-bold tracking-widest text-white">TICKETER // SUBSCRIPTIONS</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full my-auto py-10 space-y-8">
        
        {/* Required Notice Alert if navigated from login or app guard */}
        {isRequiredNotice && (
          <div className="p-4 bg-amber-500/15 border-2 border-amber-500/50 rounded-xs flex items-start gap-3 font-mono text-xs text-amber-200 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-300 uppercase tracking-wide">
                MANDATORY ENROLLMENT: ACTIVE SUBSCRIPTION REQUIRED
              </div>
              <div className="text-white/80 leading-relaxed font-sans text-xs">
                Your student account requires an active campus SLA subscription before you can file or review support tickets. Please click "ACTIVATE SUBSCRIPTION" below to continue.
              </div>
            </div>
          </div>
        )}

        {/* Title & Status Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto font-mono">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#ff4800]/10 border border-[#ff4800]/30 text-[#ff4800] text-[11px] tracking-widest uppercase">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>CAMPUS SLA TIER ENROLLMENT</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
            INSTITUTIONAL SERVICE SUBSCRIPTION
          </h1>

          <p className="text-xs md:text-sm text-white/60">
            Automated ticket routing, deterministic escalation timelines, and dedicated department triage pipelines for Symbiosis Institute of Technology.
          </p>

          {/* Active status indicator card */}
          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0e1017] border border-white/12 rounded-xs text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-white/50">SUBSCRIPTION STATE:</span>
                <span className={`px-2.5 py-1 rounded-xs font-bold text-[11px] flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isActive ? 'ACTIVE SUBSCRIPTION' : 'INACTIVE / REQUIRES ACTIVATION'}
                </span>
              </div>

              {!isActive ? (
                <button
                  onClick={handleActivateSubscription}
                  disabled={updating}
                  className="px-5 py-2.5 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-50 text-white font-bold tracking-wider uppercase rounded-xs transition-all active:scale-95 text-xs shadow-[0_0_15px_rgba(255,72,0,0.3)]"
                >
                  {updating ? 'ACTIVATING ON SERVER...' : 'ACTIVATE SUBSCRIPTION'}
                </button>
              ) : (
                <button
                  onClick={handleProceedToApp}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold tracking-wider uppercase rounded-xs transition-all active:scale-95 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <span>CONTINUE TO APP WORKBENCH</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {statusMessage && (
              <div className="mt-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xs max-w-md mx-auto">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Plan Feature Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          <div className="bg-[#0e1017] border border-white/10 rounded-xs p-6 space-y-4">
            <div className="text-[10px] text-[#ff4800] uppercase tracking-wider font-bold">
              INSTITUTIONAL PERKS
            </div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              STUDENT ESSENTIAL SLA
            </h3>
            <p className="text-white/60 text-xs">
              Direct access to the deterministic ticketing cluster for academic, facility, and IT issues.
            </p>
            <div className="space-y-2.5 text-white/70 border-t border-white/8 pt-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant AI Triage & Department Auto-Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>IT, Lab Equipment & Hostel Maintenance Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Campus Safety Grievance Express Tagging</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0e1017] border border-white/10 rounded-xs p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                POLICY TERMS
              </div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                MEMBERSHIP ENTITLEMENTS
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                By activating your subscription, your account is provisioned in the backend database with active routing credentials, enabling real-time SLA escalation timers and supervisor escalation bumpers.
              </p>
            </div>

            {isActive ? (
              <button
                onClick={handleProceedToApp}
                className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] text-white font-bold uppercase rounded-xs transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,72,0,0.3)]"
              >
                <span>ENTER APPLICATION (/APP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleActivateSubscription}
                disabled={updating}
                className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-50 text-white font-bold uppercase rounded-xs transition-colors"
              >
                {updating ? 'ENROLLING ON SERVER...' : 'CLICK HERE TO ACTIVATE & CONTINUE'}
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center font-mono text-[10px] text-white/30 pt-4 border-t border-white/8">
        TICKETER SERVICE LEVEL AGREEMENT &bull; DETERMINISTIC DISPATCH ASSURANCE
      </footer>
    </HairlineGrid>
  );
};

export default SubscribePage;
