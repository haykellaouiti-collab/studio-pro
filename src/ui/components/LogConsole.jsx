import React from 'react';

export function LogConsole({ logs, progress, command }) {
  return (
    <section className="panel console-panel">
      <div className="console-header">
        <span>Journal moteur (HAK IA Core)</span>
        <span>Progression : {progress}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      {command && <div className="cmd-preview">$ {command}</div>}
      <div className="log-box">
        {logs.length === 0 ? (
          <span className="muted">En attente d’une tâche de traitement local...</span>
        ) : (
          logs.slice(-40).map((entry, idx) => (
            <div key={idx} className={`log-line log-${entry.level}`}>
              {entry.formatted}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
