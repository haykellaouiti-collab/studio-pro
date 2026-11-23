import React from 'react';
import { APP_CONFIG } from '../../core/config.js';
import { buildDodoCheckoutUrl } from '../../core/authService.js';

export function PricingView({ session, isPremium, onOpenAuth }) {
  const checkoutUrl = session
    ? buildDodoCheckoutUrl(session.user, `${window.location.origin}/pricing`)
    : '#';

  const handleCheckout = (e) => {
    if (!session) {
      e.preventDefault();
      onOpenAuth();
    }
  };

  return (
    <div className="pricing-wrap">
      <div className="pricing-head">
        <h2>Abonnements {APP_CONFIG.appName}</h2>
        <p>Traitement 100 % local dans votre navigateur. Débloquez la puissance Creator.</p>
      </div>

      <div className="pricing-grid">
        <div className="price-card">
          <h3>Gratuit</h3>
          <div className="price-tag">0 $ <span>/ mois</span></div>
          <ul>
            <li>Assemblage limité (2 clips max)</li>
            <li>Export plafonné à 720p</li>
            <li>1 export par jour</li>
            <li>Purge métadonnées standard</li>
            <li className="disabled">Exports 1080p sans filigrane</li>
            <li className="disabled">Anonymisation profonde (ré-encodage)</li>
          </ul>
          <div className="plan-status-note">
            {!isPremium ? 'Votre plan actuel' : 'Plan de base'}
          </div>
        </div>

        <div className="price-card featured">
          <div className="badge-rec">Recommandé</div>
          <h3>Creator</h3>
          <div className="price-tag">10 $ <span>/ mois</span></div>
          <ul>
            <li>Assemblage multi-clips illimité</li>
            <li>Export haute définition jusqu’à 1080p</li>
            <li>Exports quotidiens illimités</li>
            <li>Aucun filigrane</li>
            <li>Anonymisation profonde (H.264, micro-crop, tempo)</li>
            <li>Activation automatique via Supabase + Dodo Payments</li>
          </ul>
          {isPremium ? (
            <div className="plan-status-note active">Abonnement Creator actif</div>
          ) : (
            <a
              href={checkoutUrl}
              target={session ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="btn-primary full"
              onClick={handleCheckout}
            >
              {session ? 'Passer à Creator — 10 $/mois' : 'Se connecter pour s’abonner'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
