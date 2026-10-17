const BEST_SCORE_KEY = 'one-more-second.best-score';

export function loadBestScore() {
  try {
    const value = Number(globalThis.localStorage?.getItem(BEST_SCORE_KEY));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch (error) {
    console.warn('Could not read the local best score:', error);
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    globalThis.localStorage?.setItem(BEST_SCORE_KEY, String(Math.max(0, Math.floor(score))));
    return true;
  } catch (error) {
    console.warn('Could not save the local best score:', error);
    return false;
  }
}
