import React, { useEffect, useMemo, useState } from 'react';
import { TopBar } from './ui/components/TopBar.jsx';
import { LogConsole } from './ui/components/LogConsole.jsx';
import { AuthModal } from './ui/components/AuthModal.jsx';
import { PricingView } from './ui/components/PricingView.jsx';
import { AnonymizerView } from './ui/views/AnonymizerView.jsx';
import { StudioSuiteView } from './ui/views/StudioSuiteView.jsx';
import {
  checkCreatorSubscription,
  getCurrentSession,
  signOutUser,
  supabase,
} from './core/authService.js';
import { createLogger } from './utils/logger.js';

export default function App() {
  const [activeTab, setActiveTab] = useState(() =>
    window.location.pathname === '/pricing' ? 'pricing' : 'anonymizer'
  );
  const [session, setSession] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [command, setCommand] = useState('');

  const logger = useMemo(
    () =>
      createLogger((entry) => {
        setLogs((prev) => [...prev.slice(-99), entry]);
      }),
    []
  );

  useEffect(() => {
    let mounted = true;
    const syncAuth = async (currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession?.user?.id) {
        const active = await checkCreatorSubscription(currentSession.user.id);
        if (mounted) setIsPremium(active);
      } else if (mounted) {
        setIsPremium(false);
      }
    };

    getCurrentSession().then(syncAuth);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncAuth(nextSession);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setSession(null);
    setIsPremium(false);
    logger.info('Session fermée.');
  };

  return (
    <div className="app-shell">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        session={session}
        isPremium={isPremium}
        onOpenAuth={() => setAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="main-wrap">
        {activeTab === 'anonymizer' && (
          <AnonymizerView
            isPremium={isPremium}
            logger={logger}
            onProgress={setProgress}
            onCommand={(cmd) => {
              setCommand(cmd);
              logger.cmd(cmd);
            }}
          />
        )}

        {activeTab === 'studio' && (
          <StudioSuiteView
            isPremium={isPremium}
            logger={logger}
            onProgress={setProgress}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingView
            session={session}
            isPremium={isPremium}
            onOpenAuth={() => setAuthOpen(true)}
          />
        )}

        <LogConsole logs={logs} progress={progress} command={command} />
      </main>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={(nextSession) => {
            setSession(nextSession);
            logger.info(`Connecté en tant que ${nextSession.user.email}`);
          }}
        />
      )}
    </div>
  );
}
