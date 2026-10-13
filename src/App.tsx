import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const SubscribePage = lazy(() => import('./pages/SubscribePage'));
const AppShell = lazy(() => import('./pages/app/AppShell'));

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center font-mono text-xs">
    <div className="flex items-center gap-3 p-4 bg-[#0e1017] border border-white/10 rounded-xs">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff4800] animate-ping" />
      <span className="tracking-widest uppercase text-white/80">INITIALIZING DISPATCH CONSOLE...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/app" element={<AppShell />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
