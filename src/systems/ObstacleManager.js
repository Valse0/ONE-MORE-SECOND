import Phaser from 'phaser';
import { nextObstacleLane } from './ObstaclePattern.js';

export default class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.lastLane = 1;
    this.nextSpawn = 0;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(2);
  }

  update(elapsed, delta, playerAngle, laneRadii, speed, spawnInterval, reducedMotion) {
    if (elapsed >= this.nextSpawn) {
      this.spawn(elapsed, playerAngle, spawnInterval);
    }
    this.graphics.clear();
    for (let i = this.items.length - 1; i >= 0; i -= 1) {
      const item = this.items[i];
      item.angle -= speed * delta / 1000;
      const distance = Math.abs(Phaser.Math.Angle.Wrap(playerAngle - item.angle));
      if (distance < 0.09 && item.lane === this.scene.playerLane) {
        this.scene.endRun();
        return;
      }
      if (distance > Math.PI * 0.85) {
        this.items.splice(i, 1);
        continue;
      }
      const { x, y } = this.scene.pointOnLane(item.angle, laneRadii[item.lane]);
      const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed / 100 + item.phase) * 0.08;
      const size = 17 * pulse;
      this.graphics.fillStyle(0xff4f7b, 0.18);
      this.graphics.fillCircle(x, y, size + 8);
      this.graphics.fillStyle(0xff5577, 1);
      this.graphics.fillRoundedRect(x - size / 2, y - size / 2, size, size, 4);
      this.graphics.lineStyle(2, 0xffb3c2, 0.95);
      this.graphics.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 4);
    }
  }

  spawn(elapsed, playerAngle, interval) {
    const lane = nextObstacleLane(this.lastLane);
    this.lastLane = lane;
    this.items.push({ angle: playerAngle + 1.25, lane, phase: this.items.length * 2.1 });
    this.nextSpawn = elapsed + interval;
  }

  destroy() {
    this.graphics.destroy();
    this.items.length = 0;
  }
}
