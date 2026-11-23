import React, { useEffect, useRef, useState } from 'react';
import { renderMergedClips } from '../../processors/studioMixerProcessor.js';
import {
  assertCanExport,
  enforcePlanConstraints,
  recordSuccessfulExport,
} from '../../core/subscriptionGuard.js';
import { ResourceTracker } from '../../utils/resourceManager.js';

export function StudioSuiteView({ isPremium, logger, onProgress }) {
  const [clips, setClips] = useState([]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState(isPremium ? 1080 : 720);
  const [rendering, setRendering] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  const trackerRef = useRef(new ResourceTracker());

  useEffect(() => {
    const tracker = trackerRef.current;
    return () => tracker.releaseAllUrls();
  }, []);

  const handleAddFiles = (e) => {
    const selected = Array.from(e.target.files || []).map((file) => ({
      id: `${file.name}_${Date.now()}_${Math.random()}`,
      file,
      volume: 1,
    }));
    setClips((prev) => [...prev, ...selected]);
  };

  const handleMerge = async () => {
    setError('');
    try {
      assertCanExport(isPremium);
      const { effectiveResolution, applyWatermark } = enforcePlanConstraints(isPremium, {
        clipCount: clips.length,
        resolution,
      });

      setRendering(true);
      onProgress(0);
      logger.info(`Assemblage de ${clips.length} clip(s) en ${effectiveResolution}p (${aspectRatio})`);

      const res = await renderMergedClips(
        clips,
        {
          aspectRatio,
          maxResolution: effectiveResolution,
          applyWatermark,
        },
        onProgress
      );

      recordSuccessfulExport();
      const downloadUrl = trackerRef.current.trackUrl(res.blob);
      setOutput({ ...res, downloadUrl });
      logger.info(`Assemblage terminé : ${res.fileName} (${res.width}x${res.height})`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la fusion.');
      logger.error(err.message || 'Erreur studio');
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="panel">
      <h2>Studio Multi-Clips &amp; Export</h2>
      <p className="muted">
        Assemblez plusieurs séquences vidéo avec contrôle du format et export direct.
      </p>

      <div className="controls-row">
        <label>
          Format d’image
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
            <option value="16:9">16:9 Paysage (YouTube)</option>
            <option value="9:16">9:16 Vertical (Shorts / Reels)</option>
          </select>
        </label>
        <label>
          Résolution cible
          <select value={resolution} onChange={(e) => setResolution(Number(e.target.value))}>
            <option value={720}>720p HD</option>
            <option value={1080} disabled={!isPremium}>
              1080p Full HD {isPremium ? '' : '(Creator)'}
            </option>
          </select>
        </label>
      </div>

      <div className="file-drop">
        <input type="file" accept="video/*" multiple onChange={handleAddFiles} />
      </div>

      {clips.length > 0 && (
        <ul className="clip-list">
          {clips.map((clip, idx) => (
            <li key={clip.id}>
              <span>
                #{idx + 1} · {clip.file.name} ({(clip.file.size / 1048576).toFixed(1)} Mo)
              </span>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setClips((prev) => prev.filter((c) => c.id !== clip.id))}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error-banner">{error}</div>}

      <button
        type="button"
        className="btn-primary"
        disabled={clips.length === 0 || rendering}
        onClick={handleMerge}
      >
        {rendering ? 'Rendu en cours...' : `Assembler (${clips.length} clip${clips.length > 1 ? 's' : ''})`}
      </button>

      {output && (
        <div className="result-box">
          <div>
            <strong>Montage prêt :</strong> {output.fileName} ({output.width}x{output.height})
          </div>
          <a href={output.downloadUrl} download={output.fileName} className="btn-primary">
            Télécharger le montage
          </a>
        </div>
      )}
    </div>
  );
}
