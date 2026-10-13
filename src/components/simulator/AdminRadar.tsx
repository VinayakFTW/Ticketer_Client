import React, { useState } from 'react';
import { mockStore, SimulatedTicket, SimulatedUser } from '../../data/mock-store';
import { StatusBadge } from '../common/StatusBadge';
import { soundFX } from '../../audio/soundFX';
import { ShieldAlert, Users, Network, PlusCircle, CheckCircle, Database } from 'lucide-react';

export const AdminRadar: React.FC = () => {
  const [tickets, setTickets] = useState<SimulatedTicket[]>(mockStore.getTickets());
  const [users] = useState<SimulatedUser[]>(mockStore.getUsers());
  const [targetEmail, setTargetEmail] = useState('director.lab@stanford.edu');
  const [adminText, setAdminText] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminText.trim() || !targetEmail.trim()) return;

    soundFX.playPunch();
    mockStore.createClientTicket(adminText, "Stanford-AI", targetEmail);
    setTickets(mockStore.getTickets());
    setAdminText('');
    setIsCreated(true);
    setTimeout(() => setIsCreated(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Bar: Cross-Institutional Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0f1118] border border-white/10 p-4 rounded-xs">
          <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-between">
            <span>TOTAL TICKETS</span>
            <Database className="w-3.5 h-3.5 text-white/40" />
          </div>
          <div className="text-xl font-bold text-white mt-1">{tickets.length} CLUSTER_NODES</div>
        </div>

        <div className="bg-[#0f1118] border border-white/10 p-4 rounded-xs">
          <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-between">
            <span>REGISTERED TENANTS</span>
            <Network className="w-3.5 h-3.5 text-[#ff4800]" />
          </div>
          <div className="text-xl font-bold text-[#ff4800] mt-1">4 INSTITUTES</div>
        </div>

        <div className="bg-[#0f1118] border border-white/10 p-4 rounded-xs">
          <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-between">
            <span>SLA ESCALATIONS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {tickets.filter(t => t.bump_count > 0).length} BUMPED
          </div>
        </div>

        <div className="bg-[#0f1118] border border-white/10 p-4 rounded-xs">
          <div className="text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-between">
            <span>USER DIRECTORY</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{users.length} IDENTITIES</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Admin Ticket Injection (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-4">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                POST
              </span>
              <span className="font-mono text-xs text-white/80">/api/v1/admin/tickets/create</span>
            </div>
            <span className="font-mono text-[10px] text-purple-400">ADMIN_OVERRIDE</span>
          </div>

          <form onSubmit={handleAdminCreate} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1.5">
                ON BEHALF OF USER EMAIL (EMAIL)
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs font-mono px-3 py-2 rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1.5">
                ADMIN INJECTION PAYLOAD (TEXT)
              </label>
              <textarea
                rows={3}
                required
                value={adminText}
                onChange={(e) => setAdminText(e.target.value)}
                placeholder="Direct administrative priority intervention..."
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs font-mono p-3 rounded-xs outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase rounded-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ff4800]" />
              <span>SPAWN ADMIN TICKET</span>
            </button>
          </form>

          {isCreated && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xs flex items-center gap-2 text-emerald-300 font-mono text-[11px]">
              <CheckCircle className="w-4 h-4" />
              <span>Ticket dispatched into target tenant pipeline.</span>
            </div>
          )}

          {/* User Directory Sub-Panel */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              USER DIRECTORY STREAM (/api/v1/users/all)
            </div>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[11px]">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-1.5 bg-[#08090c] border border-white/6 rounded-xs">
                  <div className="text-white/80">{u.name}</div>
                  <div className="text-white/40 text-[10px]">{u.institute} &bull; [{u.role}]</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Global Cross-Institute Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-4">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 font-mono text-[10px] font-bold">
                GET
              </span>
              <span className="font-mono text-xs text-white/80">/api/v1/admin/tickets/all</span>
            </div>
            <span className="font-mono text-[10px] text-white/40">SUPERVISORY_FEED</span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 font-mono">
            {tickets.map(t => (
              <div key={t.ticket_id} className="p-3 bg-[#08090c] border border-white/8 rounded-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-[#ff4800]">#TK-{t.ticket_id}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/70">{t.institute}</span>
                  </div>
                  <StatusBadge status={t.status} size="sm" />
                </div>
                <div className="text-xs text-white/85 line-clamp-1">{t.text}</div>
                <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/6">
                  <div>AUTHOR: {t.created_by}</div>
                  <div>ASSIGNED: {t.assigned_email || "NONE"}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
