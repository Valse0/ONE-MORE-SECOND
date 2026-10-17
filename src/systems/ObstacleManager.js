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
      const size = 15 * pulse;
      const danger = Math.max(0, 1 - distance / 0.65);
      item.points[0].x = x; item.points[0].y = y - size;
      item.points[1].x = x + size; item.points[1].y = y;
      item.points[2].x = x; item.points[2].y = y + size;
      item.points[3].x = x - size; item.points[3].y = y;
      this.graphics.fillStyle(0xff3da8, 0.12 + danger * 0.12);
      this.graphics.fillCircle(x, y, size + 10);
      this.graphics.fillStyle(0xff3da8, 1);
      this.graphics.fillPoints(item.points, true);
      this.graphics.lineStyle(2, 0xffd1ed, 0.98);
      this.graphics.strokePoints(item.points, true);
      this.graphics.lineStyle(2, 0x741b69, 0.9);
      this.graphics.lineBetween(x - size * 0.42, y, x + size * 0.42, y);
    }
  }

  spawn(elapsed, playerAngle, interval) {
    const lane = nextObstacleLane(this.lastLane);
    this.lastLane = lane;
    this.items.push({
      angle: playerAngle + 1.25,
      lane,
      phase: this.items.length * 2.1,
      points: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
    });
    this.nextSpawn = elapsed + interval;
  }

  destroy() {
    this.graphics.destroy();
    this.items.length = 0;
  }
}
