import React, { useState } from 'react';
export default function AuthModal({ onClose, onSignIn, onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button onClick={() => onSignIn(email, password).then(onClose)}>Connexion</button>
      <button onClick={() => onSignUp(email, password)}>Inscription</button>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
