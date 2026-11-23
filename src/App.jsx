import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { usePlan } from './hooks/usePlan.js';
import { useQuota } from './hooks/useQuota.js';
import TopBar from './ui/components/TopBar.jsx';
import AuthModal from './ui/components/AuthModal.jsx';
import PricingView from './ui/components/PricingView.jsx';
import LogConsole from './ui/components/LogConsole.jsx';
import AnonymizerView from './ui/views/AnonymizerView.jsx';
import StudioSuiteView from './ui/views/StudioSuiteView.jsx';

export default function App() {
  const { user, signIn, signUp, signOut } = useAuth();
  const { isCreator } = usePlan(user);
  const { usedToday, reserveQuota } = useQuota(user, isCreator);
  const [route, setRoute] = useState('anonymiseur');
  const [authOpen, setAuthOpen] = useState(false);
  const [logs, setLogs] = useState([{ level: 'info', text: 'Studio Pro v1.0 initialisé.' }]);

  const addLog = (text, level = 'info') => {
    setLogs((prev) => [...prev.slice(-99), { level, text }]);
  };

  return (
    <div className="app-shell">
      <TopBar
        user={user}
        isCreator={isCreator}
        usedToday={usedToday}
        route={route}
        onNavigate={setRoute}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={signOut}
      />
      <main className="main-container">
        {route === 'anonymiseur' && (
          <AnonymizerView isCreator={isCreator} onReserveQuota={reserveQuota} onLog={addLog} />
        )}
        {route === 'studio' && (
          <StudioSuiteView isCreator={isCreator} onReserveQuota={reserveQuota} onLog={addLog} />
        )}
        {route === 'tarifs' && <PricingView user={user} isCreator={isCreator} />}
        <LogConsole logs={logs} onClear={() => setLogs([])} />
      </main>
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSignIn={signIn}
          onSignUp={signUp}
        />
      )}
    </div>
  );
}
