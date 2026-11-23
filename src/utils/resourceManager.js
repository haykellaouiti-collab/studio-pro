export class ResourceTracker {
  constructor() {
    this.objectUrls = new Set();
    this.virtualFiles = new Set();
  }

  trackUrl(blob) {
    const url = URL.createObjectURL(blob);
    this.objectUrls.add(url);
    return url;
  }

  revokeUrl(url) {
    if (url && this.objectUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(url);
    }
  }

  trackVirtualFile(name) {
    this.virtualFiles.add(name);
    return name;
  }

  async cleanupFFmpeg(ffmpeg) {
    if (!ffmpeg) return;
    for (const name of this.virtualFiles) {
      try {
        await ffmpeg.deleteFile(name);
      } catch {
        // Ignorer si le fichier virtuel est déjà supprimé
      }
    }
    this.virtualFiles.clear();
  }

  releaseAllUrls() {
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url);
    }
    this.objectUrls.clear();
  }
}
