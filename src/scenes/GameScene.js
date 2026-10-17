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
    this.playTone(520, 0.045);
  }

  update(_time, delta) {
    if (this.gameEnded) return;
    const frameDelta = Math.min(Math.max(delta, 0), 50);
    this.elapsed += frameDelta;
    const elapsed = this.elapsed;
    this.playerAngle = Phaser.Math.Angle.Wrap(this.playerAngle + frameDelta / 1000 * 0.42);
    this.positionPlayer();
    const difficulty = difficultyAt(elapsed);
    this.obstacles.update(elapsed, frameDelta, this.playerAngle, this.laneRadii, difficulty.obstacleSpeed, difficulty.spawnInterval, this.reducedMotion);
    if (this.gameEnded) return;
    const score = scoreFromElapsed(elapsed);
    this.scoreLabel.setText(`${text('game.score')}  ${String(score).padStart(3, '0')}`);
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
      this.arena.fillStyle(0x101728, 0.9);
      this.arena.fillCircle(this.center.x, this.center.y, radius + 26);
      this.arena.lineStyle(1, 0x25304b, 0.9);
      this.arena.strokeCircle(this.center.x, this.center.y, radius + 26);
      this.arena.lineStyle(2, 0x33405e, 0.9);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[0]);
      this.arena.lineStyle(2, 0x33405e, 0.9);
      this.arena.strokeCircle(this.center.x, this.center.y, this.laneRadii[1]);
      this.arena.lineStyle(1, 0x26324d, 0.6);
      this.arena.lineBetween(this.center.x, this.center.y - radius - 18, this.center.x, this.center.y - radius - 6);
      this.arena.lineBetween(this.center.x + radius + 6, this.center.y, this.center.x + radius + 18, this.center.y);
      this.arena.lineBetween(this.center.x, this.center.y + radius + 6, this.center.x, this.center.y + radius + 18);
      this.arena.lineBetween(this.center.x - radius - 18, this.center.y, this.center.x - radius - 6, this.center.y);
      this.positionPlayer();
    };
    this.scale.on('resize', this.onResize);
    this.onResize();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onResize));
  }

  drawPlayer() {
    this.playerGlow = this.add.circle(0, 0, 21, 0x76f3d0, 0.13).setDepth(4);
    this.player = this.add.circle(0, 0, 9, 0x9bffe4, 1).setStrokeStyle(2, 0xffffff, 1).setDepth(5);
  }

  createHud() {
    this.scoreLabel = this.add.text(22, 20, '', { fontFamily: 'Arial, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#f2f5ff' }).setDepth(8);
    this.bestLabel = this.add.text(22, 46, '', { fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#8190af' }).setDepth(8);
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
      this.ruleLabel.setPosition(width / 2, 28);
      this.soundButton.setPosition(width - 18, 20);
    };
    this.scale.on('resize', this.onHudResize);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onHudResize));
  }

  pointOnLane(angle, radius) {
    return { x: this.center.x + Math.cos(angle) * radius, y: this.center.y + Math.sin(angle) * radius };
  }

  positionPlayer() {
    if (!this.player || !this.center) return;
    const { x, y } = this.pointOnLane(this.playerAngle, this.laneRadii[this.playerLane]);
    this.player.setPosition(x, y);
    this.playerGlow.setPosition(x, y);
  }

  updateRuleLabel(elapsed) {
    const state = ruleStateAt(elapsed);
    if (state.phase === 'warning') {
      this.ruleLabel.setColor('#ffd166').setText(`${text('game.ruleChangeWarning')}  ${state.seconds}s`);
    } else if (state.phase === 'active') {
      this.ruleLabel.setColor('#ff8f70').setText(`${text('game.ruleChangeActive')}  ${state.seconds}s`);
    } else {
      this.ruleLabel.setColor('#76f3d0').setText('');
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
    this.scene.start('game-over', { score, best });
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
