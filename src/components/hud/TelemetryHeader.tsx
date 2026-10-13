import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Cpu, FileCode2 } from 'lucide-react';
import { soundFX } from '../../audio/soundFX';

export const TelemetryHeader: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(soundFX.enabled);
  const [tickerCount, setTickerCount] = useState(14820);
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subtle realistic random increment in queue throughput counter
    const interval = setInterval(() => {
      setTickerCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const newState = soundFX.toggle();
    setAudioEnabled(newState);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08090c]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & System Vitals */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-xs bg-[#ff4800] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tighter shadow-[0_0_12px_rgba(255,72,0,0.4)] group-hover:scale-105 transition-transform">
              TK
            </div>
            <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">
              TICKETER
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-white/40 border border-white/15 px-1.5 py-0.5 rounded-xs">
              v0.1.0
            </span>
          </a>

          {/* Real-time Telemetry pill */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono border-l border-white/10 pl-6 text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white/80">CORE_UP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-white/40" />
              <span>DISPATCH_LATENCY: <strong className="text-white">0.38ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>INGEST_RATE: <strong className="text-white">{tickerCount.toLocaleString()}</strong> tk/hr</span>
            </div>
            <div className="text-white/40">
              [{timeUtc}]
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <nav className="hidden md:flex items-center gap-6 text-white/70">
            <a 
              href="#simulator" 
              onClick={() => soundFX.playTick()}
              className="hover:text-[#ff4800] transition-colors flex items-center gap-1"
            >
              <span>01.</span> SIMULATOR
            </a>
            <a 
              href="#protocol-lab" 
              onClick={() => soundFX.playTick()}
              className="hover:text-[#ff4800] transition-colors flex items-center gap-1"
            >
              <span>02.</span> OPENAPI_LAB
            </a>
            <a 
              href="#lifecycle" 
              onClick={() => soundFX.playTick()}
              className="hover:text-[#ff4800] transition-colors flex items-center gap-1"
            >
              <span>03.</span> LIFECYCLE
            </a>
            <a 
              href="#architecture" 
              onClick={() => soundFX.playTick()}
              className="hover:text-[#ff4800] transition-colors flex items-center gap-1"
            >
              <span>04.</span> SPECS
            </a>
          </nav>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={audioEnabled ? "Tactile Audio Active" : "Tactile Audio Muted"}
              className={`p-1.5 rounded-xs border transition-all ${
                audioEnabled 
                  ? 'border-[#ff4800] bg-[#ff4800]/15 text-[#ff4800]' 
                  : 'border-white/15 bg-white/5 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Raw OpenAPI Link */}
            <a
              href="#protocol-lab"
              onClick={() => soundFX.playTick()}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white/80 rounded-xs text-[11px] transition-all"
            >
              <FileCode2 className="w-3 h-3 text-[#ff4800]" />
              <span>SCHEMA_3.1</span>
            </a>
          </div>
        </div>

      </div>
    </header>
  );
};
