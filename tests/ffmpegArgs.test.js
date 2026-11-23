import { describe, it, expect } from 'vitest';
import { buildAnonymizerCommand } from '../src/processors/anonymizerProcessor.js';

describe('Constructeur de commande FFmpeg HAK IA', () => {
  it('utilise stream copy lorsque seul le nettoyage de métadonnées est actif', () => {
    const args = buildAnonymizerCommand('in.mp4', 'out.mp4', {
      stripMetadata: true,
      deepClean: false,
      microCrop: false,
      audioShift: false,
    });
    expect(args).toContain('-map_metadata');
    expect(args).toContain('copy');
    expect(args).not.toContain('libx264');
  });

  it('active libx264, micro-crop et atempo en mode profond', () => {
    const args = buildAnonymizerCommand('in.mp4', 'out.mp4', {
      stripMetadata: true,
      deepClean: true,
      microCrop: true,
      audioShift: true,
    });
    expect(args).toContain('libx264');
    expect(args.join(' ')).toContain('crop=iw*0.98:ih*0.98');
    expect(args.join(' ')).toContain('atempo=1.02');
  });
});
