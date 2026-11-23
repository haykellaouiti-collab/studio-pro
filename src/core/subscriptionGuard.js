import { APP_CONFIG } from './config.js';

const STORAGE_DATE_KEY = 'studiopro_export_date';
const STORAGE_COUNT_KEY = 'studiopro_export_count';

export function getPlanLimits(isPremium) {
  return isPremium ? APP_CONFIG.plans.creator : APP_CONFIG.plans.free;
}

export function getTodayExportsCount(storage = localStorage) {
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = storage.getItem(STORAGE_DATE_KEY);
  return lastDate === today ? parseInt(storage.getItem(STORAGE_COUNT_KEY) || '0', 10) : 0;
}

export function assertCanExport(isPremium, storage = localStorage) {
  const limits = getPlanLimits(isPremium);
  if (limits.maxExportsPerDay === Infinity) return true;

  const count = getTodayExportsCount(storage);
  if (count >= limits.maxExportsPerDay) {
    throw new Error(
      'Limite gratuite atteinte (1 export/jour). Passez au plan Creator (10 $/mois) pour des exports illimités.'
    );
  }
  return true;
}

export function recordSuccessfulExport(storage = localStorage) {
  const today = new Date().toISOString().slice(0, 10);
  const count = getTodayExportsCount(storage);
  storage.setItem(STORAGE_DATE_KEY, today);
  storage.setItem(STORAGE_COUNT_KEY, String(count + 1));
}

export function enforcePlanConstraints(isPremium, request = {}) {
  const limits = getPlanLimits(isPremium);

  if (typeof request.clipCount === 'number' && request.clipCount > limits.maxClips) {
    throw new Error(
      `Le plan Gratuit est limité à ${limits.maxClips} vidéos en assemblage. Passez à Creator pour fusionner sans limite.`
    );
  }

  if (request.deepClean && !limits.allowDeepAnonymization) {
    throw new Error(
      'L’anonymisation profonde (ré-encodage H.264/AAC) est réservée aux abonnés Creator.'
    );
  }

  return {
    effectiveResolution: Math.min(request.resolution || 720, limits.maxResolution),
    applyWatermark: limits.watermark,
  };
}
