import { describe, it, expect } from 'vitest';
import { getOutputDimensions } from '../../src/processors/studioMixerProcessor.js';

describe('getOutputDimensions', () => {
  it('retourne 1280x720 pour 16:9 720p', () => {
    expect(getOutputDimensions('16:9', '720')).toEqual({ width: 1280, height: 720 });
  });
  it('retourne 1080x1920 pour 9:16 1080p', () => {
    expect(getOutputDimensions('9:16', '1080')).toEqual({ width: 1080, height: 1920 });
  });
});
