import React from 'react';
import { Link } from 'react-router-dom';
import { TicketCard3D, ProtocolSpecimenTicket } from './TicketCard3D';
import { soundFX } from '../../audio/soundFX';
import { Terminal, Sparkles, UserPlus, ArrowDown } from 'lucide-react';

const SPECIMEN_TICKET: ProtocolSpecimenTicket = {
  ticket_id: 1001,
  institute: 'Symbiosis Institute of Technology',
  department: 'IT Infrastructure & Computing',
  text: 'High-throughput institutional dispatch ticket envelope conforming strictly to OpenAPI 3.1 REST contracts with AI classification.',
  status: 'OPEN',
  assigned_email: 'helpdesk@sitpune.edu.in',
  bump_count: 0,
  priority: 'URGENT',
};

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] pt-28 pb-16 flex items-center justify-center px-4 md:px-8 border-b border-white/10 overflow-hidden">
      
      {/* Background Micro Coordinates */}
      <div className="absolute top-24 left-8 font-mono text-[10px] text-white/20 select-none tracking-widest hidden md:block">
        LOC: 0x48A // PROTOCOL_LEVEL_INGEST
      </div>
      <div className="absolute bottom-12 left-8 font-mono text-[10px] text-white/20 select-none tracking-widest hidden md:block">
        MAX_CONCURRENCY // 100,000 DISPATCH/SEC
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Bold Typographic Manifesto (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#ff4800]/10 border border-[#ff4800]/30 text-[#ff4800] text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] animate-pulse" />
            <span>CAMPUS DISPATCH PROTOCOL</span>
          </div>

          {/* Display Typography */}
          <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-bold tracking-[-0.04em] leading-[0.92] uppercase text-white font-['Space_Grotesk']">
            TICKETER
          </h1>

          <div className="font-mono text-xs sm:text-sm text-white/50 tracking-wider uppercase border-l-2 border-[#ff4800] pl-4">
            Deterministic Institutional Helpdesk &bull; Pure REST OpenAPI 3.1 &bull; RBAC Protected
          </div>

          {/* Descriptive Copy */}
          <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed font-sans font-normal">
            Ticketer replaces sluggish legacy help desks with a high-throughput deterministic dispatch engine. 
            Engineered for Symbiosis Institute of Technology academic labs, facility repairs, IT infrastructure, and student grievances.
          </p>

          {/* Hardware & Spec Micro-Matrix */}
          <div className="grid grid-cols-3 gap-3 max-w-lg py-2">
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">DISPATCH LATENCY</div>
              <div className="text-sm font-bold text-white mt-1">&lt; 0.4 ms</div>
            </div>
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">SPECIFICATION</div>
              <div className="text-sm font-bold text-[#ff4800] mt-1">OpenAPI 3.1</div>
            </div>
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">TENANCY</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">SIT PUNE</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/app"
              onClick={() => soundFX.playPunch()}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff4800] hover:bg-[#e03f00] text-white font-mono text-xs font-bold tracking-wider uppercase rounded-xs transition-transform active:scale-95 shadow-[0_0_24px_rgba(255,72,0,0.35)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>LAUNCH WEBAPP (/APP)</span>
            </Link>

            <a
              href="#protocol-lab"
              onClick={() => soundFX.playTick()}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-mono text-xs tracking-wider uppercase rounded-xs transition-colors"
            >
              <Terminal className="w-4 h-4 text-[#ff4800]" />
              <span>INSPECT PROTOCOL SPEC</span>
              <ArrowDown className="w-3.5 h-3.5 text-white/40" />
            </a>

            <Link
              to="/signup"
              onClick={() => soundFX.playTick()}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-mono text-xs tracking-wider uppercase rounded-xs transition-colors"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>CREATE ACCOUNT</span>
            </Link>
          </div>

        </div>

        {/* Right Column: Interactive 3D Protocol Ticket Specimen (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          <div className="w-full max-w-md flex items-center justify-between font-mono text-[11px] text-white/60 mb-3 px-1">
            <span className="text-white/80 font-bold uppercase tracking-wider">
              PROTOCOL TICKET SPECIMEN
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-xs">
              REST SCHEMA 3.1
            </span>
          </div>

          {/* Layered Physical Ticket Visual Stack */}
          <div className="relative w-full max-w-md flex items-center justify-center">
            {/* Background layered faux card for depth */}
            <div className="absolute -top-3 w-[92%] h-full bg-[#0a0c12] border border-white/6 rounded-sm opacity-40 -rotate-2 transform scale-95 pointer-events-none" />
            <div className="absolute -top-1.5 w-[96%] h-full bg-[#0e1017] border border-white/8 rounded-sm opacity-70 rotate-1 transform scale-98 pointer-events-none" />

            {/* Foreground Active Card */}
            <div className="w-full">
              <TicketCard3D
                ticket={SPECIMEN_TICKET}
                isInteractive={true}
              />
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="font-mono text-[10px] text-white/30 text-center mt-4 tracking-wider uppercase">
            &bull; Hover cursor to tilt specimen in 3D physics space &bull;
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
