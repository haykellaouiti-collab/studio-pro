import { describe, it, expect } from 'vitest';
import { canUseResolution, canUseDeepClean, getMaxAllowedClips, shouldApplyWatermark } from '../../src/core/subscriptionGuard.js';

describe('subscriptionGuard', () => {
  it('bloque 1080p et deepClean pour Gratuit', () => {
    expect(canUseResolution('1080', false)).toBe(false);
    expect(canUseDeepClean(true, false)).toBe(false);
    expect(getMaxAllowedClips(false)).toBe(2);
    expect(shouldApplyWatermark(false)).toBe(true);
  });

  it('autorise tout sans watermark pour Creator', () => {
    expect(canUseResolution('1080', true)).toBe(true);
    expect(canUseDeepClean(true, true)).toBe(true);
    expect(getMaxAllowedClips(true)).toBe(10);
    expect(shouldApplyWatermark(true)).toBe(false);
  });
});
