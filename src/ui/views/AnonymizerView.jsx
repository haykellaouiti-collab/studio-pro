import React, { useEffect, useRef, useState } from 'react';
import { runAnonymization } from '../../processors/anonymizerProcessor.js';
import {
  assertCanExport,
  enforcePlanConstraints,
  recordSuccessfulExport,
} from '../../core/subscriptionGuard.js';
import { ResourceTracker } from '../../utils/resourceManager.js';

export function AnonymizerView({ isPremium, logger, onProgress, onCommand }) {
  const [file, setFile] = useState(null);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [deepClean, setDeepClean] = useState(false);
  const [microCrop, setMicroCrop] = useState(false);
  const [audioShift, setAudioShift] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const trackerRef = useRef(new ResourceTracker());

  useEffect(() => {
    const tracker = trackerRef.current;
    return () => tracker.releaseAllUrls();
  }, []);

  const handleRun = async () => {
    setError('');
    try {
      assertCanExport(isPremium);
      enforcePlanConstraints(isPremium, { deepClean: deepClean || microCrop || audioShift });

      setProcessing(true);
      onProgress(0);
      logger.info(`Démarrage anonymisation : ${file.name}`);

      const output = await runAnonymization(
        file,
        { stripMetadata, deepClean, microCrop, audioShift },
        {
          onLog: (msg) => logger.info(msg),
          onProgress,
          onCommand,
        }
      );

      recordSuccessfulExport();
      const downloadUrl = trackerRef.current.trackUrl(output.blob);
      setResult({ ...output, downloadUrl });
      logger.info(`Traitement terminé en ${output.elapsedSec}s (${output.fileName})`);
    } catch (err) {
      setError(err.message || 'Échec du traitement.');
      logger.error(err.message || 'Erreur inconnue');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="panel">
      <h2>Anonymiseur &amp; Nettoyeur FFmpeg</h2>
      <p className="muted">
        Supprimez les métadonnées EXIF/XMP, conteneurs et empreintes numériques localement.
      </p>

      <div className="file-drop">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            setResult(null);
            setError('');
            setFile(e.target.files?.[0] || null);
          }}
        />
        {file && <div className="file-meta">Fichier prêt : <strong>{file.name}</strong> ({(file.size / 1048576).toFixed(2)} Mo)</div>}
      </div>

      <div className="options-grid">
        <label className="check-card">
          <input type="checkbox" checked={stripMetadata} onChange={(e) => setStripMetadata(e.target.checked)} />
          <span>Purge métadonnées &amp; chapitres (Rapide)</span>
        </label>
        <label className="check-card">
          <input type="checkbox" checked={deepClean} onChange={(e) => setDeepClean(e.target.checked)} />
          <span>Ré-encodage profond H.264/AAC {isPremium ? '' : '(Creator)'}</span>
        </label>
        <label className="check-card">
          <input type="checkbox" checked={microCrop} onChange={(e) => setMicroCrop(e.target.checked)} />
          <span>Micro-recadrage anti-empreinte (2%) {isPremium ? '' : '(Creator)'}</span>
        </label>
        <label className="check-card">
          <input type="checkbox" checked={audioShift} onChange={(e) => setAudioShift(e.target.checked)} />
          <span>Variation tempo audio (+2%) {isPremium ? '' : '(Creator)'}</span>
        </label>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button
        type="button"
        className="btn-primary"
        disabled={!file || processing}
        onClick={handleRun}
      >
        {processing ? 'Traitement FFmpeg en cours...' : 'Lancer le nettoyage'}
      </button>

      {result && (
        <div className="result-box">
          <div>
            <strong>Fichier prêt :</strong> {result.fileName} ({(result.finalSize / 1048576).toFixed(2)} Mo · {result.elapsedSec}s)
          </div>
          <a href={result.downloadUrl} download={result.fileName} className="btn-primary">
            Télécharger MP4
          </a>
        </div>
      )}
    </div>
  );
}
