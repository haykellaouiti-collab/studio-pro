import { ensureEvenDimension, validateVideoFile } from '../utils/validators.js';
import { APP_CONFIG } from '../core/config.js';

export function computeOutputDimensions(aspectRatio, maxHeight = 720) {
  if (aspectRatio === '9:16') {
    const width = ensureEvenDimension(maxHeight);
    const height = ensureEvenDimension(Math.round((maxHeight * 16) / 9));
    return { width, height };
  }
  const height = ensureEvenDimension(maxHeight);
  const width = ensureEvenDimension(Math.round((maxHeight * 16) / 9));
  return { width, height };
}

export async function renderMergedClips(clips, options = {}, onProgress) {
  if (!clips || clips.length === 0) {
    throw new Error('Ajoutez au moins un clip vidéo avant de lancer la fusion.');
  }
  clips.forEach((c) => validateVideoFile(c.file));

  const {
    aspectRatio = '16:9',
    maxResolution = 720,
    applyWatermark = true,
  } = options;

  const { width, height } = computeOutputDimensions(aspectRatio, maxResolution);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const canvasStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : 'video/webm';

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: maxResolution >= 1080 ? 5_000_000 : 2_800_000,
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(250);

  try {
    for (let i = 0; i < clips.length; i += 1) {
      await playClipToCanvas(clips[i], {
        ctx,
        width,
        height,
        audioCtx,
        dest,
        applyWatermark,
        clipIndex: i,
        totalClips: clips.length,
        onProgress,
      });
    }
  } finally {
    if (recorder.state !== 'inactive') {
      await new Promise((resolve) => {
        recorder.onstop = resolve;
        recorder.stop();
      });
    }
    combinedStream.getTracks().forEach((track) => track.stop());
    await audioCtx.close();
  }

  return {
    blob: new Blob(chunks, { type: mimeType }),
    fileName: `studiopro_montage_${Date.now()}.webm`,
    width,
    height,
  };
}

function playClipToCanvas(clip, env) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(clip.file);
    video.src = url;
    video.playsInline = true;
    video.muted = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onerror = () => {
      cleanup();
      reject(new Error(`Erreur de lecture sur le clip : ${clip.file.name}`));
    };

    video.onloadedmetadata = async () => {
      try {
        const source = env.audioCtx.createMediaElementSource(video);
        const gain = env.audioCtx.createGain();
        gain.gain.value = clip.volume ?? 1;
        source.connect(gain);
        gain.connect(env.dest);

        await video.play();

        const drawFrame = () => {
          if (video.paused || video.ended) return;

          env.ctx.fillStyle = '#070b12';
          env.ctx.fillRect(0, 0, env.width, env.height);

          const scale = Math.min(env.width / video.videoWidth, env.height / video.videoHeight);
          const dw = video.videoWidth * scale;
          const dh = video.videoHeight * scale;
          const dx = (env.width - dw) / 2;
          const dy = (env.height - dh) / 2;

          env.ctx.drawImage(video, dx, dy, dw, dh);

          if (env.applyWatermark) {
            env.ctx.save();
            env.ctx.font = '600 18px system-ui, sans-serif';
            env.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            env.ctx.textAlign = 'right';
            env.ctx.fillText(APP_CONFIG.brandWatermark, env.width - 20, env.height - 20);
            env.ctx.restore();
          }

          if (video.duration > 0) {
            const clipProgress = video.currentTime / video.duration;
            const globalPct = Math.round(((env.clipIndex + clipProgress) / env.totalClips) * 100);
            env.onProgress?.(globalPct);
          }

          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onended = () => {
      cleanup();
      resolve();
    };
  });
}
