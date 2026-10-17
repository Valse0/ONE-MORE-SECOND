export function scoreFromElapsed(milliseconds) {
  return Math.max(0, Math.floor(milliseconds / 1000));
}
