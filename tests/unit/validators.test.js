import { describe, it, expect } from 'vitest';
import { validateVideoFile } from '../../src/utils/validators.js';

describe('validateVideoFile', () => {
  it('rejette un fichier > 500 Mo', () => {
    const bigFile = { name: 'video.mp4', type: 'video/mp4', size: 600 * 1024 * 1024 };
    expect(validateVideoFile(bigFile)).toBeTruthy();
  });
  it('accepte un mp4 valide', () => {
    const okFile = { name: 'clip.mp4', type: 'video/mp4', size: 10 * 1024 * 1024 };
    expect(validateVideoFile(okFile)).toBeNull();
  });
});
