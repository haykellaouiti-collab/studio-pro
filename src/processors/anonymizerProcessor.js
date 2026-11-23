import { fetchFile } from '@ffmpeg/util';
import { acquireFFmpeg } from './ffmpegEngine.js';
import { extractSafeExtension, validateVideoFile } from '../utils/validators.js';
import { ResourceTracker } from '../utils/resourceManager.js';

export function buildAnonymizerCommand(inputName, outputName, options = {}) {
  const {
    stripMetadata = true,
    deepClean = false,
    microCrop = false,
    audioShift = false,
    crf = 24,
  } = options;

  const needVideoReencode = Boolean(deepClean || microCrop);
  const needAudioReencode = Boolean(deepClean || audioShift);

  const args = ['-y', '-i', inputName];

  if (stripMetadata) {
    args.push('-map_metadata', '-1', '-map_chapters', '-1', '-fflags', '+bitexact');
  }

  if (needVideoReencode) {
    const vf = [];
    if (microCrop) {
      vf.push('crop=iw*0.98:ih*0.98,scale=trunc(iw/0.98/2)*2:trunc(ih/0.98/2)*2:flags=lanczos,setsar=1');
    }
    if (vf.length) args.push('-vf', vf.join(','));
    args.push('-c:v', 'libx264', '-crf', String(crf), '-preset', 'veryfast', '-pix_fmt', 'yuv420p');
  } else {
    args.push('-c:v', 'copy');
  }

  if (needAudioReencode) {
    const af = [];
    if (audioShift) af.push('atempo=1.02');
    if (af.length) args.push('-af', af.join(','));
    args.push('-c:a', 'aac', '-b:a', '128k');
  } else {
    args.push('-c:a', 'copy');
  }

  args.push('-movflags', '+faststart', outputName);
  return args;
}

export async function runAnonymization(file, options, callbacks = {}) {
  validateVideoFile(file);
  const tracker = new ResourceTracker();
  const startTime = performance.now();

  const ffmpeg = await acquireFFmpeg({
    onLog: callbacks.onLog,
    onProgress: callbacks.onProgress,
  });

  const ext = extractSafeExtension(file.name);
  const inputName = tracker.trackVirtualFile(`in_${Date.now()}${ext}`);
  const outputName = tracker.trackVirtualFile(`out_${Date.now()}.mp4`);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const args = buildAnonymizerCommand(inputName, outputName, options);
    callbacks.onCommand?.(`ffmpeg ${args.join(' ')}`);

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(1);

    return {
      blob,
      elapsedSec,
      originalSize: file.size,
      finalSize: blob.size,
      fileName: `studiopro_${file.name.replace(/\.[^/.]+$/, '') || 'video'}.mp4`,
    };
  } finally {
    await tracker.cleanupFFmpeg(ffmpeg);
  }
}
