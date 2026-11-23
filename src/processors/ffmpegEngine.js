import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let instance = null;

export async function getFFmpegInstance(onProgress) {
  if (instance) {
    if (onProgress) instance.on('progress', ({ progress }) => onProgress(Math.round((progress || 0) * 100)));
    return instance;
  }
  const ffmpeg = new FFmpeg();
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => onProgress(Math.round((progress || 0) * 100)));
  }
  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
  });
  instance = ffmpeg;
  return ffmpeg;
}
