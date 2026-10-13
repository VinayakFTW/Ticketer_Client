import React, { useState } from 'react';
import { mockStore, SimulatedTicket } from '../../data/mock-store';
import { StatusBadge } from '../common/StatusBadge';
import { soundFX } from '../../audio/soundFX';
import { Send, CheckCircle2, User, Clock } from 'lucide-react';

export const ClientConsole: React.FC = () => {
  const [ticketText, setTicketText] = useState('');
  const [institute, setInstitute] = useState('MIT-CSAIL');
  const [userEmail] = useState('clara.oswald@mit.edu');
  const [tickets, setTickets] = useState<SimulatedTicket[]>(mockStore.getClientTickets(userEmail));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketText.trim()) return;

    setIsSubmitting(true);
    soundFX.playPunch();

    setTimeout(() => {
      const created = mockStore.createClientTicket(ticketText, institute, userEmail);
      setTickets(mockStore.getClientTickets(userEmail));
      setLastSubmittedId(created.ticket_id);
      setTicketText('');
      setIsSubmitting(false);
    }, 280);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left: Interactive Ticket Composer Form (5 Cols) */}
      <div className="lg:col-span-5 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-5">
        
        {/* Endpoint Route Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
              POST
            </span>
            <span className="font-mono text-xs text-white/80">/api/v1/client/tickets/create</span>
          </div>
          <span className="font-mono text-[10px] text-white/40">BEARER_AUTH</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tenant Institute Selection */}
          <div>
            <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-1.5">
              TENANT INSTITUTE
            </label>
            <select
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs font-mono px-3 py-2.5 rounded-xs outline-none transition-colors"
            >
              <option value="MIT-CSAIL">MIT-CSAIL (Computer Science & AI Lab)</option>
              <option value="Stanford-AI">Stanford-AI (Autonomous Systems)</option>
              <option value="CERN-DataLab">CERN-DataLab (High Energy Physics)</option>
              <option value="Oxford-Quantum">Oxford-Quantum (Condensed Matter)</option>
            </select>
          </div>

          {/* Ticket Payload Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-[11px] text-white/50 uppercase tracking-wider">
                INCIDENT SPECIFICATION (TEXT)
              </label>
              <span className="font-mono text-[10px] text-white/30">SCHEMA: string (required)</span>
            </div>
            <textarea
              rows={4}
              required
              value={ticketText}
              onChange={(e) => setTicketText(e.target.value)}
              placeholder="e.g. GPU cluster job aborted due to memory segmentation fault on node compute-08..."
              className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white text-xs font-mono p-3 rounded-xs outline-none transition-colors resize-none placeholder:text-white/20"
            />
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={isSubmitting || !ticketText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 disabled:hover:bg-[#ff4800] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "DISPATCHING ENVELOPE..." : "DISPATCH CLIENT TICKET"}</span>
          </button>
        </form>

        {/* Live Confirmation Stamp */}
        {lastSubmittedId && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="font-mono text-[11px] text-emerald-300">
              Ticket <strong>#TK-{lastSubmittedId}</strong> stamped & enqueued to triage stream.
            </div>
          </div>
        )}

      </div>

      {/* Right: Personal Ticket Stream (7 Cols) */}
      <div className="lg:col-span-7 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 font-mono text-[10px] font-bold">
              GET
            </span>
            <span className="font-mono text-xs text-white/80">/api/v1/client/tickets/all</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
            <User className="w-3.5 h-3.5 text-[#ff4800]" />
            <span>{userEmail}</span>
          </div>
        </div>

        {/* List of client tickets */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {tickets.map((t) => (
            <div 
              key={t.ticket_id}
              className="bg-[#090a0f] border border-white/10 hover:border-white/20 p-4 rounded-xs transition-colors space-y-2 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                  <span className="text-[#ff4800]">#TK-{t.ticket_id}</span>
                  <span className="text-white/30">&bull;</span>
                  <span className="text-white/60">{t.institute}</span>
                </div>
                <StatusBadge status={t.status} size="sm" />
              </div>

              <p className="font-mono text-xs text-white/85 line-clamp-2">
                {t.text}
              </p>

              <div className="flex items-center justify-between font-mono text-[10px] text-white/40 pt-1 border-t border-white/6">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(t.created_at).toLocaleTimeString()}</span>
                </div>
                <div>
                  STAFF: <span className="text-white/70">{t.assigned_email || "PENDING_CLAIM"}</span>
                </div>
              </div>
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="py-12 text-center font-mono text-xs text-white/30">
              NO ACTIVE CLIENT INCIDENTS IN BUFFER
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
