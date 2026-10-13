import React, { useState, useEffect } from 'react';
import { soundFX } from '../../audio/soundFX';
import { Ticket, UserProfile, CreateTicketResponseData } from '../../types/api';
import { 
  getAdminTicketsApi, 
  createAdminTicketApi 
} from '../../api/tickets';
import { 
  getAdminUsersApi, 
  getAdminUserSubscriptionApi, 
  renewAdminUserSubscriptionApi 
} from '../../api/users';
import { 
  Shield, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Send, 
  Sparkles,
  Layers,
  Activity,
  X
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'tickets' | 'users' | 'proxy-create'>('radar');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & filter
  const [ticketSearch, setTicketSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Proxy ticket state
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [proxyTicketText, setProxyTicketText] = useState('');
  const [isCreatingProxy, setIsCreatingProxy] = useState(false);
  const [proxyResult, setProxyResult] = useState<CreateTicketResponseData | null>(null);
  const [proxyError, setProxyError] = useState<string | null>(null);

  // User subscription inspection modal/state
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userSubState, setUserSubState] = useState<boolean>(true);
  const [togglingSub, setTogglingSub] = useState(false);
  const [subNotice, setSubNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, usersRes] = await Promise.allSettled([
        getAdminTicketsApi(),
        getAdminUsersApi(),
      ]);

      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.data?.tickets) {
        setTickets(ticketsRes.value.data.tickets);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.data?.users) {
        setUsers(usersRes.value.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProxyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserEmail.trim() || !proxyTicketText.trim()) return;

    soundFX.playPunch();
    setIsCreatingProxy(true);
    setProxyError(null);
    setProxyResult(null);

    try {
      const res = await createAdminTicketApi(targetUserEmail.trim(), proxyTicketText.trim());
      if (!res.data) throw new Error(res.message || 'Error generating proxy ticket');
      const created = res.data;

      setProxyResult(created);
      soundFX.playTick();

      const rawDec = created.laya_decision;
      const dec = rawDec ? ('decision' in rawDec ? rawDec.decision : rawDec) : undefined;
      const dept = dec?.department || 'General';
      const priority = dec?.priority || 'MEDIUM';
      const is_safety = dec?.is_safety_grievance || false;

      const newT: Ticket = {
        ticket_id: created.ticket_id,
        text: proxyTicketText.trim(),
        summary: created.summary || '',
        department: dept,
        priority: priority,
        is_safety_grievance: is_safety,
        status: 'open',
        assigned_email: null,
        bump_count: 0,
        created_at: new Date().toISOString(),
        last_bump_time: null,
      };
      setTickets(prev => [newT, ...prev]);
      setProxyTicketText('');
    } catch (err: unknown) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Error generating proxy ticket';
      setProxyError(msg);
    } finally {
      setIsCreatingProxy(false);
    }
  };

  const handleInspectUserSub = async (u: UserProfile) => {
    soundFX.playTick();
    setSelectedUser(u);
    setSubNotice(null);
    setUserSubState(false);

    try {
      const res = await getAdminUserSubscriptionApi(u.user_id);
      if (res.data) {
        setUserSubState(res.data.active);
      }
    } catch {
      setUserSubState(false);
    }
  };

  const handleToggleUserSub = async () => {
    if (!selectedUser) return;
    soundFX.playPunch();
    setTogglingSub(true);
    const next = !userSubState;

    try {
      await renewAdminUserSubscriptionApi(selectedUser.user_id, next);
      setUserSubState(next);
      soundFX.playTick();
      setSubNotice(`Subscription for ${selectedUser.username} updated to ${next ? 'ACTIVE' : 'INACTIVE'}.`);
    } catch (err) {
      soundFX.playBump();
      const msg = err instanceof Error ? err.message : 'Error modifying user subscription';
      setSubNotice(msg);
    } finally {
      setTogglingSub(false);
    }
  };

  // Filtered lists
  const filteredTickets = tickets.filter(t => 
    !ticketSearch || 
    t.text.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    (t.department && t.department.toLowerCase().includes(ticketSearch.toLowerCase())) ||
    String(t.ticket_id).includes(ticketSearch)
  );

  const filteredUsers = users.filter(u =>
    !userSearch ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.institute.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono">
      
      {/* Top Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => { soundFX.playTick(); setActiveTab('radar'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'radar'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SYSTEM RADAR</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('tickets'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GLOBAL REGISTRY ({tickets.length})</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('users'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>USER DIRECTORY ({users.length})</span>
          </button>

          <button
            onClick={() => { soundFX.playTick(); setActiveTab('proxy-create'); }}
            className={`px-4 py-2 rounded-xs transition-all flex items-center gap-2 ${
              activeTab === 'proxy-create'
                ? 'bg-[#ff4800] text-white font-bold shadow-[0_0_12px_rgba(255,72,0,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>PROXY TICKET DISPATCH</span>
          </button>
        </div>

        <button
          onClick={() => { soundFX.playTick(); fetchAdminData(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/12 text-white/70 hover:text-white rounded-xs text-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff4800]' : ''}`} />
          <span>REFRESH ALL DATA</span>
        </button>
      </div>

      {/* TAB 1: RADAR OVERVIEW */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#0e1017] border border-white/10 p-4 rounded-xs">
              <div className="text-[10px] text-white/40 uppercase">GLOBAL TICKETS INGESTED</div>
              <div className="text-2xl font-bold text-white mt-1">{tickets.length} RECORDS</div>
              <div className="text-[10px] text-white/40 mt-1">Cross-department institutional volume</div>
            </div>

            <div className="bg-[#0e1017] border border-white/10 p-4 rounded-xs">
              <div className="text-[10px] text-emerald-400 uppercase">CAMPUS USER IDENTITIES</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{users.length} REGISTERED</div>
              <div className="text-[10px] text-white/40 mt-1">Verified @sitpune.edu.in accounts</div>
            </div>

            <div className="bg-[#0e1017] border border-white/10 p-4 rounded-xs">
              <div className="text-[10px] text-amber-400 uppercase">SLA ESCALATIONS</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {tickets.filter(t => t.bump_count > 0).length} BUMPED
              </div>
              <div className="text-[10px] text-white/40 mt-1">Automated supervisor escalation</div>
            </div>

            <div className="bg-[#0e1017] border border-white/10 p-4 rounded-xs">
              <div className="text-[10px] text-cyan-400 uppercase">CAMPUS DEPARTMENTS</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">4 CLUSTERS</div>
              <div className="text-[10px] text-white/40 mt-1">IT, Facilities, Academics, Grievances</div>
            </div>
          </div>

          {/* Recent System Activity Log */}
          <div className="bg-[#0e1017] border border-white/10 rounded-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-3 text-xs">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#ff4800]" />
                TELEMETRY & RECENT INCIDENTS AUDIT TRAIL
              </span>
              <span className="text-white/40 text-[10px]">ALL LOGS CURRENT</span>
            </div>

            <div className="space-y-2">
              {tickets.length === 0 ? (
                <div className="p-8 text-center border border-white/5 bg-[#08090c] rounded-xs text-white/40 text-xs">
                  NO GLOBAL INCIDENTS OR TELEMETRY LOGS INGESTED YET
                </div>
              ) : (
                tickets.slice(0, 5).map((t) => (
                  <div key={t.ticket_id} className="p-3 bg-[#08090c] border border-white/6 rounded-xs flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#ff4800]">#{t.ticket_id}</span>
                        <span className="text-white/80 font-sans text-xs">{t.text.slice(0, 75)}...</span>
                      </div>
                      <div className="text-[10px] text-white/40">
                        Dept: {t.department} &bull; Priority: {t.priority} &bull; Filed: {new Date(t.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                      t.status.toLowerCase() === 'open' ? 'bg-amber-500/15 text-amber-400' :
                      t.status.toLowerCase() === 'in_progress' ? 'bg-cyan-500/15 text-cyan-400' :
                      'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL TICKETS REGISTRY */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search all institutional tickets..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full bg-[#0e1017] border border-white/12 focus:border-[#ff4800] text-white text-xs pl-8 pr-3 py-2 rounded-xs outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-[#0e1017] border border-white/10 rounded-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08090c] border-b border-white/10 text-white/40 text-[10px] uppercase">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">DESCRIPTION / SUMMARY</th>
                  <th className="p-3">DEPARTMENT</th>
                  <th className="p-3">PRIORITY</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">BUMP COUNT</th>
                  <th className="p-3">ASSIGNED STAFF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-white/40 text-xs">
                      {ticketSearch ? 'NO MATCHING TICKETS FOUND FOR CURRENT FILTER' : 'NO GLOBAL TICKETS CURRENTLY LOGGED IN DATABASE'}
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.ticket_id} className="hover:bg-white/4 transition-colors">
                      <td className="p-3 font-bold text-[#ff4800]">#{t.ticket_id}</td>
                      <td className="p-3 max-w-xs font-sans text-white/80">
                        <div>{t.text}</div>
                        {t.summary && <div className="text-[11px] text-white/40 font-mono mt-0.5">AI: {t.summary}</div>}
                      </td>
                      <td className="p-3 text-white/70">{t.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          t.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          t.priority === 'URGENT' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-white/5 text-white/60'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="uppercase text-[11px] font-bold text-white/80">{t.status}</span>
                      </td>
                      <td className="p-3 text-amber-400 font-bold">{t.bump_count}x</td>
                      <td className="p-3 text-cyan-400 text-[11px]">{t.assigned_email || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY & SUBSCRIPTION MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search registered students & staff..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#0e1017] border border-white/12 focus:border-[#ff4800] text-white text-xs pl-8 pr-3 py-2 rounded-xs outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-[#0e1017] border border-white/10 rounded-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08090c] border-b border-white/10 text-white/40 text-[10px] uppercase">
                <tr>
                  <th className="p-3">USER ID</th>
                  <th className="p-3">FULL NAME</th>
                  <th className="p-3">INSTITUTIONAL EMAIL</th>
                  <th className="p-3">INSTITUTE / DEPARTMENT</th>
                  <th className="p-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/40 text-xs">
                      {userSearch ? 'NO MATCHING USERS FOUND FOR CURRENT FILTER' : 'NO REGISTERED USER IDENTITIES FOUND IN DIRECTORY'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.user_id} className="hover:bg-white/4 transition-colors">
                      <td className="p-3 font-bold text-[#ff4800]">#{u.user_id}</td>
                      <td className="p-3 font-bold text-white">{u.username}</td>
                      <td className="p-3 text-white/70">{u.email}</td>
                      <td className="p-3 text-white/50">{u.institute}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleInspectUserSub(u)}
                          className="px-3 py-1 bg-white/6 hover:bg-[#ff4800] text-white/80 hover:text-white border border-white/10 rounded-xs text-[11px] transition-colors"
                        >
                          MANAGE SUBSCRIPTION
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* User Subscription Modal Drawer */}
          {selectedUser && (
            <div className="p-5 bg-[#0e1017] border-2 border-[#ff4800] rounded-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <div className="text-sm font-bold text-white uppercase">
                  MANAGE SUBSCRIPTION // {selectedUser.username} (#{selectedUser.user_id})
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-white/50">Current SLA Subscription State:</div>
                  <div className={`text-sm font-bold mt-0.5 ${userSubState ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {userSubState ? 'ACTIVE // FAST-TRACK SLA' : 'INACTIVE // STANDARD'}
                  </div>
                </div>

                <button
                  onClick={handleToggleUserSub}
                  disabled={togglingSub}
                  className="px-4 py-2 bg-[#ff4800] hover:bg-[#e03f00] text-white font-bold uppercase rounded-xs transition-colors"
                >
                  {togglingSub ? 'COMMITTING...' : userSubState ? 'REVOKE / DEACTIVATE' : 'GRANT / RENEW SUBSCRIPTION'}
                </button>
              </div>

              {subNotice && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xs">
                  {subNotice}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROXY TICKET DISPATCH */}
      {activeTab === 'proxy-create' && (
        <div className="max-w-2xl bg-[#0e1017] border border-white/12 rounded-xs p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#ff4800] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>ADMINISTRATIVE PROXY INGESTION</span>
            </div>
            <h2 className="text-2xl font-bold uppercase text-white font-['Space_Grotesk']">
              CREATE TICKET ON BEHALF OF USER
            </h2>
            <p className="text-xs text-white/60">
              Administer emergency incident dispatch for any student or faculty member (`POST /api/v1/admin/tickets/create`).
            </p>
          </div>

          {proxyError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xs text-xs text-red-300">
              {proxyError}
            </div>
          )}

          {proxyResult && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xs space-y-2 text-xs text-emerald-300 animate-in fade-in">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>PROXY TICKET GENERATED // #{proxyResult.ticket_id}</span>
              </div>
              <div className="text-white/80">
                <strong>Summary:</strong> {proxyResult.summary}
              </div>
            </div>
          )}

          <form onSubmit={handleCreateProxyTicket} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-1">
                TARGET STUDENT / USER EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="student@sitpune.edu.in"
                value={targetUserEmail}
                onChange={(e) => setTargetUserEmail(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-white/60 mb-1">
                INCIDENT DESCRIPTION (TEXT)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Specify incident details for automated AI classification and department assignment..."
                value={proxyTicketText}
                onChange={(e) => setProxyTicketText(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 focus:border-[#ff4800] text-white p-2.5 rounded-xs outline-none font-sans text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isCreatingProxy || !targetUserEmail || !proxyTicketText}
              className="w-full py-3 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-40 text-white font-bold uppercase rounded-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,72,0,0.25)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isCreatingProxy ? 'DISPATCHING PROXY TICKET...' : 'DISPATCH PROXY TICKET'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminView;
