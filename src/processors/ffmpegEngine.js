import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let singleton = null;
let loadingPromise = null;

export function isCrossOriginIsolatedEnv() {
  return typeof SharedArrayBuffer !== 'undefined' && Boolean(globalThis.crossOriginIsolated);
}

export async function acquireFFmpeg({ onLog, onProgress } = {}) {
  if (singleton) return singleton;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const instance = new FFmpeg();

    instance.on('log', ({ message }) => onLog?.(message));
    instance.on('progress', ({ progress }) => {
      if (progress >= 0 && progress <= 1) {
        onProgress?.(Math.round(progress * 100));
      }
    });

    const isolated = isCrossOriginIsolatedEnv();
    const pkg = isolated ? '@ffmpeg/core-mt@0.12.6' : '@ffmpeg/core@0.12.6';
    const baseURL = `https://unpkg.com/${pkg}/dist/esm`;

    const config = {
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    };
    if (isolated) {
      config.workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');
    }

    await instance.load(config);
    singleton = instance;
    return singleton;
  })();

  try {
    return await loadingPromise;
  } catch (err) {
    singleton = null;
    loadingPromise = null;
    throw err;
  }
}
