import { CONFIG } from './config.js';

export function canUseResolution(resolution, isCreator) {
  if (String(resolution) === '1080') return Boolean(isCreator);
  return true;
}

export function canUseDeepClean(deepClean, isCreator) {
  if (deepClean) return Boolean(isCreator);
  return true;
}

export function getMaxAllowedClips(isCreator) {
  return isCreator ? CONFIG.CREATOR_MAX_CLIPS : CONFIG.FREE_MAX_CLIPS;
}

export function shouldApplyWatermark(isCreator) {
  return !Boolean(isCreator);
}
