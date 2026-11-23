import React, { useState } from 'react';
import FileDrop from '../components/FileDrop.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { getMaxAllowedClips } from '../../core/subscriptionGuard.js';

export default function StudioSuiteView({ isCreator }) {
  const [clips, setClips] = useState([]);
  const [error, setError] = useState('');

  const handleFiles = (incoming) => {
    if (incoming.length > getMaxAllowedClips(isCreator)) {
      return setError('Limite de clips atteinte pour votre plan.');
    }
    setError('');
    setClips(incoming);
  };

  return (
    <section>
      <h2>Studio Multi-Clips</h2>
      <FileDrop multiple onFiles={handleFiles} />
      <ErrorBanner message={error} />
      <p>{clips.length} clip(s) sélectionné(s).</p>
    </section>
  );
}
