import { CONFIG } from '../core/config.js';

export function validateVideoFile(file) {
  if (!file) return 'Aucun fichier sélectionné.';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext) && !(file.type || '').startsWith('video/')) {
    return 'Format non pris en charge (MP4, MOV, WEBM, MKV uniquement).';
  }
  if (file.size > CONFIG.MAX_FILE_BYTES) {
    return 'Taille maximale dépassée (500 Mo maximum).';
  }
  return null;
}
