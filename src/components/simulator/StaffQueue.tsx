import React, { useState } from 'react';
import { mockStore, SimulatedTicket } from '../../data/mock-store';
import { StatusBadge } from '../common/StatusBadge';
import { soundFX } from '../../audio/soundFX';
import { CheckCircle2, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

export const StaffQueue: React.FC = () => {
  const [tickets, setTickets] = useState<SimulatedTicket[]>(mockStore.getTickets());
  const [selectedTicketId, setSelectedTicketId] = useState<number>(tickets[0]?.ticket_id || 1042);
  const staffEmail = "marcus.vance@mit.edu";

  const activeTicket = tickets.find(t => t.ticket_id === selectedTicketId) || tickets[0];

  const handleClaim = () => {
    soundFX.playTick();
    const updated = mockStore.updateTicketStatus(activeTicket.ticket_id, 'IN_PROGRESS', staffEmail);
    if (updated) {
      setTickets(mockStore.getTickets());
    }
  };

  const handleBump = () => {
    soundFX.playBump();
    const updated = mockStore.bumpTicket(activeTicket.ticket_id);
    if (updated) {
      setTickets(mockStore.getTickets());
    }
  };

  const handleResolve = () => {
    soundFX.playTick();
    const updated = mockStore.updateTicketStatus(activeTicket.ticket_id, 'RESOLVED');
    if (updated) {
      setTickets(mockStore.getTickets());
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Triage Queue List (5 Cols) */}
      <div className="lg:col-span-5 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              TRIAGE INBOX
            </span>
            <span className="font-mono text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-xs">
              {tickets.length} ACTIVE
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#ff4800]">STAFF_PRIVILEGES</span>
        </div>

        {/* Scrollable list */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {tickets.map((t) => {
            const isSelected = t.ticket_id === activeTicket.ticket_id;
            return (
              <div
                key={t.ticket_id}
                onClick={() => {
                  soundFX.playTick();
                  setSelectedTicketId(t.ticket_id);
                }}
                className={`p-3 rounded-xs border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#151924] border-[#ff4800]/60 shadow-[0_0_15px_rgba(255,72,0,0.12)]' 
                    : 'bg-[#090a0f] border-white/8 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <span className={t.bump_count > 0 ? "text-[#ff4800]" : "text-white/60"}>
                      #TK-{t.ticket_id}
                    </span>
                    <span className="text-white/30">&bull;</span>
                    <span className="text-[10px] text-white/50">{t.institute}</span>
                  </span>
                  <StatusBadge status={t.status} size="sm" />
                </div>

                <p className="font-mono text-[11px] text-white/75 line-clamp-1">
                  {t.text}
                </p>

                {t.bump_count > 0 && (
                  <div className="mt-2 text-[10px] font-mono text-[#ff4800] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>ESCALATED &bull; {t.bump_count} BUMPS</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Active Incident Dispatch Workbench (7 Cols) */}
      <div className="lg:col-span-7 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-6">
        
        {/* Header / Endpoint Reference */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold">
              PUT
            </span>
            <span className="font-mono text-xs text-white/80">
              /api/v1/staff/tickets/update/&#123;ticket_id&#125;
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/40">OPERATION_ID: update_ticket</span>
        </div>

        {/* Selected Ticket Workbench Details */}
        <div className="bg-[#08090c] border border-white/8 p-5 rounded-xs space-y-4">
          
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                ACTIVE INCIDENT INSPECTION
              </div>
              <div className="font-mono text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                <span>#TK-{activeTicket.ticket_id}</span>
                <StatusBadge status={activeTicket.status} size="md" />
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                TENANT ORIGIN
              </div>
              <div className="font-mono text-xs font-semibold text-white/90 mt-0.5 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#ff4800]" />
                {activeTicket.institute}
              </div>
            </div>
          </div>

          {/* Full Incident Text */}
          <div className="p-3 bg-[#11131c] border border-white/8 rounded-xs font-mono text-xs text-white/90 leading-relaxed">
            {activeTicket.text}
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-3 gap-3 font-mono text-[11px] pt-2">
            <div className="bg-[#11131a] p-2.5 rounded-xs border border-white/6">
              <div className="text-white/40 text-[9px] uppercase">CREATED BY</div>
              <div className="text-white truncate font-medium mt-0.5">{activeTicket.created_by}</div>
            </div>
            <div className="bg-[#11131a] p-2.5 rounded-xs border border-white/6">
              <div className="text-white/40 text-[9px] uppercase">ASSIGNED ENGINEER</div>
              <div className="text-white truncate font-medium mt-0.5">{activeTicket.assigned_email || "[UNASSIGNED]"}</div>
            </div>
            <div className="bg-[#11131a] p-2.5 rounded-xs border border-white/6">
              <div className="text-white/40 text-[9px] uppercase">LAST BUMP TIME</div>
              <div className="text-[#ff4800] truncate font-medium mt-0.5">
                {activeTicket.last_bump_time ? new Date(activeTicket.last_bump_time).toLocaleTimeString() : "[NONE]"}
              </div>
            </div>
          </div>

        </div>

        {/* Staff Action Command Bar */}
        <div className="space-y-3">
          <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider">
            WORKFLOW MUTATION TRIGGERS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            
            {/* Claim Action */}
            <button
              onClick={handleClaim}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white rounded-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLAIM TICKET</span>
            </button>

            {/* Bump SLA Action */}
            <button
              onClick={handleBump}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#ff4800]/15 hover:bg-[#ff4800]/25 border border-[#ff4800]/50 text-[#ff4800] font-bold rounded-xs transition-colors shadow-[0_0_12px_rgba(255,72,0,0.15)]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>BUMP SLA (+1)</span>
            </button>

            {/* Resolve Action */}
            <button
              onClick={handleResolve}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold rounded-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>RESOLVE & CLOSE</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
