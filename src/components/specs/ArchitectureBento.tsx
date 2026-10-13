import React from 'react';
import { Shield, Key, Zap, Database, Lock } from 'lucide-react';

export const ArchitectureBento: React.FC = () => {
  return (
    <section id="architecture" className="py-24 px-4 md:px-8 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff4800] uppercase tracking-widest">
            <span>SECTION // 04</span>
            <span>&bull;</span>
            <span>SYSTEM SPECIFICATIONS & GUARANTEES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
            ARCHITECTURAL BLUEPRINT
          </h2>
          <p className="text-white/60 font-mono text-xs md:text-sm max-w-2xl">
            Engineered for institutional environments where packet integrity, multi-tenant boundaries, and strict schema validation are mission critical.
          </p>
        </div>

        {/* Pixel-Gap Bento Grid (Archetype l-01) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-white/10 border border-white/10 rounded-sm overflow-hidden font-mono">
          
          {/* Bento Cell 1: Tenant Isolation (7 Cols) */}
          <div className="md:col-span-7 bg-[#0b0d13] p-8 space-y-4 hover:bg-[#0e111a] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff4800]">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">TENANT ISOLATION ARCHITECTURE</span>
              </div>
              <span className="text-[10px] text-white/30">ZERO_LEAKAGE</span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              CRYPTOGRAPHIC DATA PARTITIONING
            </h3>

            <p className="text-white/70 text-xs leading-relaxed font-sans font-normal">
              Every request payload carries institutional tenant tokens. Database queries strictly enforce tenant row-level partitioning, ensuring research lab incidents, faculty tickets, and enterprise infrastructure logs are fully quarantined.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="bg-[#06070a] p-3 rounded-xs border border-white/6">
                <div className="text-white/40 text-[9px] uppercase">TENANT KEY</div>
                <div className="text-white font-bold mt-0.5">INSTITUTE_BOUND</div>
              </div>
              <div className="bg-[#06070a] p-3 rounded-xs border border-white/6">
                <div className="text-white/40 text-[9px] uppercase">CROSS-TALK</div>
                <div className="text-emerald-400 font-bold mt-0.5">0.00% TOLERATED</div>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: Token Rotation & Auth (5 Cols) */}
          <div className="md:col-span-5 bg-[#0b0d13] p-8 space-y-4 hover:bg-[#0e111a] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <Key className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">AUTH CYCLE</span>
              </div>
              <span className="text-[10px] text-white/30">RFC_6749</span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              BEARER + REFRESH TOKEN ROTATION
            </h3>

            <p className="text-white/70 text-xs leading-relaxed font-sans font-normal">
              Stateless JWT Bearer authentication paired with one-time use cryptographic refresh tokens (<code className="text-cyan-300">/api/v1/auth/refresh</code>) to maintain continuous operations without credential exposure.
            </p>

            <div className="bg-[#06070a] p-3 rounded-xs border border-white/6 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-white/60">
                <span>BEARER TTL:</span>
                <span className="text-white font-bold">3600 SECONDS</span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                <span>REVOCATION BUS:</span>
                <span className="text-emerald-400 font-bold">SUB-MILLISECOND</span>
              </div>
            </div>
          </div>

          {/* Bento Cell 3: Performance Envelope (4 Cols) */}
          <div className="md:col-span-4 bg-[#0b0d13] p-8 space-y-4 hover:bg-[#0e111a] transition-colors">
            <div className="flex items-center justify-between text-amber-400">
              <Zap className="w-5 h-5" />
              <span className="text-[10px] text-white/30">BENCHMARK</span>
            </div>

            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              &lt; 0.4 ms
            </div>
            <div className="text-xs font-bold text-amber-400 uppercase">DISPATCH OVERHEAD</div>

            <p className="text-white/60 text-xs leading-relaxed font-sans font-normal">
              In-memory non-blocking triage loop routes up to 100,000 incident events per second with zero garbage collector pauses.
            </p>
          </div>

          {/* Bento Cell 4: Strict Schema Contracts (4 Cols) */}
          <div className="md:col-span-4 bg-[#0b0d13] p-8 space-y-4 hover:bg-[#0e111a] transition-colors">
            <div className="flex items-center justify-between text-emerald-400">
              <Database className="w-5 h-5" />
              <span className="text-[10px] text-white/30">OPENAPI 3.1</span>
            </div>

            <div className="text-3xl font-bold text-white font-['Space_Grotesk']">
              100%
            </div>
            <div className="text-xs font-bold text-emerald-400 uppercase">TYPED SCHEMA CONFORMANCE</div>

            <p className="text-white/60 text-xs leading-relaxed font-sans font-normal">
              Every request body, response envelope, and HTTP 422 validation structure is strictly derived from the OpenAPI specification contracts.
            </p>
          </div>

          {/* Bento Cell 5: Strict Design Contract (4 Cols) */}
          <div className="md:col-span-4 bg-[#0b0d13] p-8 space-y-4 hover:bg-[#0e111a] transition-colors">
            <div className="flex items-center justify-between text-[#ff4800]">
              <Lock className="w-5 h-5" />
              <span className="text-[10px] text-white/30">DESIGN_INTEGRITY</span>
            </div>

            <div className="text-3xl font-bold text-[#ff4800] font-['Space_Grotesk']">
              ZERO EMOJI
            </div>
            <div className="text-xs font-bold text-white uppercase">PRECISION VECTOR DESIGN</div>

            <p className="text-white/60 text-xs leading-relaxed font-sans font-normal">
              Clean Swiss typography, high scale jump, vector telemetry, and zero cartoonish decorative fluff.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
