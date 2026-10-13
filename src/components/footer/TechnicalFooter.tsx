import React from 'react';
import { Download, ArrowUp } from 'lucide-react';
import { soundFX } from '../../audio/soundFX';

export const TechnicalFooter: React.FC = () => {
  const scrollToTop = () => {
    soundFX.playTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadSpec = () => {
    soundFX.playTick();
    // Trigger download of openapi.json
    const link = document.createElement('a');
    link.href = '/openapi.json';
    link.download = 'ticketer-openapi-3.1.0.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-[#050609] border-t border-white/10 px-4 md:px-8 py-16 font-mono text-xs text-white/50 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Manifesto (6 Cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#ff4800] rounded-xs flex items-center justify-center text-white font-bold text-[10px]">
                TK
              </div>
              <span className="text-white font-bold uppercase tracking-widest text-sm">
                TICKETER
              </span>
              <span className="text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-xs">
                v0.1.0
              </span>
            </div>

            <p className="text-white/60 font-sans text-xs max-w-md leading-relaxed">
              Deterministic institutional ticket dispatch engine and high-throughput triage protocol. Pure frontend interface demonstrating OpenAPI 3.1 contract compliance.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDownloadSpec}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white rounded-xs text-[11px] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#ff4800]" />
                <span>DOWNLOAD OPENAPI.JSON</span>
              </button>

              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white/70 hover:text-white rounded-xs text-[11px] transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>RETURN TO TOP</span>
              </button>
            </div>
          </div>

          {/* Endpoints & Direct Links (3 Cols) */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white/80 font-bold uppercase tracking-wider text-[11px] mb-3">
              CONTRACT APIS
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#protocol-lab" className="hover:text-[#ff4800] transition-colors">/api/v1/auth/signup</a></li>
              <li><a href="#protocol-lab" className="hover:text-[#ff4800] transition-colors">/api/v1/auth/signin</a></li>
              <li><a href="#protocol-lab" className="hover:text-[#ff4800] transition-colors">/api/v1/client/tickets/create</a></li>
              <li><a href="#protocol-lab" className="hover:text-[#ff4800] transition-colors">/api/v1/staff/tickets/update</a></li>
              <li><a href="#protocol-lab" className="hover:text-[#ff4800] transition-colors">/api/v1/admin/tickets/all</a></li>
            </ul>
          </div>

          {/* System Guarantees (3 Cols) */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white/80 font-bold uppercase tracking-wider text-[11px] mb-3">
              STANDARDS
            </div>
            <ul className="space-y-1.5 text-[11px] text-white/50">
              <li>OpenAPI Spec 3.1.0</li>
              <li>HTTPBearer Auth Scheme</li>
              <li>Pydantic Schema Validation</li>
              <li>Strict Zero-Emoji Guarantee</li>
              <li>Sub-Millisecond Triage</li>
            </ul>
          </div>

        </div>

        {/* Bottom Hash Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] text-white/30">
          <div>
            CHECKSUM: 0x9B42A7C &bull; SPEC_HASH: OPENAPI_3_1_0_TICKETER
          </div>
          <div>
            TICKETER ENGINE &bull; ALL RIGHTS RESERVED &bull; NO LIVE BACKEND CONNECTION
          </div>
        </div>

      </div>
    </footer>
  );
};
