export function getOutputDimensions(ratio = '16:9', resolution = '720') {
  const is1080 = String(resolution) === '1080';
  if (ratio === '9:16') {
    return is1080 ? { width: 1080, height: 1920 } : { width: 720, height: 1280 };
  }
  return is1080 ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
}
