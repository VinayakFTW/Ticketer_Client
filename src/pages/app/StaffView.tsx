import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../audio/soundFX';
import { Ticket, TicketStatus } from '../../types/api';
import { updateStaffTicketApi, getStaffTicketsApi } from '../../api/tickets';
import { 
  Users, 
  AlertTriangle, 
  Search, 
  UserCheck, 
  Sparkles,
  Send,
  RefreshCw,
  Clock
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { user } = useAuth();

  const [queue, setQueue] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit controls for active ticket
  const [newStatus, setNewStatus] = useState<string>('open');
  const [assignedEmailInput, setAssignedEmailInput] = useState<string>('');

  const activeTicket = queue.find(t => t.ticket_id === selectedTicketId) || queue[0] || null;

  useEffect(() => {
    fetchStaffTickets();
  }, []);

  useEffect(() => {
    if (activeTicket) {
      setNewStatus(activeTicket.status.toLowerCase());
      setAssignedEmailInput(activeTicket.assigned_email || '');
    }
  }, [selectedTicketId, activeTicket]);

  const fetchStaffTickets = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getStaffTicketsApi();
      const ticketList: Ticket[] = res.data?.tickets || [];
      setQueue(ticketList);
      if (ticketList.length > 0 && !selectedTicketId) {
        setSelectedTicketId(ticketList[0].ticket_id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.toLowerCase().includes('not found') && !msg.toLowerCase().includes('404')) {
        setFetchError(msg || 'Unable to fetch queue from server');
      }
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = (t: Ticket) => {
    soundFX.playTick();
    setSelectedTicketId(t.ticket_id);
    setNewStatus(t.status.toLowerCase());
    setAssignedEmailInput(t.assigned_email || '');
    setStatusMessage(null);
  };

  const handleClaimTicket = async () => {
    if (!activeTicket || !user?.email) return;
    soundFX.playPunch();
    setAssignedEmailInput(user.email);
    await handleApplyUpdate('in_progress', user.email);
  };

  const handleApplyUpdate = async (statusOverride?: string, emailOverride?: string) => {
    if (!activeTicket) return;
    soundFX.playPunch();
    setIsUpdating(true);
    setStatusMessage(null);

    const targetStatus = (statusOverride || newStatus).toUpperCase();
    const targetEmail = emailOverride !== undefined ? emailOverride : assignedEmailInput;

    try {
      const res = await updateStaffTicketApi(activeTicket.ticket_id, {
        status: targetStatus,
        assigned_email: targetEmail || undefined,
      });

      // Update state with server response data
      const returnedTicket = res.data?.ticket;
      setQueue(prev => prev.map(t => {
        if (t.ticket_id === activeTicket.ticket_id) {
          return {
            ...t,
            status: targetStatus.toLowerCase() as TicketStatus,
            assigned_email: targetEmail || null,
            bump_count: returnedTicket ? returnedTicket.bump_count : t.bump_count + 1,
            last_bump_time: returnedTicket?.last_bump_time || new Date().toISOString(),
          };
        }
        return t;
      }));

      soundFX.playTick();
      setStatusMessage(`Incident #${activeTicket.ticket_id} updated in database.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Error updating ticket';
      setStatusMessage(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const DEPARTMENT_LABELS: Record<string, string> = {
    ALL: 'ALL',
    it_support: 'IT Support',
    facilities: 'Facilities',
    academics_admin: 'Academics',
    student_services: 'Student Services',
    safety_committee: 'Safety',
  };

  const departments = ['ALL', 'it_support', 'facilities', 'academics_admin', 'student_services', 'safety_committee'];

  // Filtered queue
  const filteredQueue = queue.filter(t => {
    const matchDept = filterDepartment === 'ALL' || t.department?.toLowerCase() === filterDepartment.toLowerCase();
    const matchStatus = filterStatus === 'ALL' || t.status.toLowerCase() === filterStatus.toLowerCase();
    const matchQuery = !searchQuery || 
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.user_email && t.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(t.ticket_id).includes(searchQuery);
    return matchDept && matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6 font-mono">
      
      {/* Vitals Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0e1017] border border-white/10 p-3.5 rounded-xs">
          <div className="text-[10px] text-white/40 uppercase">ACTIVE QUEUE</div>
          <div className="text-xl font-bold text-white mt-1">{queue.length} INCIDENTS</div>
        </div>

        <div className="bg-[#0e1017] border border-white/10 p-3.5 rounded-xs">
          <div className="text-[10px] text-amber-400 uppercase">UNASSIGNED / OPEN</div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {queue.filter(t => t.status.toLowerCase() === 'open').length} TICKETS
          </div>
        </div>

        <div className="bg-[#0e1017] border border-white/10 p-3.5 rounded-xs">
          <div className="text-[10px] text-cyan-400 uppercase">IN PROGRESS</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">
            {queue.filter(t => t.status.toLowerCase() === 'in_progress').length} CLAIMED
          </div>
        </div>

        <div className="bg-[#0e1017] border border-white/10 p-3.5 rounded-xs">
          <div className="text-[10px] text-red-400 uppercase">SLA ESCALATIONS</div>
          <div className="text-xl font-bold text-red-400 mt-1">
            {queue.filter(t => t.bump_count > 0 || t.priority === 'CRITICAL').length} ESCALATED
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs text-xs text-red-300">
          {fetchError}
        </div>
      )}

      {/* Main Triage Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Queue Inbox (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0e1017] border border-white/10 rounded-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3 text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#ff4800]" />
              STAFF TRIAGE QUEUE
            </span>
            <button
              onClick={() => { soundFX.playTick(); fetchStaffTickets(); }}
              className="text-[10px] text-white/50 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#ff4800]' : ''}`} />
              <span>SYNC</span>
            </button>
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => { soundFX.playTick(); setFilterStatus(st); }}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  filterStatus === st 
                    ? 'bg-white/20 text-white font-bold' 
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Department filter */}
          <div className="flex flex-wrap gap-1 text-[11px]">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => { soundFX.playTick(); setFilterDepartment(d); }}
                className={`px-2 py-1 rounded-xs transition-colors ${
                  filterDepartment === d 
                    ? 'bg-[#ff4800] text-white font-bold' 
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {DEPARTMENT_LABELS[d] || d}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search queue text or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08090c] border border-white/10 focus:border-[#ff4800] text-white text-xs pl-8 pr-3 py-2 rounded-xs outline-none placeholder:text-white/20"
            />
          </div>

          {/* Ticket list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-white/40 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#ff4800] mb-2" />
                <span>QUERYING DISPATCH QUEUE...</span>
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs space-y-2">
                <Clock className="w-6 h-6 text-white/20 mx-auto" />
                <div className="font-bold text-white/60">NO INCIDENTS IN TRIAGE QUEUE</div>
                <div className="text-[11px] text-white/40">Queue is clear or no tickets have been filed yet.</div>
              </div>
            ) : (
              filteredQueue.map((t) => {
                const isSelected = activeTicket?.ticket_id === t.ticket_id;
                const isCritical = t.priority === 'CRITICAL' || t.is_safety_grievance;

                return (
                  <div
                    key={t.ticket_id}
                    onClick={() => handleSelectTicket(t)}
                    className={`p-3 rounded-xs border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#151924] border-[#ff4800] shadow-[0_0_15px_rgba(255,72,0,0.15)]' 
                        : 'bg-[#090a0f] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/6">
                      <span className="font-bold text-[#ff4800]">#{t.ticket_id}</span>
                      <div className="flex items-center gap-1.5">
                        {isCritical && (
                          <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-xs text-[9px] font-bold">
                            CRITICAL
                          </span>
                        )}
                        <span className="text-white/40 text-[10px] uppercase">{t.status}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs font-sans text-white/80 line-clamp-2">
                      {t.text}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-white/40">
                      <span>{t.department ? (DEPARTMENT_LABELS[t.department] || t.department) : 'General'}</span>
                      {t.user_email && <span className="text-white/30 truncate max-w-[140px]">{t.user_email}</span>}
                      {t.bump_count > 0 && (
                        <span className="text-amber-400 font-bold">BUMPED {t.bump_count}x</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Ticket Action Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0e1017] border border-white/10 rounded-xs p-5 sm:p-6 space-y-6">
          {!activeTicket ? (
            <div className="p-16 text-center text-white/30 space-y-2">
              <Clock className="w-8 h-8 text-white/20 mx-auto" />
              <div className="text-sm font-bold text-white/60 uppercase">NO INCIDENT SELECTED</div>
              <div className="text-xs">Select a ticket from the left triage inbox to review and dispatch.</div>
            </div>
          ) : (
            <>
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white font-['Space_Grotesk']">
                      INCIDENT #{activeTicket.ticket_id}
                    </span>
                    {activeTicket.is_safety_grievance && (
                      <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center gap-1 rounded-xs">
                        <AlertTriangle className="w-3 h-3" />
                        SAFETY HAZARD
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5 flex flex-wrap items-center gap-x-4">
                    <span>Assigned Department: <span className="text-white">{DEPARTMENT_LABELS[activeTicket.department || ''] || activeTicket.department || 'Triage Assigned'}</span></span>
                    {activeTicket.user_email && (
                      <span>Filed by: <span className="text-cyan-400 font-mono">{activeTicket.user_email}</span></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClaimTicket}
                    disabled={isUpdating}
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold rounded-xs text-xs flex items-center gap-1.5 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>CLAIM INCIDENT</span>
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-xs text-emerald-300">
                  {statusMessage}
                </div>
              )}

              {/* Description & AI Summary */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-white/40 uppercase block mb-1">
                    CLIENT INCIDENT TEXT
                  </label>
                  <div className="p-3.5 bg-[#08090c] border border-white/8 rounded-xs text-sm font-sans text-white/90 leading-relaxed">
                    {activeTicket.text}
                  </div>
                </div>

                {activeTicket.summary && (
                  <div>
                    <label className="text-[11px] text-[#ff4800] uppercase block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI TRIAGE SUMMARY</span>
                    </label>
                    <div className="p-3.5 bg-black/40 border border-white/6 rounded-xs text-xs text-white/80 leading-relaxed">
                      {activeTicket.summary}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Form */}
              <div className="p-4 bg-[#08090c] border border-white/10 rounded-xs space-y-4 text-xs">
                <div className="font-bold text-white uppercase text-xs border-b border-white/8 pb-2">
                  DISPATCH UPDATE (PUT /api/v1/staff/tickets/update)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1">UPDATE STATUS</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-[#0e1017] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none"
                    >
                      <option value="open">OPEN (Pending Investigation)</option>
                      <option value="in_progress">IN_PROGRESS (Under Active Resolution)</option>
                      <option value="resolved">RESOLVED (Solution Deployed)</option>
                      <option value="closed">CLOSED (Verified & Terminated)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1">ASSIGNED STAFF EMAIL</label>
                    <input
                      type="email"
                      placeholder="staff@sitpune.edu.in"
                      value={assignedEmailInput}
                      onChange={(e) => setAssignedEmailInput(e.target.value)}
                      className="w-full bg-[#0e1017] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-white/40">
                    Bumps: <strong className="text-amber-400">{activeTicket.bump_count}</strong> &bull; Priority: <strong className="text-white">{activeTicket.priority || 'MEDIUM'}</strong>
                  </div>

                  <button
                    onClick={() => handleApplyUpdate()}
                    disabled={isUpdating}
                    className="px-5 py-2.5 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 text-white font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,72,0,0.3)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdating ? 'SAVING TO SERVER...' : 'COMMIT DISPATCH RECORD'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default StaffView;
