import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../../core/authService.js';

export function AuthModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const session = await signInWithEmail(email, password);
        onAuthenticated(session);
        onClose();
      } else {
        await signUpWithEmail(email, password);
        setError('Compte créé. Vérifiez votre boîte mail ou connectez-vous.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Erreur d’authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>{mode === 'login' ? 'Connexion à Studio Pro' : 'Créer un compte Studio Pro'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Adresse e-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="error-banner">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S’inscrire'}
            </button>
          </div>
        </form>
        <button
          type="button"
          className="link-switch"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? 'Pas encore de compte ? Créer un accès'
            : 'Déjà inscrit ? Se connecter'}
        </button>
      </div>
    </div>
  );
}
