import React from 'react';
export default function LogConsole({ logs, onClear }) {
  return (
    <section>
      <button onClick={onClear}>Effacer logs</button>
      <pre>{logs.map((l, i) => `[${l.level}] ${l.text}`).join('\n')}</pre>
    </section>
  );
}
