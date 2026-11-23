export function formatMegabytes(bytes) {
  if (!bytes || bytes <= 0) return '0.00 Mo';
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}
