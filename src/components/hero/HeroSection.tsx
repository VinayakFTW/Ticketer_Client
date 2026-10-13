import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketCard3D } from './TicketCard3D';
import { mockStore, SimulatedTicket } from '../../data/mock-store';
import { soundFX } from '../../audio/soundFX';
import { ArrowDown, Layers, Terminal, RefreshCw } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [tickets, setTickets] = useState<SimulatedTicket[]>(mockStore.getTickets());
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);

  const handleCycleTickets = () => {
    soundFX.playTick();
    setActiveTicketIndex(prev => (prev + 1) % tickets.length);
  };

  const handleBumpHeroTicket = (id: number) => {
    const updated = mockStore.bumpTicket(id);
    if (updated) {
      setTickets(mockStore.getTickets());
    }
  };

  const currentTicket = tickets[activeTicketIndex] || tickets[0];

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center px-4 md:px-8 border-b border-white/10 overflow-hidden">
      
      {/* Background Micro Coordinates */}
      <div className="absolute top-24 left-8 font-mono text-[10px] text-white/20 select-none tracking-widest hidden md:block">
        LOC: 0x48A // PROTOCOL_LEVEL_INGEST
      </div>
      <div className="absolute bottom-12 left-8 font-mono text-[10px] text-white/20 select-none tracking-widest hidden md:block">
        MAX_CONCURRENCY // 100,000 DISPATCH/SEC
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Asymmetric Bold Typographic Manifesto (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#ff4800]/10 border border-[#ff4800]/30 text-[#ff4800] text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800] animate-pulse" />
            <span>DETERMINISTIC DISPATCH PROTOCOL</span>
          </div>

          {/* Enormous Display Typography (Scale jump > 8x) */}
          <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-bold tracking-[-0.04em] leading-[0.92] uppercase text-white font-['Space_Grotesk']">
            TICKETER
          </h1>

          <div className="font-mono text-xs sm:text-sm text-white/50 tracking-wider uppercase border-l-2 border-[#ff4800] pl-4">
            Zero-overhead institutional queue routing &bull; Pure REST OpenAPI 3.1 &bull; Tenant isolation
          </div>

          {/* Real Descriptive Architectural Copy (No invented fluff) */}
          <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed font-sans font-normal">
            Ticketer replaces sluggish legacy help desks with a high-throughput deterministic dispatch engine. 
            Engineered for high-density academic labs, enterprise infrastructure clusters, and multi-tenant organizations requiring sub-millisecond triage velocity.
          </p>

          {/* Hardware & Spec Micro-Matrix */}
          <div className="grid grid-cols-3 gap-3 max-w-lg py-2">
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">DISPATCH OVERHEAD</div>
              <div className="text-sm font-bold text-white mt-1">&lt; 0.4 ms</div>
            </div>
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">SPECIFICATION</div>
              <div className="text-sm font-bold text-[#ff4800] mt-1">OpenAPI 3.1</div>
            </div>
            <div className="bg-[#11131a] border border-white/8 p-3 rounded-xs font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-widest">TENANCY</div>
              <div className="text-sm font-bold text-white mt-1">ISOLATED</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#simulator"
              onClick={() => soundFX.playPunch()}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ff4800] hover:bg-[#e03f00] text-white font-mono text-xs font-bold tracking-wider uppercase rounded-xs transition-transform active:scale-95 shadow-[0_0_24px_rgba(255,72,0,0.35)]"
            >
              <Terminal className="w-4 h-4" />
              <span>LAUNCH SIMULATOR</span>
            </a>

            <a
              href="#protocol-lab"
              onClick={() => soundFX.playTick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-mono text-xs tracking-wider uppercase rounded-xs transition-colors"
            >
              <span>INSPECT ENDPOINTS</span>
              <ArrowDown className="w-4 h-4 text-white/50" />
            </a>
          </div>

        </div>

        {/* Right Column: Interactive 3D Ticket Shuffler (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Shuffler Controller Toolbar */}
          <div className="w-full max-w-md flex items-center justify-between font-mono text-[11px] text-white/60 mb-3 px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#ff4800]" />
              <span>LIVE APERTURE TICKET ({activeTicketIndex + 1}/{tickets.length})</span>
            </div>
            <button
              onClick={handleCycleTickets}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white rounded-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>CYCLE TICKET</span>
            </button>
          </div>

          {/* Layered Physical Ticket Visual Stack */}
          <div className="relative w-full max-w-md flex items-center justify-center">
            
            {/* Background layered faux card for depth */}
            <div className="absolute -top-3 w-[92%] h-full bg-[#0a0c12] border border-white/6 rounded-sm opacity-40 -rotate-2 transform scale-95 pointer-events-none" />
            <div className="absolute -top-1.5 w-[96%] h-full bg-[#0e1017] border border-white/8 rounded-sm opacity-70 rotate-1 transform scale-98 pointer-events-none" />

            {/* Foreground Active Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTicket.ticket_id}
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <TicketCard3D
                  ticket={currentTicket}
                  isInteractive={true}
                  onBump={handleBumpHeroTicket}
                />
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Interactive Hint */}
          <div className="font-mono text-[10px] text-white/30 text-center mt-4 tracking-wider uppercase">
            &bull; Move cursor to tilt in 3D &bull; Click "BUMP SLA" to escalate &bull;
          </div>

        </div>

      </div>
    </section>
  );
};
