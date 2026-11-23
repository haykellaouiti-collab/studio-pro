import React from 'react';
import PlanPill from './PlanPill.jsx';
import QuotaBadge from './QuotaBadge.jsx';

export default function TopBar({ user, isCreator, usedToday, route, onNavigate, onOpenAuth, onLogout }) {
  return (
    <header>
      <strong>Studio Pro — HAK IA</strong>
      <nav>
        <button onClick={() => onNavigate('anonymiseur')}>Anonymiseur</button>
        <button onClick={() => onNavigate('studio')}>Studio Multi-Clips</button>
        <button onClick={() => onNavigate('tarifs')}>Tarifs</button>
      </nav>
      <div>
        <QuotaBadge isCreator={isCreator} usedToday={usedToday} />
        <PlanPill isCreator={isCreator} />
        {user ? <button onClick={onLogout}>Déconnexion ({user.email})</button> : <button onClick={onOpenAuth}>Connexion</button>}
      </div>
    </header>
  );
}
