import { useState } from 'react';

export function useProcessor() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  return { busy, setBusy, progress, setProgress };
}
