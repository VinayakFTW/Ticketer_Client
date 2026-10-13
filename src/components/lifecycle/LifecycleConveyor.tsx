import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../../audio/soundFX';
import { ArrowRight, Inbox, Network, UserCheck, ShieldAlert, Archive } from 'lucide-react';

interface LifecycleStage {
  step: string;
  title: string;
  endpoint: string;
  description: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
}

const STAGES: LifecycleStage[] = [
  {
    step: "01",
    title: "INGESTION & VALIDATION",
    endpoint: "POST /api/v1/client/tickets/create",
    description: "The client envelope arrives over TLS. The server decodes JSON, validates schema constraints via Pydantic/OpenAPI 3.1, and binds the request to the active Bearer token session.",
    icon: Inbox,
    specs: [
      { label: "AUTH_CHECK", value: "HTTPBearer Verified" },
      { label: "VALIDATION_OVERHEAD", value: "< 0.08 ms" },
      { label: "TENANT_HEADER", value: "Automatic Injection" }
    ]
  },
  {
    step: "02",
    title: "TENANT ISOLATION ROUTING",
    endpoint: "KERNEL_DISPATCH_LAYER",
    description: "The ticket is partitioned into its institutional namespace (e.g. MIT-CSAIL, Stanford-AI). Strict data boundaries prevent any cross-institutional leakage between organizations.",
    icon: Network,
    specs: [
      { label: "PARTITION_MODE", value: "Strict Tenant Key" },
      { label: "CROSS_TALK", value: "0.00% Tolerated" },
      { label: "CONCURRENCY", value: "Non-blocking Async" }
    ]
  },
  {
    step: "03",
    title: "STAFF TRIAGE & CLAIM",
    endpoint: "PUT /api/v1/staff/tickets/update/{id}",
    description: "Support staff monitor live priority queues. An authorized staff member claims the ticket, locking assigned_email and updating the state machine from OPEN to IN_PROGRESS.",
    icon: UserCheck,
    specs: [
      { label: "CLAIM_LATENCY", value: "Real-time Broadcast" },
      { label: "STATE_MORPH", value: "OPEN -> IN_PROGRESS" },
      { label: "LOCKING", value: "Optimistic Concurrency" }
    ]
  },
  {
    step: "04",
    title: "SLA BUMP ACCELERATION",
    endpoint: "PUT /api/v1/staff/tickets/update/{id}",
    description: "If an incident nears critical thresholds or escalates, staff invoke the bump trigger. The last_bump_time timestamp updates dynamically, bumping the queue weight and paging on-call operators.",
    icon: ShieldAlert,
    specs: [
      { label: "BUMP_METRIC", value: "last_bump_time ISO8601" },
      { label: "PRIORITY_BOOST", value: "+1 Triage Velocity" },
      { label: "SLA_AUDIT", value: "Persistent Log" }
    ]
  },
  {
    step: "05",
    title: "RESOLUTION & ARCHIVE",
    endpoint: "KERNEL_ARCHIVE_STORAGE",
    description: "The incident is verified resolved. A cryptographic tracking hash is finalized, the perforated tear-off status is stamped, and the record enters long-term immutable compliance storage.",
    icon: Archive,
    specs: [
      { label: "TERMINAL_STATE", value: "RESOLVED / CLOSED" },
      { label: "COMPLIANCE_HASH", value: "SHA-256 Checksum" },
      { label: "DATA_RETENTION", value: "Permanent Tenant Ledger" }
    ]
  }
];

export const LifecycleConveyor: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    soundFX.playTick();
    setActiveStep(index);
  };

  const currentStage = STAGES[activeStep];
  const IconComponent = currentStage.icon;

  return (
    <section id="lifecycle" className="py-24 px-4 md:px-8 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#ff4800] uppercase tracking-widest">
            <span>SECTION // 03</span>
            <span>&bull;</span>
            <span>KINETIC LIFECYCLE REEL</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white font-['Space_Grotesk']">
            THE ANATOMY OF A TICKET
          </h2>
          <p className="text-white/60 font-mono text-xs md:text-sm max-w-2xl">
            From initial client ingestion to high-priority SLA bumping and cryptographic resolution. Step through the deterministic state machine.
          </p>
        </div>

        {/* Step Progression Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
          {STAGES.map((s, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={s.step}
                onClick={() => handleStepClick(idx)}
                className={`p-4 rounded-xs border text-left transition-all ${
                  isActive 
                    ? 'bg-[#151924] border-[#ff4800] text-white shadow-[0_0_15px_rgba(255,72,0,0.2)]' 
                    : 'bg-[#0f1118] border-white/8 text-white/50 hover:border-white/20 hover:text-white/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold ${isActive ? 'text-[#ff4800]' : 'text-white/30'}`}>
                    PHASE {s.step}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4800]" />}
                </div>
                <div className="text-xs font-bold truncate">
                  {s.title.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Workbench */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#0f1118] border border-white/10 rounded-xs p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Column: Visual Icon & Stage Meta (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="w-16 h-16 rounded-xs bg-[#ff4800]/15 border border-[#ff4800]/40 flex items-center justify-center text-[#ff4800]">
              <IconComponent className="w-8 h-8" />
            </div>

            <div>
              <div className="font-mono text-[11px] text-[#ff4800] font-bold tracking-widest uppercase">
                PHASE // {currentStage.step}
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase text-white font-['Space_Grotesk'] mt-1">
                {currentStage.title}
              </h3>
            </div>

            <div className="font-mono text-xs text-white/50 bg-[#08090c] border border-white/8 px-3 py-1.5 rounded-xs inline-block">
              {currentStage.endpoint}
            </div>
          </div>

          {/* Right Column: Narrative & Technical Specifications (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-sans">
              {currentStage.description}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {currentStage.specs.map(spec => (
                <div key={spec.label} className="p-3 bg-[#08090c] border border-white/8 rounded-xs">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{spec.label}</div>
                  <div className="text-white font-semibold mt-1">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Next Step Button */}
            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => handleStepClick((activeStep + 1) % STAGES.length)}
                className="flex items-center gap-2 font-mono text-xs text-white/60 hover:text-white uppercase transition-colors"
              >
                <span>NEXT PHASE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff4800]" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
