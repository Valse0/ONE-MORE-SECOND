export function difficultyAt(elapsedMilliseconds) {
  const level = Math.floor(Math.max(0, elapsedMilliseconds) / 15000);
  return {
    level,
    spawnInterval: Math.max(1250, 2200 - level * 110),
    obstacleSpeed: Math.min(1.25, 0.68 + level * 0.035),
  };
}

export function ruleStateAt(elapsedMilliseconds) {
  const cycle = Math.max(0, elapsedMilliseconds) % 10000;
  if (cycle >= 8000) return { phase: 'active', seconds: Math.ceil((10000 - cycle) / 1000) };
  if (cycle >= 6000) return { phase: 'warning', seconds: Math.ceil((8000 - cycle) / 1000) };
  return { phase: 'normal', seconds: Math.ceil((6000 - cycle) / 1000) };
}

export function laneForDirection(key, reversed) {
  const requestedLane = key === 'ArrowUp' ? 0 : 1;
  return reversed ? 1 - requestedLane : requestedLane;
}
