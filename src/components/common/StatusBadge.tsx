import React from 'react';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'BUMPED' | 'RESOLVED' | 'CLOSED';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', showDot = true }) => {
  const getStyle = () => {
    switch (status) {
      case 'OPEN':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          dot: 'bg-cyan-400',
          label: 'OPEN'
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          dot: 'bg-amber-400',
          label: 'IN_PROGRESS'
        };
      case 'BUMPED':
        return {
          bg: 'bg-[#ff4800]/15',
          border: 'border-[#ff4800]/50',
          text: 'text-[#ff4800]',
          dot: 'bg-[#ff4800] animate-pulse',
          label: 'BUMPED_SLA'
        };
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'RESOLVED'
        };
      case 'CLOSED':
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/15',
          text: 'text-white/50',
          dot: 'bg-white/40',
          label: 'CLOSED'
        };
    }
  };

  const style = getStyle();
  const sizeClasses = size === 'lg' 
    ? 'text-[12px] px-3 py-1 gap-2' 
    : size === 'md'
    ? 'text-[11px] px-2.5 py-0.5 gap-1.5'
    : 'text-[10px] px-2 py-0.5 gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-medium tracking-wider uppercase rounded-xs border ${style.bg} ${style.border} ${style.text} ${sizeClasses}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      )}
      {style.label}
    </span>
  );
};
