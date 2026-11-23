export class ObjectUrlManager {
  constructor() {
    this.urls = [];
  }
  create(blob) {
    const url = URL.createObjectURL(blob);
    this.urls.push(url);
    return url;
  }
  revokeAll() {
    while (this.urls.length) {
      URL.revokeObjectURL(this.urls.pop());
    }
  }
}
