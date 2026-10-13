import React from 'react';

export const TicketPerforation: React.FC<{ orientation?: 'horizontal' | 'vertical'; className?: string }> = ({
  orientation = 'horizontal',
  className = ''
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`relative flex flex-col items-center justify-between w-4 self-stretch my-2 ${className}`}>
        {/* Top Notch Cutout */}
        <div className="w-4 h-4 rounded-full bg-[#08090c] -mt-2 border-b border-white/10" />
        {/* Dashed vertical line */}
        <div className="w-[1px] flex-1 border-r border-dashed border-white/20 my-1" />
        {/* Bottom Notch Cutout */}
        <div className="w-4 h-4 rounded-full bg-[#08090c] -mb-2 border-t border-white/10" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-between h-4 w-full mx-0 ${className}`}>
      {/* Left Notch Cutout */}
      <div className="w-4 h-4 rounded-full bg-[#08090c] -ml-2 border-r border-white/10 shrink-0" />
      {/* Dashed horizontal line */}
      <div className="h-[1px] flex-1 border-b border-dashed border-white/20 mx-1" />
      {/* Right Notch Cutout */}
      <div className="w-4 h-4 rounded-full bg-[#08090c] -mr-2 border-l border-white/10 shrink-0" />
    </div>
  );
};
