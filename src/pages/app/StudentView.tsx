import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../audio/soundFX';
import { Ticket, CreateTicketResponseData } from '../../types/api';
import { 
  getClientTicketsApi, 
  createClientTicketApi 
} from '../../api/tickets';
import { 
  getClientSubscriptionApi, 
  renewClientSubscriptionApi, 
  updateClientUserDetailsApi 
} from '../../api/users';
import { 
  Plus, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  User, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'tickets' | 'create' | 'subscription' | 'profile'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketFetchError, setTicketFetchError] = useState<string | null>(null);

  // Ticket creation state
  const [ticketText, setTicketText] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [triageResult, setTriageResult] = useState<CreateTicketResponseData | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // Subscription state
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(true);
  const [updatingSub, setUpdatingSub] = useState(false);

  // Profile update state
  const [nameInput, setNameInput] = useState(user?.username || '');
  const [instituteInput, setInstituteInput] = useState(user?.institute || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchSubscription();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    setTicketFetchError(null);
    try {
      const res = await getClientTicketsApi();
      if (res.data?.tickets) {
        setTickets(res.data.tickets);
      } else {
        setTickets([]);
      }
    } catch (err: unknown) {
      // If 404, it means "no tickets found" per backend controller
      const msg = err instanceof Error ? err.message : '';
      if (!msg.toLowerCase().includes('not found') && !msg.toLowerCase().includes('404')) {
        setTicketFetchError(msg || 'Unable to sync tickets from server');
      }
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await getClientSubscriptionApi();
      if (res.data) {
        setSubscriptionActive(Boolean(res.data.active));
      }
    } catch {
      setSubscriptionActive(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketText.trim()) return;

    soundFX.playPunch();
    setIsSubmittingTicket(true);
    setCreateError(null);
    setTriageResult(null);

    try {
      const res = await createClientTicketApi(ticketText.trim());
      if (!res.data) throw new Error(res.message || 'Failed to file ticket with server');

      const createdData: CreateTicketResponseData = res.data;
      setTriageResult(createdData);
      soundFX.playTick();

      const decisionObj = ('decision' in (createdData.laya_decision || {}))
        ? (createdData.laya_decision as { decision: { department: string; priority: string; is_safety_grievance: boolean } }).decision
        : createdData.laya_decision as { department?: string; priority?: string; is_safety_grievance?: boolean };

      const newTicketObj: Ticket = {
        ticket_id: createdData.ticket_id,
        text: ticketText.trim(),
        summary: createdData.summary || 'AI triage analysis completed.',
        department: decisionObj?.department || 'General Support',
        priority: decisionObj?.priority || 'MEDIUM',
        is_safety_grievance: Boolean(decisionObj?.is_safety_grievance),
        status: 'open',
        assigned_email: null,
        bump_count: 0,
        created_at: new Date().toISOString(),
        last_bump_time: new Date().toISOString(),
      };

      setTickets(prev => [newTicketObj, ...prev]);
      setTicketText('');
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Error submitting incident to server';
      setCreateError(msg);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleToggleSub = async () => {
    soundFX.playPunch();
    setUpdatingSub(true);
    const next = !subscriptionActive;
    try {
      await renewClientSubscriptionApi(next);
      setSubscriptionActive(next);
      soundFX.playTick();
    } catch {
      soundFX.playBump();
    } finally {
      setUpdatingSub(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPunch();
    setProfileSaving(true);
    setProfileSaved(false);

    try {
      await updateClientUserDetailsApi({
        name: nameInput,
        institute: instituteInput,
        password: passwordInput || undefined,
      });
      updateUser({ username: nameInput, institute: instituteInput });
      soundFX.playTick();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      soundFX.playBump();
    } finally {
      setProfileSaving(false);
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchStatus = filterStatus === 'ALL' || t.status.toUpperCase() === filterStatus.toUpperCase();
    const matchQuery = !searchQuery || 
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(t.ticket_id).includes(searchQuery);
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => { soundFX.playTick(); setActiveTab('tickets'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MY INCIDENTS ({tickets.length})</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('create'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>FILE INCIDENT (AI DISPATCH)</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('subscription'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'subscription'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SLA SUBSCRIPTION</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('profile'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>PROFILE</span>
          </button>
        </div>

        {/* Live sync trigger */}
        <button
          onClick={() => { soundFX.playTick(); fetchTickets(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/12 text-white/70 hover:text-white rounded-xs font-mono text-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingTickets ? 'animate-spin text-[#ff4800]' : ''}`} />
          <span>SYNC WITH SERVER</span>
        </button>
      </div>

      {ticketFetchError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs font-mono text-xs text-red-300">
          {ticketFetchError}
        </div>
      )}

      {/* TAB 1: TICKETS LIST */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 p-1 bg-[#10131b] border border-white/10 rounded-xs">
              {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => { soundFX.playTick(); setFilterStatus(st); }}
                  className={`px-3 py-1.5 rounded-xs transition-colors ${
                    filterStatus === st 
                      ? 'bg-white/15 text-white font-bold' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search description, summary, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0e1017] border border-white/12 focus:border-[#ff4800] text-white text-xs pl-8 pr-3 py-2 rounded-xs outline-none font-mono placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 gap-3 font-mono">
            {loadingTickets ? (
              <div className="p-12 text-center bg-[#0e1017] border border-white/10 rounded-xs text-white/60 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#ff4800] mx-auto" />
                <div className="text-xs">FETCHING ACTIVE INCIDENTS FROM SERVER...</div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center bg-[#0e1017] border border-white/10 rounded-xs text-white/40 space-y-3">
                <Clock className="w-8 h-8 text-white/20 mx-auto" />
                <div className="text-sm font-bold text-white/80 uppercase">NO INCIDENTS CURRENTLY RECORDED</div>
                <div className="text-xs max-w-md mx-auto text-white/50 leading-relaxed font-sans">
                  You have no active or historical tickets in the campus helpdesk ledger. File your first ticket using the incident composer.
                </div>
                <button
                  onClick={() => { soundFX.playTick(); setActiveTab('create'); }}
                  className="px-4 py-2 bg-[#ff4800] hover:bg-[#e03f00] text-white font-bold text-xs uppercase rounded-xs transition-all mt-2"
                >
                  DISPATCH FIRST TICKET
                </button>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.ticket_id === t.ticket_id;
                const isCritical = t.priority === 'CRITICAL' || t.is_safety_grievance;

                return (
                  <div
                    key={t.ticket_id}
                    onClick={() => { soundFX.playTick(); setSelectedTicket(isSelected ? null : t); }}
                    className={`p-4 bg-[#0e1017] border rounded-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#ff4800] bg-[#131722] shadow-[0_0_15px_rgba(255,72,0,0.15)]' 
                        : 'border-white/10 hover:border-white/25 hover:bg-[#11131c]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/6 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#ff4800]">#{t.ticket_id}</span>
                        <span className="text-white/40">&bull;</span>
                        <span className="text-white/80 font-semibold">{t.department || 'Triage Assigned'}</span>
                        {t.is_safety_grievance && (
                          <span className="px-2 py-0.5 rounded-xs bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            SAFETY GRIEVANCE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          t.status.toLowerCase() === 'open' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          t.status.toLowerCase() === 'in_progress' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                          t.status.toLowerCase() === 'resolved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          'bg-white/10 text-white/60 border border-white/20'
                        }`}>
                          {t.status}
                        </span>

                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          t.priority === 'URGENT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-white/5 text-white/50 border border-white/10'
                        }`}>
                          {t.priority || 'MEDIUM'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2">
                      <div className="text-sm font-sans text-white/90 leading-relaxed">
                        {t.text}
                      </div>

                      {t.summary && (
                        <div className="p-2.5 bg-black/40 border border-white/6 rounded-xs text-xs text-white/60 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#ff4800] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white/80">AI Synthesis:</strong> {t.summary}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-white/40 pt-1">
                        <div className="flex items-center gap-3">
                          <span>FILED: {new Date(t.created_at).toLocaleString()}</span>
                          {t.bump_count > 0 && (
                            <span className="text-amber-400 font-bold">
                              BUMPED: {t.bump_count}x
                            </span>
                          )}
                        </div>
                        {t.assigned_email && (
                          <span className="text-cyan-400">
                            ASSIGNED: {t.assigned_email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FILE INCIDENT */}
      {activeTab === 'create' && (
        <div className="max-w-2xl bg-[#0e1017] border border-white/12 rounded-xs p-6 space-y-6 font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#ff4800] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>SERVER INCIDENT INGESTION (POST /api/v1/client/tickets/create)</span>
            </div>
            <h2 className="text-2xl font-bold uppercase text-white font-['Space_Grotesk']">
              DISPATCH NEW TICKET
            </h2>
            <p className="text-xs text-white/60">
              Your grievance is processed through the backend AI pipeline, classifying department, priority, and safety hazard criteria.
            </p>
          </div>

          {createError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs text-xs text-red-300">
              {createError}
            </div>
          )}

          {triageResult && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xs space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>TICKET RECORD CREATED IN DATABASE &bull; ID #{triageResult.ticket_id}</span>
              </div>
              <div className="text-xs text-white/80 space-y-1">
                <div><strong>AI Summary:</strong> {triageResult.summary}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-1.5">
                INCIDENT SPECIFICATION / ISSUE DESCRIPTION
              </label>
              <textarea
                rows={5}
                required
                value={ticketText}
                onChange={(e) => setTicketText(e.target.value)}
                placeholder="Describe your technical, facility, or administrative issue in detail (e.g. Lab projector lamp failure, Wi-Fi connectivity error in hostel block, LMS account access, bonafide letter request)..."
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-3 rounded-xs outline-none transition-colors resize-none placeholder:text-white/20 font-sans text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingTicket || !ticketText.trim()}
              className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 disabled:hover:bg-[#ff4800] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,72,0,0.25)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingTicket ? "ANALYZING & TRANSMITTING..." : "TRANSMIT TICKET TO BACKEND"}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SLA SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="max-w-2xl bg-[#0e1017] border border-white/12 rounded-xs p-6 space-y-6 font-mono">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold uppercase text-white font-['Space_Grotesk']">
              INSTITUTIONAL SLA SUBSCRIPTION
            </h2>
            <p className="text-xs text-white/60">
              Manage your active subscription record stored in the PostgreSQL database.
            </p>
          </div>

          <div className="p-4 bg-[#08090c] border border-white/10 rounded-xs flex items-center justify-between">
            <div className="space-y-1 text-xs">
              <div className="text-white/50">SERVER DATABASE STATE:</div>
              <div className={`text-base font-bold ${subscriptionActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {subscriptionActive ? 'ACTIVE // PROVISIONED IN DB' : 'INACTIVE // REQUIRES RENEWAL'}
              </div>
            </div>

            <button
              onClick={handleToggleSub}
              disabled={updatingSub}
              className="px-4 py-2 bg-[#ff4800] hover:bg-[#e03f00] text-white text-xs font-bold rounded-xs transition-all active:scale-95"
            >
              {updatingSub ? 'COMMITTING...' : subscriptionActive ? 'RENEW SUBSCRIPTION' : 'ACTIVATE SUBSCRIPTION'}
            </button>
          </div>

          <div className="space-y-3 text-xs text-white/70 border-t border-white/8 pt-4">
            <div className="font-bold text-white uppercase">Entitlements:</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI Triage & LLM Summary Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Campus Facilities, IT, and Hostel Department Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Anti-Ragging & Safety Grievance Priority Escalation</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-[#0e1017] border border-white/12 rounded-xs p-6 space-y-6 font-mono">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold uppercase text-white font-['Space_Grotesk']">
              USER RECORD (PUT /api/v1/client/users/update)
            </h2>
            <p className="text-xs text-white/60">
              Update your student account details in the database.
            </p>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-xs text-emerald-400">
              Database record updated successfully.
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/60 uppercase mb-1">FULL NAME</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 uppercase mb-1">REGISTERED EMAIL</label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@sitpune.edu.in'}
                className="w-full bg-[#050608] border border-white/10 text-white/50 p-2.5 rounded-xs outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-white/60 uppercase mb-1">INSTITUTE / CAMPUS</label>
              <input
                type="text"
                value={instituteInput}
                onChange={(e) => setInstituteInput(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 uppercase mb-1">NEW PASSWORD (OPTIONAL)</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full py-2.5 bg-[#ff4800] hover:bg-[#e03f00] text-white font-bold uppercase rounded-xs transition-colors"
            >
              {profileSaving ? 'SAVING...' : 'COMMIT PROFILE UPDATE'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default StudentView;
