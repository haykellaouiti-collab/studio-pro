export function createLogger(onEntry) {
  const log = (level, message) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    onEntry?.({ timestamp, level, message, formatted });
  };

  return {
    info: (msg) => log('info', msg),
    warn: (msg) => log('warn', msg),
    error: (msg) => log('error', msg),
    cmd: (msg) => log('cmd', msg),
  };
}
