import { describe, it, expect } from 'vitest';
import { formatMegabytes } from '../../src/utils/fileSize.js';

describe('formatMegabytes', () => {
  it('formate correctement les octets en Mo', () => {
    expect(formatMegabytes(5 * 1024 * 1024)).toBe('5.00 Mo');
  });
});
