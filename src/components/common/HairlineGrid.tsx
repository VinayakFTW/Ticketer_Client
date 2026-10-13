import React from 'react';

export const HairlineGrid: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative technical-grid ${className}`}>
      {/* Precision coordinate corner crosshairs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-4 left-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none">
          SYS_COORD // 42.3601° N, 71.0942° W
        </div>
        <div className="absolute top-4 right-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none">
          TICKETER_V0.1.0 // DISPATCH_READY
        </div>
        <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none">
          TENANT_ISOLATION // ACTIVE
        </div>
        <div className="absolute bottom-4 right-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none">
          BUFFER_STATE // DETERMINISTIC
        </div>

        {/* Hairline boundary accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
