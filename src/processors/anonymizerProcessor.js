import { fetchFile } from '@ffmpeg/util';
import { getFFmpegInstance } from './ffmpegEngine.js';
import { cleanupFFmpegFiles } from '../utils/resourceManager.js';

export function buildAnonymizerArgs(inputName, outputName, { deepClean = false, hasWatermark = false, watermarkName = 'wm.png' } = {}) {
  if (!deepClean && !hasWatermark) {
    return ['-i', inputName, '-map_metadata', '-1', '-map_chapters', '-1', '-c', 'copy', '-movflags', '+faststart', outputName];
  }
  const args = ['-i', inputName];
  if (hasWatermark) {
    args.push('-i', watermarkName, '-filter_complex', '[0:v]scale=trunc(iw/2)*2:trunc(ih/2)*2[base];[base][1:v]overlay=W-w-20:H-h-20');
  } else {
    args.push('-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2');
  }
  args.push('-map_metadata', '-1', '-map_chapters', '-1', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', outputName);
  return args;
}

export async function runAnonymizer(file, options) {
  const ffmpeg = await getFFmpegInstance(options.onProgress);
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';
  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const args = buildAnonymizerArgs(inputName, outputName, options);
    await ffmpeg.exec(args);
    const data = await ffmpeg.readFile(outputName);
    return new Blob([data.buffer], { type: 'video/mp4' });
  } finally {
    await cleanupFFmpegFiles(ffmpeg, [inputName, outputName, 'wm.png']);
  }
}
