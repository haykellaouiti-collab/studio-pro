export async function cleanupFFmpegFiles(ffmpeg, filenames = []) {
  for (const name of filenames) {
    try {
      await ffmpeg.deleteFile(name);
    } catch (_) {
      // ignore missing file
    }
  }
}
