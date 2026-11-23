import { describe, it, expect } from 'vitest';
import { validateVideoFile, extractSafeExtension, ensureEvenDimension } from '../src/utils/validators.js';

describe('Validateurs vidéo HAK IA', () => {
  it('valide un fichier MP4 non vide', () => {
    const file = { name: 'clip.mp4', type: 'video/mp4', size: 1024 * 500 };
    expect(validateVideoFile(file)).toBe(true);
  });

  it('rejette un fichier non vidéo ou vide', () => {
    expect(() => validateVideoFile({ name: 'doc.pdf', type: 'application/pdf', size: 500 })).toThrow();
    expect(() => validateVideoFile({ name: 'vide.mp4', type: 'video/mp4', size: 0 })).toThrow();
  });

  it('extrait une extension sûre et force des dimensions paires', () => {
    expect(extractSafeExtension('Archive.MOV')).toBe('.mov');
    expect(extractSafeExtension('sans_ext')).toBe('.mp4');
    expect(ensureEvenDimension(721)).toBe(720);
    expect(ensureEvenDimension(1080)).toBe(1080);
  });
});
