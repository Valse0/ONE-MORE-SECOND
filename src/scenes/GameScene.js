import Phaser from 'phaser';
import { difficultyAt, laneForDirection, ruleStateAt } from '../systems/DifficultyManager.js';
import { scoreFromElapsed } from '../systems/ScoreManager.js';
import ObstacleManager from '../systems/ObstacleManager.js';
import InputController from '../systems/InputController.js';
import { loadBestScore, saveBestScore } from '../utils/storage.js';
import { text } from '../utils/localization.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.elapsed = 0;
    this.bestScore = loadBestScore();
    this.playerAngle = -Math.PI / 2;
    this.playerLane = 0;
    this.displayLane = 0;
    this.gameEnded = false;
    this.soundEnabled = true;
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.drawArena();
    this.drawPlayer();
    this.createHud();
    this.obstacles = new ObstacleManager(this);
    this.inputController = new InputController(this, (key) => this.handleInput(key));
    this.onVisibilityChange = () => {
      if (document.hidden && this.scene.isActive()) this.scene.pause();
      else if (!document.hidden && this.scene.isPaused()) this.scene.resume();
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  handleInput(key) {
    if (this.gameEnded) return;
    const reversed = ruleStateAt(this.elapsed).phase === 'active';
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      this.playerLane = laneForDirection(key, reversed);
    } else {
      this.playerLane = 1 - this.playerLane;
    }
    this.laneFlash = 1;
    this.tweens.killTweensOf(this.player);
    this.tweens.add({ targets: this.player, scaleX: 1.45, scaleY: 1.45, duration: 75, yoyo: true, ease: 'Sine.Out' });
    this.tweens.killTweensOf(this.switchRing);
    this.switchRing.setPosition(this.player.x, this.player.y).setAlpha(0.8).setScale(0.45);
    this.tweens.add({ targets: this.switchRing, alpha: 0, scale: 1.8, duration: 260, ease: 'Cubic.Out' });
    this.playTone(520, 0.045);
  }

  update(_time, delta) {
    if (this.gameEnded) return;
    const frameDelta = Math.min(Math.max(delta, 0), 50);
    this.elapsed += frameDelta;
    const elapsed = this.elapsed;
    this.playerAngle = Phaser.Math.Angle.Wrap(this.playerAngle + frameDelta / 1000 * 0.42);
    this.displayLane += (this.playerLane - this.displayLane) * Math.min(1, frameDelta / 70);
    this.positionPlayer();
    this.updateArenaMotion(elapsed);
    const difficulty = difficultyAt(elapsed);
    this.obstacles.update(elapsed, frameDelta, this.playerAngle, this.laneRadii, difficulty.obstacleSpeed, difficulty.spawnInterval, this.reducedMotion);
    if (this.gameEnded) return;
    const score = scoreFromElapsed(elapsed);
    this.scoreLabel.setText(`${text('game.score')}  ${String(score).padStart(3, '0')}`);
    this.timeLabel.setText(`${text('game.timeSurvived')}  ${this.formatTime(elapsed)}`);
    this.bestLabel.setText(`${text('game.bestScore')}  ${String(this.bestScore).padStart(3, '0')}`);
    this.updateRuleLabel(elapsed);
  }

  drawArena() {
    this.arena = this.add.graphics().setDepth(0);
    this.laneRadii = [0, 0];
    this.onResize = () => {
      const width = this.scale.width;
      const height = this.scale.height;
      this.center = { x: width / 2, y: height / 2 };
      const radius = Math.max(65, Math.min(width, height) * 0.29);
      this.laneRadii = [radius * 0.78, radius];
      this.arena.clear();
      this.arena.fillStyle(0x0d1425, 0.92);
      this.arena.fillCircle(this.center.x, this.center.y, radius + 32);
      this.arena.lineStyle(1, 0x243653, 0.8);
      this.arena.strokeCircle(this.center.x, this.center.y, radius + 32);
      this.arena.lineStyle(1, 0x18243d, 0.8);
      this.arena.strokeCircle(this.center.x, this.center.y, radius + 18);
      this.arena.lineStyle(7, 0x102e48, 0.28);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[0]);
      this.arena.lineStyle(2, 0x28739a, 0.7);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[0]);
      this.arena.lineStyle(7, 0x102e48, 0.24);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[1]);
      this.arena.lineStyle(2, 0x28739a, 0.7);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[1]);
      this.arena.lineStyle(1, 0x26324d, 0.65);
      this.arena.lineBetween(this.center.x, this.center.y - radius - 18, this.center.x, this.center.y - radius - 6);
      this.arena.lineBetween(this.center.x + radius + 6, this.center.y, this.center.x + radius + 18, this.center.y);
      this.arena.lineBetween(this.center.x, this.center.y + radius + 6, this.center.x, this.center.y + radius + 18);
      this.arena.lineBetween(this.center.x - radius - 18, this.center.y, this.center.x - radius - 6, this.center.y);
      this.positionPlayer();
      this.drawCenterCore(radius);
    };
    this.scale.on('resize', this.onResize);
    this.onResize();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onResize));
  }

  drawPlayer() {
    this.trail = this.add.graphics().setDepth(3);
    this.playerGlow = this.add.circle(0, 0, 25, 0x42dfff, 0.12).setDepth(4);
    this.switchRing = this.add.circle(0, 0, 13, 0x5ef7ff, 0, 2).setDepth(4);
    this.player = this.add.circle(0, 0, 9, 0xa9ffff, 1).setStrokeStyle(2, 0xffffff, 1).setDepth(5);
  }

  drawCenterCore(radius) {
    if (!this.core) {
      this.core = this.add.graphics().setDepth(1);
    }
    this.core.clear();
    this.core.fillStyle(0x101d34, 0.96);
    this.core.fillCircle(this.center.x, this.center.y, radius * 0.52);
    this.core.lineStyle(1, 0x31466b, 0.85);
    this.core.strokeCircle(this.center.x, this.center.y, radius * 0.52);
    this.core.lineStyle(1, 0x287e9c, 0.4);
    this.core.strokeCircle(this.center.x, this.center.y, radius * 0.43);
    this.core.fillStyle(0x36d9ec, 0.1);
    this.core.fillCircle(this.center.x, this.center.y, radius * 0.34);
  }

  updateArenaMotion(elapsed) {
    if (this.reducedMotion) return;
    const pulse = 0.5 + Math.sin(elapsed / 680) * 0.5;
    this.core?.setAlpha(0.88 + pulse * 0.12);
    this.playerGlow?.setAlpha(0.1 + pulse * 0.08);
    if (this.player && this.center) {
      const inner = this.laneRadii[0];
      const outer = this.laneRadii[1];
      const radius = Phaser.Math.Linear(inner, outer, this.displayLane);
      const { x, y } = this.pointOnLane(this.playerAngle, radius);
      this.trail.clear();
      this.trail.lineStyle(5, 0x35ddff, 0.22);
      this.trail.beginPath();
      this.trail.arc(this.center.x, this.center.y, radius, this.playerAngle - 0.26, this.playerAngle, false);
      this.trail.strokePath();
      this.player.setPosition(x, y);
      this.playerGlow.setPosition(x, y);
      if (this.switchRing.alpha > 0) this.switchRing.setPosition(x, y);
    }
  }

  createHud() {
    this.hudPanel = this.add.graphics().setDepth(7);
    this.scoreLabel = this.add.text(22, 16, '', { fontFamily: 'Arial, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#f2f5ff' }).setDepth(8);
    this.timeLabel = this.add.text(22, 40, '', { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#55dff3' }).setDepth(8);
    this.bestLabel = this.add.text(22, 59, '', { fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#8190af' }).setDepth(8);
    this.ruleLabel = this.add.text(this.scale.width / 2, 28, '', { fontFamily: 'Arial, sans-serif', fontSize: '15px', fontStyle: 'bold', color: '#76f3d0', align: 'center' }).setOrigin(0.5, 0).setDepth(8);
    this.soundButton = this.add.text(this.scale.width - 18, 20, text('game.soundOn'), {
      fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#aebbd4',
      backgroundColor: '#141d2f', padding: { x: 12, y: 9 },
    }).setOrigin(1, 0).setDepth(8).setInteractive({ useHandCursor: true });
    this.soundButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.soundEnabled = !this.soundEnabled;
      this.soundButton.setText(text(this.soundEnabled ? 'game.soundOn' : 'game.soundOff'));
    });
    this.onHudResize = ({ width }) => {
      this.hudPanel.clear();
      this.hudPanel.fillStyle(0x0c1424, 0.78);
      this.hudPanel.fillRoundedRect(12, 10, 142, 75, 12);
      this.hudPanel.lineStyle(1, 0x28425c, 0.72);
      this.hudPanel.strokeRoundedRect(12, 10, 142, 75, 12);
      this.ruleLabel.setPosition(width / 2, width < 520 ? 98 : 28);
      this.soundButton.setPosition(width - 18, 20);
    };
    this.scale.on('resize', this.onHudResize);
    this.onHudResize({ width: this.scale.width });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onHudResize));
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  pointOnLane(angle, radius) {
    return { x: this.center.x + Math.cos(angle) * radius, y: this.center.y + Math.sin(angle) * radius };
  }

  positionPlayer() {
    if (!this.player || !this.center) return;
    const radius = Phaser.Math.Linear(this.laneRadii[0], this.laneRadii[1], this.displayLane);
    const { x, y } = this.pointOnLane(this.playerAngle, radius);
    this.player.setPosition(x, y);
    this.playerGlow.setPosition(x, y);
  }

  updateRuleLabel(elapsed) {
    const state = ruleStateAt(elapsed);
    if (state.phase === 'warning') {
      this.ruleLabel.setColor('#ffd166').setText(`${text('game.ruleChangeWarning')}  ${state.seconds}s`);
      this.ruleLabel.setAlpha(this.reducedMotion ? 1 : 0.72 + Math.sin(elapsed / 90) * 0.28);
    } else if (state.phase === 'active') {
      this.ruleLabel.setColor('#ff8f70').setText(`${text('game.ruleChangeActive')}  ${state.seconds}s`);
      this.ruleLabel.setAlpha(1);
    } else {
      this.ruleLabel.setColor('#76f3d0').setAlpha(1).setText('');
    }
  }

  endRun() {
    if (this.gameEnded) return;
    this.gameEnded = true;
    const score = scoreFromElapsed(this.elapsed);
    const best = Math.max(score, loadBestScore());
    if (score > this.bestScore) {
      saveBestScore(score);
      this.bestScore = score;
    }
    this.playTone(150, 0.18);
    this.cameras.main.flash(100, 255, 68, 120);
    if (!this.reducedMotion) this.cameras.main.shake(110, 0.006);
    const impact = this.add.circle(this.player.x, this.player.y, 12, 0xff5085, 0, 3).setDepth(9);
    this.tweens.add({ targets: impact, scale: 4, alpha: 0, duration: 240, ease: 'Cubic.Out', onComplete: () => impact.destroy() });
    this.time.delayedCall(250, () => this.scene.start('game-over', { score, best }));
  }

  playTone(frequency, duration) {
    if (!this.soundEnabled || !this.sound.context) return;
    try {
      const context = this.sound.context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gain.gain.setValueAtTime(0.04, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    } catch (error) {
      console.warn('Could not play the game sound:', error);
    }
  }

  cleanup() {
    this.inputController?.destroy();
    this.obstacles?.destroy();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
