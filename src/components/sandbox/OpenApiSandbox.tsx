import React, { useState } from 'react';
import { ENDPOINTS, EndpointDefinition } from '../../data/openapi-data';
import { soundFX } from '../../audio/soundFX';
import { Send, Key, Activity, Copy, Check } from 'lucide-react';

export const OpenApiSandbox: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition>(ENDPOINTS[0]);
  const [payloadText, setPayloadText] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload || {}, null, 2)
  );
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isExecuting, setIsExecuting] = useState(false);
  const [packetProgress, setPacketProgress] = useState(0);
  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [responseBody, setResponseBody] = useState<Record<string, unknown>>(ENDPOINTS[0].successResponseSample);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Authentication', 'Client', 'Staff', 'Admin'];

  const filteredEndpoints = activeCategory === 'All' 
    ? ENDPOINTS 
    : ENDPOINTS.filter(e => e.tag === activeCategory);

  const handleSelectEndpoint = (ep: EndpointDefinition) => {
    soundFX.playTick();
    setSelectedEndpoint(ep);
    setPayloadText(JSON.stringify(ep.defaultPayload || {}, null, 2));
    setResponseStatus(200);
    setResponseBody(ep.successResponseSample);
    setPacketProgress(0);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    soundFX.playPunch();
    setPacketProgress(0);

    // Animate packet progress
    const interval = setInterval(() => {
      setPacketProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 45);

    setTimeout(() => {
      clearInterval(interval);
      setPacketProgress(100);

      // Validate payload if endpoint requires schema
      let parsedPayload: Record<string, unknown> = {};
      let isInvalid = false;
      let missingFields: string[] = [];

      try {
        parsedPayload = JSON.parse(payloadText || '{}');
      } catch {
        isInvalid = true;
      }

      if (selectedEndpoint.requestSchema?.required) {
        const required = selectedEndpoint.requestSchema.required as string[];
        for (const req of required) {
          if (!parsedPayload[req] || String(parsedPayload[req]).trim() === "") {
            isInvalid = true;
            missingFields.push(req);
          }
        }
      }

      if (isInvalid) {
        setResponseStatus(422);
        setResponseBody({
          detail: missingFields.length > 0 ? missingFields.map(f => ({
            loc: ["body", f],
            msg: "Field required",
            type: "missing"
          })) : [
            {
              loc: ["body"],
              msg: "Invalid JSON format syntax",
              type: "value_error.jsondecode"
            }
          ]
        });
      } else {
        setResponseStatus(200);
        setResponseBody(selectedEndpoint.successResponseSample);
      }

      setIsExecuting(false);
    }, 280);
  };

  const handleCopyJson = () => {
    soundFX.playTick();
    navigator.clipboard.writeText(JSON.stringify(responseBody, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="protocol-lab" className="py-24 px-4 md:px-8 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff4800] uppercase tracking-widest">
            <span>SECTION // 02</span>
            <span>&bull;</span>
            <span>OPENAPI 3.1 PROTOCOL SANDBOX</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
            LIVE REST PROTOCOL WORKBENCH
          </h2>
          <p className="text-white/60 font-mono text-xs md:text-sm max-w-2xl">
            Direct interactive playground executing against the exact OpenAPI 3.1 specification schemas. Test authentication, ticket mutations, and validation errors.
          </p>
        </div>

        {/* Protocol Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Endpoint Browser (4 Cols) */}
          <div className="lg:col-span-4 bg-[#0f1118] border border-white/10 rounded-xs p-5 space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFX.playTick();
                    setActiveCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-xs transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#ff4800] text-white font-bold'
                      : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Endpoints List */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 font-mono">
              {filteredEndpoints.map(ep => {
                const isSelected = ep.id === selectedEndpoint.id;
                const methodBg = 
                  ep.method === 'POST' ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' :
                  ep.method === 'GET' ? 'text-blue-400 bg-blue-500/15 border-blue-500/30' :
                  'text-amber-400 bg-amber-500/15 border-amber-500/30';

                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-xs border transition-all ${
                      isSelected
                        ? 'bg-[#151924] border-[#ff4800]/60 text-white shadow-[0_0_12px_rgba(255,72,0,0.1)]'
                        : 'bg-[#08090c] border-white/6 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded-xs border text-[9px] font-bold ${methodBg}`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-semibold truncate text-white">
                        {ep.summary}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 truncate">
                      {ep.path}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Interactive Request & Response Terminal (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0f1118] border border-white/10 rounded-xs p-6 space-y-6">
            
            {/* Active Endpoint Spec Banner */}
            <div className="space-y-2 border-b border-white/10 pb-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-xs border ${
                    selectedEndpoint.method === 'POST' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' :
                    selectedEndpoint.method === 'GET' ? 'text-blue-400 bg-blue-500/20 border-blue-500/40' :
                    'text-amber-400 bg-amber-500/20 border-amber-500/40'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  {selectedEndpoint.requiresAuth && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-[#ff4800]/15 border border-[#ff4800]/40 text-[#ff4800] rounded-xs font-bold">
                      <Key className="w-3 h-3" />
                      HTTP_BEARER
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 rounded-xs">
                    TAG: {selectedEndpoint.tag.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/60">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Request Composer */}
            {selectedEndpoint.method !== 'GET' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-white/50">
                  <span>REQUEST BODY SCHEMA &bull; {selectedEndpoint.requestSchemaName || "JSON"}</span>
                  <span className="text-white/30">application/json</span>
                </div>
                <textarea
                  rows={5}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/12 focus:border-[#ff4800] text-emerald-400 font-mono text-xs p-3 rounded-xs outline-none transition-colors"
                />
              </div>
            )}

            {/* Dispatch Action & Animated Transmission Line */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ff4800] hover:bg-[#e03f00] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase rounded-xs transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,72,0,0.25)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isExecuting ? "TRANSMITTING PACKET..." : "EXECUTE PROTOCOL CALL"}</span>
                </button>

                <div className="font-mono text-[11px] text-white/40 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SIMULATED LATENCY: 12ms</span>
                </div>
              </div>

              {/* Transmission Line Bus Progress */}
              <div className="w-full h-1 bg-[#08090c] rounded-full overflow-hidden border border-white/10 relative">
                <div 
                  className="h-full bg-[#ff4800] transition-all duration-150 ease-out shadow-[0_0_8px_#ff4800]"
                  style={{ width: `${packetProgress}%` }}
                />
              </div>
            </div>

            {/* Response Viewer Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-white/50">SERVER RESPONSE</span>
                  {responseStatus && (
                    <span className={`px-2 py-0.5 rounded-xs font-bold text-[10px] ${
                      responseStatus === 200 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {responseStatus === 200 ? "200 OK" : "422 UNPROCESSABLE_ENTITY"}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-white/40 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{copied ? "COPIED" : "COPY JSON"}</span>
                </button>
              </div>

              <div className="bg-[#08090c] border border-white/10 p-4 rounded-xs font-mono text-xs text-white/90 overflow-x-auto max-h-[220px]">
                <pre>{JSON.stringify(responseBody, null, 2)}</pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
