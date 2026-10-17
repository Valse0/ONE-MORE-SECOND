import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { difficultyAt, laneForDirection, ruleStateAt } from '../src/systems/DifficultyManager.js';
import { scoreFromElapsed } from '../src/systems/ScoreManager.js';
import { nextObstacleLane } from '../src/systems/ObstaclePattern.js';

test('survival score advances once per full second', () => {
  assert.equal(scoreFromElapsed(-10), 0);
  assert.equal(scoreFromElapsed(999), 0);
  assert.equal(scoreFromElapsed(1000), 1);
  assert.equal(scoreFromElapsed(8950), 8);
});

test('difficulty rises in bounded steps', () => {
  assert.deepEqual(difficultyAt(0), { level: 0, spawnInterval: 2200, obstacleSpeed: 0.68 });
  assert.equal(difficultyAt(15000).level, 1);
  assert.ok(difficultyAt(600000).spawnInterval >= 1250);
  assert.ok(difficultyAt(600000).obstacleSpeed <= 1.25);
});

test('rule changes warn for two seconds and reverse for two seconds every ten', () => {
  assert.equal(ruleStateAt(5999).phase, 'normal');
  assert.deepEqual(ruleStateAt(6000), { phase: 'warning', seconds: 2 });
  assert.deepEqual(ruleStateAt(8000), { phase: 'active', seconds: 2 });
  assert.equal(ruleStateAt(9999).phase, 'active');
  assert.deepEqual(ruleStateAt(10000), { phase: 'normal', seconds: 6 });
});

test('directional lane mapping reverses during the announced period', () => {
  assert.equal(laneForDirection('ArrowUp', false), 0);
  assert.equal(laneForDirection('ArrowDown', false), 1);
  assert.equal(laneForDirection('ArrowUp', true), 1);
  assert.equal(laneForDirection('ArrowDown', true), 0);
});

test('obstacle lanes alternate deterministically', () => {
  const lanes = [];
  let previous = 1;
  for (let index = 0; index < 8; index += 1) {
    previous = nextObstacleLane(previous);
    lanes.push(previous);
  }
  assert.deepEqual(lanes, [0, 1, 0, 1, 0, 1, 0, 1]);
});

test('English and Turkish locale keys remain in parity', async () => {
  const [english, turkish] = await Promise.all(['en', 'tr'].map(async (locale) =>
    JSON.parse(await readFile(new URL(`../public/locales/${locale}.json`, import.meta.url), 'utf8'))));
  assert.deepEqual(Object.keys(turkish).sort(), Object.keys(english).sort());
});
