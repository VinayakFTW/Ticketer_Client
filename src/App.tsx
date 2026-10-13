import React from 'react';
import { HairlineGrid } from './components/common/HairlineGrid';
import { TelemetryHeader } from './components/hud/TelemetryHeader';
import { HeroSection } from './components/hero/HeroSection';
import { RoleSimulator } from './components/simulator/RoleSimulator';
import { OpenApiSandbox } from './components/sandbox/OpenApiSandbox';
import { LifecycleConveyor } from './components/lifecycle/LifecycleConveyor';
import { ArchitectureBento } from './components/specs/ArchitectureBento';
import { TechnicalFooter } from './components/footer/TechnicalFooter';

export const App: React.FC = () => {
  return (
    <HairlineGrid className="min-h-screen bg-[#08090c] text-[#f4f5f7] selection:bg-[#ff4800] selection:text-white">
      {/* Fixed Telemetry HUD Header */}
      <TelemetryHeader />

      <main className="relative z-10 space-y-0">
        {/* Hero Section with Asymmetric Scale Contrast & 3D Shuffler */}
        <HeroSection />

        {/* 3-Role Interactive Orchestrator (Client / Staff / Admin) */}
        <RoleSimulator />

        {/* OpenAPI 3.1 Live Protocol Sandbox & Request Dispatcher */}
        <OpenApiSandbox />

        {/* Kinetic 5-Stage Lifecycle Conveyor */}
        <LifecycleConveyor />

        {/* Swiss Pixel-Gap Architectural Specifications Bento */}
        <ArchitectureBento />
      </main>

      {/* Production Technical Footer */}
      <TechnicalFooter />
    </HairlineGrid>
  );
};

export default App;
