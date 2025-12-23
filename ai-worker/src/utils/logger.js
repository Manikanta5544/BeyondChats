export function log(level, message) {
  console.log(`[${new Date().toISOString()}] ${level}: ${message}`);
}
