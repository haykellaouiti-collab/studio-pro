import { describe, it, expect } from 'vitest';
import { buildAnonymizerArgs } from '../../src/processors/anonymizerProcessor.js';

describe('buildAnonymizerArgs', () => {
  it('utilise -c copy et purge les métadonnées en mode standard Creator', () => {
    const args = buildAnonymizerArgs('in.mp4', 'out.mp4', { deepClean: false, hasWatermark: false });
    expect(args).toContain('-map_metadata');
    expect(args).toContain('-1');
    expect(args).toContain('copy');
  });

  it('ré-encode en libx264 en mode deepClean', () => {
    const args = buildAnonymizerArgs('in.mp4', 'out.mp4', { deepClean: true, hasWatermark: false });
    expect(args).toContain('libx264');
  });
});
