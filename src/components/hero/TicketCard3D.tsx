import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TicketPerforation } from '../common/TicketPerforation';
import { StatusBadge } from '../common/StatusBadge';
import { soundFX } from '../../audio/soundFX';
import { Cpu, ArrowUpRight, ShieldCheck } from 'lucide-react';

export interface ProtocolSpecimenTicket {
  ticket_id: number;
  institute?: string;
  department?: string;
  text: string;
  status: string;
  assigned_email?: string | null;
  bump_count: number;
  priority?: string;
}

interface TicketCard3DProps {
  ticket: ProtocolSpecimenTicket;
  isInteractive?: boolean;
  className?: string;
}

export const TicketCard3D: React.FC<TicketCard3DProps> = ({
  ticket,
  isInteractive = true,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

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
      className={`relative w-full max-w-md bg-[#0f1118] border border-white/12 rounded-sm shadow-2xl overflow-hidden cursor-crosshair select-none transition-shadow hover:shadow-[0_20px_60px_rgba(255,72,0,0.18)] ${className}`}
    >
      {/* Dynamic Specimen Header Strip */}
      <div className="bg-[#141822] px-5 py-2.5 border-b border-white/10 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">OPENAPI ENVELOPE</span>
        </div>
        <StatusBadge status={ticket.status as 'OPEN'} />
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
              {ticket.institute || 'Symbiosis Institute of Technology'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              SPECIMEN ID
            </div>
            <div className="font-mono text-xs font-semibold text-white/80">
              #TK-{ticket.ticket_id}
            </div>
          </div>
        </div>

        {/* Incident Payload Text */}
        <div className="bg-[#0b0c11] border border-white/8 p-3.5 rounded-xs font-mono text-[12px] text-white/90 leading-relaxed min-h-[64px]">
          {ticket.text}
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-3 text-[11px] font-mono border-t border-white/8 pt-3">
          <div>
            <div className="text-white/40 uppercase text-[9px] tracking-wider">ROUTED DEPARTMENT</div>
            <div className="text-white/80 truncate mt-0.5 font-bold">
              {ticket.department || 'IT Infrastructure'}
            </div>
          </div>
          <div>
            <div className="text-white/40 uppercase text-[9px] tracking-wider">PRIORITY LEVEL</div>
            <div className="text-[#ff4800] font-bold mt-0.5">
              {ticket.priority || 'URGENT'}
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

        <div className="font-mono text-[10px] text-white/50 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SCHEMA 3.1 &bull; REST VERIFIED</span>
          <ArrowUpRight className="w-3 h-3 text-white/30" />
        </div>
      </div>

    </motion.div>
  );
};

export default TicketCard3D;
