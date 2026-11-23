const ALLOWED_VIDEO_EXT = /\.(mp4|mov|webm|mkv|avi|m4v)$/i;

export function validateVideoFile(file, maxBytes = 1024 * 1024 * 1024) {
  if (!file) throw new Error('Aucun fichier sélectionné.');
  const isVideoMime = typeof file.type === 'string' && file.type.startsWith('video/');
  if (!isVideoMime && !ALLOWED_VIDEO_EXT.test(file.name || '')) {
    throw new Error(`Format non supporté : ${file.name || 'inconnu'}`);
  }
  if (file.size === 0) throw new Error('Le fichier vidéo est vide.');
  if (file.size > maxBytes) {
    throw new Error(`Fichier trop volumineux (${(file.size / 1048576).toFixed(0)} Mo).`);
  }
  return true;
}

export function extractSafeExtension(filename = 'video.mp4') {
  const match = String(filename).toLowerCase().match(ALLOWED_VIDEO_EXT);
  return match ? match[0] : '.mp4';
}

export function ensureEvenDimension(val) {
  const n = Math.round(Number(val) || 0);
  return n % 2 === 0 ? n : n - 1;
}
