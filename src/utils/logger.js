export function formatLogLine(level, text) {
  const ts = new Date().toISOString().slice(11, 19);
  return `[${ts}] [${level.toUpperCase()}] ${text}`;
}
