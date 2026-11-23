import React from 'react';
import { APP_CONFIG } from '../../core/config.js';

export function TopBar({
  activeTab,
  onSelectTab,
  session,
  isPremium,
  onOpenAuth,
  onSignOut,
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-badge">SP</div>
        <div>
          <div className="brand-title">{APP_CONFIG.appName}</div>
          <div className="brand-sub">HAK IA · Local Video &amp; Audio Engine</div>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Modules Studio Pro">
        <button
          type="button"
          className={`nav-btn ${activeTab === 'anonymizer' ? 'active' : ''}`}
          onClick={() => onSelectTab('anonymizer')}
        >
          Anonymiseur FFmpeg
        </button>
        <button
          type="button"
          className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => onSelectTab('studio')}
        >
          Studio Multi-Clips
        </button>
        <button
          type="button"
          className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => onSelectTab('pricing')}
        >
          Abonnement {isPremium ? '★' : 'Pro'}
        </button>
      </nav>

      <div className="auth-zone">
        <span className={`plan-pill ${isPremium ? 'creator' : 'free'}`}>
          {isPremium ? 'Plan Creator' : 'Plan Gratuit'}
        </span>
        {session ? (
          <>
            <span className="user-email">{session.user.email}</span>
            <button type="button" className="btn-ghost" onClick={onSignOut}>
              Déconnexion
            </button>
          </>
        ) : (
          <button type="button" className="btn-primary" onClick={onOpenAuth}>
            Connexion / Compte
          </button>
        )}
      </div>
    </header>
  );
}
