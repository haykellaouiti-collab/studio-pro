import React, { useState } from 'react';
import FileDrop from '../components/FileDrop.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { validateVideoFile } from '../../utils/validators.js';
import { runAnonymizer } from '../../processors/anonymizerProcessor.js';

export default function AnonymizerView({ isCreator, onReserveQuota, onLog }) {
  const [file, setFile] = useState(null);
  const [deepClean, setDeepClean] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    const err = validateVideoFile(file);
    if (err) return setError(err);
    try {
      await onReserveQuota();
      const blob = await runAnonymizer(file, { deepClean: deepClean && isCreator, hasWatermark: !isCreator });
      onLog('Export anonymisé prêt.', 'ok');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `anonymise_${file.name}`;
      a.click();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Anonymiseur</h2>
      <FileDrop onFiles={(files) => setFile(files[0])} />
      <label><input type="checkbox" disabled={!isCreator} checked={deepClean} onChange={(e) => setDeepClean(e.target.checked)} /> Mode profond (Creator)</label>
      <ErrorBanner message={error} />
      <button onClick={handleRun}>Anonymiser</button>
    </section>
  );
}
