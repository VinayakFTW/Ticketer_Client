import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TicketPerforation } from '../common/TicketPerforation';
import { StatusBadge } from '../common/StatusBadge';
import { SimulatedTicket } from '../../data/mock-store';
import { soundFX } from '../../audio/soundFX';
import { Clock, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

interface TicketCard3DProps {
  ticket: SimulatedTicket;
  isInteractive?: boolean;
  onBump?: (id: number) => void;
  className?: string;
}

export const TicketCard3D: React.FC<TicketCard3DProps> = ({
  ticket,
  isInteractive = true,
  onBump,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 350, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 350, damping: 25 });
  const brightness = useTransform(mouseY, [-0.5, 0.5], [1.08, 0.95]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isInteractive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFX.playTick();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isInteractive ? rotateX : 0,
        rotateY: isInteractive ? rotateY : 0,
        filter: isInteractive ? `brightness(${brightness})` : 'none',
        transformStyle: 'preserve-3d',
      }}
      className={`relative w-full max-w-md bg-[#10121a] border border-white/12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-shadow duration-300 ${
        isHovered ? 'shadow-[0_25px_60px_rgba(255,72,0,0.15)] border-white/25' : ''
      } ${className}`}
    >
      {/* Top Header Strip */}
      <div className="bg-[#151922] px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-xs bg-[#ff4800]" />
          <span className="font-mono text-[11px] font-bold tracking-widest text-white/90">
            DISPATCH_STAMP // {ticket.tracking_hash}
          </span>
        </div>
        <StatusBadge status={ticket.status} size="sm" />
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-4">
        
        {/* Ticket Header & Institute Metadata */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              INSTITUTE TENANCY
            </div>
            <div className="font-mono text-sm font-bold text-white tracking-wide flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-[#ff4800]" />
              {ticket.institute}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              TICKET SERIAL
            </div>
            <div className="font-mono text-xs font-semibold text-white/80">
              #TK-{ticket.ticket_id}
            </div>
          </div>
        </div>

        {/* Incident Payload Text */}
        <div className="bg-[#0b0c11] border border-white/8 p-3 rounded-xs font-mono text-[12px] text-white/90 leading-relaxed min-h-[64px]">
          {ticket.text}
        </div>

        {/* Assigned Staff & Bump Counters */}
        <div className="grid grid-cols-2 gap-3 text-[11px] font-mono border-t border-white/8 pt-3">
          <div>
            <div className="text-white/40 uppercase text-[9px] tracking-wider">ASSIGNED STAFF</div>
            <div className="text-white/80 truncate mt-0.5">
              {ticket.assigned_email || "[UNASSIGNED]"}
            </div>
          </div>
          <div>
            <div className="text-white/40 uppercase text-[9px] tracking-wider">SLA BUMPS</div>
            <div className="text-[#ff4800] font-bold mt-0.5 flex items-center gap-1">
              {ticket.bump_count > 0 ? (
                <>
                  <ShieldAlert className="w-3 h-3 text-[#ff4800]" />
                  <span>{ticket.bump_count} ACCELERATIONS</span>
                </>
              ) : (
                <span className="text-white/40">NOMINAL</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Physical Perforation Divider */}
      <TicketPerforation orientation="horizontal" />

      {/* Ticket Footer / Stub */}
      <div className="bg-[#0c0e14] px-5 py-3 border-t border-white/6 flex items-center justify-between">
        
        {/* Synthetic Barcode Lines */}
        <div className="flex items-center gap-[2px] h-6 opacity-70">
          <div className="w-[3px] h-full bg-white/70" />
          <div className="w-[1px] h-full bg-white/70" />
          <div className="w-[2px] h-full bg-white/70" />
          <div className="w-[4px] h-full bg-white/70" />
          <div className="w-[1px] h-full bg-white/70" />
          <div className="w-[3px] h-full bg-white/70" />
          <div className="w-[2px] h-full bg-white/70" />
          <div className="w-[1px] h-full bg-white/70" />
          <div className="w-[3px] h-full bg-white/70" />
          <div className="w-[1px] h-full bg-white/70" />
          <div className="w-[4px] h-full bg-white/70" />
          <div className="w-[2px] h-full bg-white/70" />
        </div>

        {/* Action Button for bumping or inspecting */}
        {onBump ? (
          <button
            onClick={() => {
              soundFX.playBump();
              onBump(ticket.ticket_id);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#ff4800]/15 hover:bg-[#ff4800]/30 border border-[#ff4800]/50 text-[#ff4800] rounded-xs font-mono text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <span>BUMP SLA</span>
            <Clock className="w-3 h-3" />
          </button>
        ) : (
          <div className="font-mono text-[10px] text-white/35 flex items-center gap-1">
            <span>SPEC: 3.1.0</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Dynamic Stamped Seal Overlay if BUMPED or RESOLVED */}
      {ticket.status === 'BUMPED' && (
        <div className="pointer-events-none absolute bottom-12 right-6 rubber-stamp border-[#ff4800] text-[#ff4800] bg-[#ff4800]/10 text-xs shadow-lg animate-in fade-in zoom-in-95">
          PRIORITY_ESCALATED
        </div>
      )}
      {ticket.status === 'RESOLVED' && (
        <div className="pointer-events-none absolute bottom-12 right-6 rubber-stamp border-emerald-400 text-emerald-400 bg-emerald-400/10 text-xs shadow-lg">
          RESOLVED // AUTH_OK
        </div>
      )}

    </motion.div>
  );
};
