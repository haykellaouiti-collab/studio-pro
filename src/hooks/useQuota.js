import { useState } from 'react';
import { invokeExportGate } from '../core/quotaService.js';

export function useQuota(user, isCreator) {
  const [usedToday, setUsedToday] = useState(0);

  const reserveQuota = async () => {
    if (!user) throw new Error('Connexion requise.');
    if (isCreator) return true;
    const res = await invokeExportGate();
    if (!res?.allowed) throw new Error('Quota quotidien atteint (1 export/jour en Gratuit).');
    setUsedToday(res.used ?? 1);
    return true;
  };

  return { usedToday, reserveQuota };
}
