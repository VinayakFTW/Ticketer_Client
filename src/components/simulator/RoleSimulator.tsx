import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientConsole } from './ClientConsole';
import { StaffQueue } from './StaffQueue';
import { AdminRadar } from './AdminRadar';
import { soundFX } from '../../audio/soundFX';
import { User, Users, ShieldCheck } from 'lucide-react';

export type RoleType = 'client' | 'staff' | 'admin';

export const RoleSimulator: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleType>('client');

  const handleRoleChange = (role: RoleType) => {
    soundFX.playTick();
    setActiveRole(role);
  };

  return (
    <section id="simulator" className="py-24 px-4 md:px-8 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff4800] uppercase tracking-widest">
              <span>SECTION // 01</span>
              <span>&bull;</span>
              <span>INTERACTIVE ROLE ORCHESTRATOR</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
              THREE-TIER TRIAGE DISPATCH
            </h2>
            <p className="text-white/60 font-mono text-xs md:text-sm max-w-2xl">
              Experience the Ticketer platform from any perspective. Seamlessly switch between the client submission portal, staff triage queue, and administrative radar.
            </p>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#10131b] border border-white/12 rounded-xs font-mono text-xs">
            <button
              onClick={() => handleRoleChange('client')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xs transition-all ${
                activeRole === 'client'
                  ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>CLIENT</span>
            </button>

            <button
              onClick={() => handleRoleChange('staff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xs transition-all ${
                activeRole === 'staff'
                  ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>STAFF</span>
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xs transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN</span>
            </button>
          </div>
        </div>

        {/* Dynamic Perspective Surface */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeRole === 'client' && <ClientConsole />}
            {activeRole === 'staff' && <StaffQueue />}
            {activeRole === 'admin' && <AdminRadar />}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
