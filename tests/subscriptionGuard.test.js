import { describe, it, expect } from 'vitest';
import {
  assertCanExport,
  recordSuccessfulExport,
  enforcePlanConstraints,
} from '../src/core/subscriptionGuard.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

describe('Studio Pro — Quotas & Abonnements', () => {
  it('bloque le 2e export le même jour sur le plan Gratuit', () => {
    const storage = createMemoryStorage();
    expect(assertCanExport(false, storage)).toBe(true);
    recordSuccessfulExport(storage);
    expect(() => assertCanExport(false, storage)).toThrow(/Limite gratuite atteinte/);
  });

  it('autorise exports illimités, multi-clips et 1080p sans filigrane pour Creator', () => {
    const storage = createMemoryStorage();
    recordSuccessfulExport(storage);
    expect(assertCanExport(true, storage)).toBe(true);

    const rules = enforcePlanConstraints(true, {
      clipCount: 8,
      resolution: 1080,
      deepClean: true,
    });
    expect(rules).toEqual({ effectiveResolution: 1080, applyWatermark: false });
  });

  it('plafonne la résolution à 720p et active le filigrane en Gratuit', () => {
    const rules = enforcePlanConstraints(false, {
      clipCount: 2,
      resolution: 1080,
      deepClean: false,
    });
    expect(rules).toEqual({ effectiveResolution: 720, applyWatermark: true });
  });
});
