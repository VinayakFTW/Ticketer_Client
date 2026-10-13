import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/api';
import { soundFX } from '../../audio/soundFX';
import { HairlineGrid } from '../../components/common/HairlineGrid';
import { StudentView } from './StudentView';
import { StaffView } from './StaffView';
import { AdminView } from './AdminView';
import { 
  Volume2, 
  VolumeX, 
  LogOut, 
  ShieldCheck, 
  User, 
  Users
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user, role, isAuthenticated, isLoading, isSubscribed, logout } = useAuth();
  const navigate = useNavigate();

  const [audioEnabled, setAudioEnabled] = useState(soundFX.enabled);
  const [timeUtc, setTimeUtc] = useState('');

  // 1. Authentication & Subscription Guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // If user is a student and not subscribed, redirect to subscription gate
      if (role === 'STUDENT' && !isSubscribed) {
        navigate('/subscribe?required=true');
        return;
      }
    }
  }, [isAuthenticated, isLoading, isSubscribed, role, navigate]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const newState = soundFX.toggle();
    setAudioEnabled(newState);
  };

  const handleLogout = async () => {
    soundFX.playBump();
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 p-4 bg-[#0e1017] border border-white/10 rounded-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4800] animate-ping" />
          <span className="tracking-widest uppercase text-white/80">AUTHENTICATING SESSION WITH SERVER...</span>
        </div>
      </div>
    );
  }

  const roleMeta: Record<UserRole, { label: string; color: string; badgeBg: string; icon: React.FC<{ className?: string }> }> = {
    STUDENT: { label: 'STUDENT // CLIENT DESK', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/15 border-emerald-500/30', icon: User },
    STAFF: { label: 'STAFF // TRIAGE QUEUE', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/15 border-cyan-500/30', icon: Users },
    ADMIN: { label: 'ADMINISTRATOR // RADAR', color: 'text-[#ff4800]', badgeBg: 'bg-[#ff4800]/15 border-[#ff4800]/30', icon: ShieldCheck },
  };

  const CurrentRoleIcon = roleMeta[role]?.icon || User;

  return (
    <HairlineGrid className="min-h-screen bg-[#08090c] text-[#f4f5f7] flex flex-col justify-between selection:bg-[#ff4800] selection:text-white">
      
      {/* HUD Telemetry Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08090c]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Platform Return */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" onClick={() => soundFX.playTick()} className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-xs bg-[#ff4800] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tighter shadow-[0_0_12px_rgba(255,72,0,0.4)] group-hover:scale-105 transition-transform">
                TK
              </div>
              <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">
                TICKETER
              </span>
              <span className="font-mono text-[10px] text-white/40 border border-white/15 px-1.5 py-0.5 rounded-xs">
                APP
              </span>
            </Link>

            {/* Authenticated Role Verified Badge */}
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xs border font-mono text-[11px] ${roleMeta[role].badgeBg} ${roleMeta[role].color}`}>
              <CurrentRoleIcon className="w-3.5 h-3.5" />
              <span className="font-bold">{roleMeta[role].label}</span>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3 font-mono text-xs">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={audioEnabled ? "Tactile Audio Active" : "Tactile Audio Muted"}
              className={`p-1.5 rounded-xs border transition-all ${
                audioEnabled 
                  ? 'border-[#ff4800] bg-[#ff4800]/15 text-[#ff4800]' 
                  : 'border-white/15 bg-white/5 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Profile info */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-white font-bold text-xs">{user?.username || 'Authenticated User'}</span>
              <span className="text-[10px] text-white/40">{user?.email || 'user@sitpune.edu.in'}</span>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 border border-white/12 hover:border-red-500/40 text-white/70 hover:text-red-300 rounded-xs text-[11px] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIGN OUT</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto w-full pt-24 pb-16 px-4 md:px-8 flex-1">
        
        {/* Workspace Title & Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
          <div className="space-y-1">
            <div className="font-mono text-[11px] text-[#ff4800] uppercase tracking-widest flex items-center gap-2">
              <span>RBAC VERIFIED WORKSTATION</span>
              <span>&bull;</span>
              <span className="text-white/40">[{timeUtc}]</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-bold">{user?.institute || 'SIT Pune'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
              {role === 'STUDENT' && 'STUDENT INCIDENT DESK'}
              {role === 'STAFF' && 'TRIAGE QUEUE & DISPATCH WORKBENCH'}
              {role === 'ADMIN' && 'INSTITUTIONAL ADMINISTRATIVE RADAR'}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-white/60">
            {role === 'STUDENT' && (
              <Link 
                to="/subscribe" 
                className="text-[11px] px-3 py-1 bg-white/4 hover:bg-white/8 border border-white/10 text-white/80 rounded-xs transition-colors"
              >
                SLA SUBSCRIPTION
              </Link>
            )}
            <Link 
              to="/#protocol-lab" 
              className="text-[11px] px-3 py-1 bg-white/4 hover:bg-white/8 border border-white/10 text-white/80 rounded-xs transition-colors"
            >
              REST OPENAPI 3.1
            </Link>
          </div>
        </div>

        {/* Pure RBAC-Rendered Workstation (No client-side role switching) */}
        {role === 'STUDENT' && <StudentView />}
        {role === 'STAFF' && <StaffView />}
        {role === 'ADMIN' && <AdminView />}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050609] py-4 px-4 md:px-8 font-mono text-[11px] text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>TICKETER PRODUCTION WORKBENCH &bull; SYMBIOSIS INSTITUTE OF TECHNOLOGY &bull; RBAC CONTROLLED</div>
          <div className="text-white/30">SESSION_AUTH: VALID // BACKEND REST COMPLIANT</div>
        </div>
      </footer>

    </HairlineGrid>
  );
};

export default AppShell;
