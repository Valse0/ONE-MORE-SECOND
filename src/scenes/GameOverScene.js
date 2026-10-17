import Phaser from 'phaser';
import InputController from '../systems/InputController.js';
import { loadBestScore } from '../utils/storage.js';
import { text } from '../utils/localization.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  create({ score = 0, best = loadBestScore() }) {
    this.cameras.main.setBackgroundColor('#080b14');
    this.cameras.main.fadeIn(280, 4, 8, 20);
    const { width, height } = this.scale;
    const panel = this.add.graphics();
    panel.fillStyle(0x10182a, 0.78);
    panel.fillRoundedRect(width * 0.1, height * 0.2, width * 0.8, height * 0.62, 24);
    panel.lineStyle(1, 0x33516d, 0.8);
    panel.strokeRoundedRect(width * 0.1, height * 0.2, width * 0.8, height * 0.62, 24);
    panel.lineStyle(1, 0x6c285c, 0.4);
    panel.lineBetween(width * 0.2, height * 0.37, width * 0.8, height * 0.37);
    this.add.text(width / 2, height * 0.31, text('game.gameOver'), {
      fontFamily: 'Arial, sans-serif', fontSize: `${Math.min(48, width * 0.075)}px`, fontStyle: 'bold', color: '#ff7792',
      shadow: { offsetX: 0, offsetY: 0, color: '#ff397a', blur: 16, fill: true },
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.43, `${text('game.finalScore')}  ${score}`, {
      fontFamily: 'Arial, sans-serif', fontSize: '22px', color: '#f2f5ff',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.49, `${text('game.bestScore')}  ${best}`, {
      fontFamily: 'Arial, sans-serif', fontSize: '17px', color: '#92a0bd',
    }).setOrigin(0.5);
    const replayButton = this.add.text(width / 2, height * 0.62, text('game.playAgain'), {
      fontFamily: 'Arial, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#061017',
      backgroundColor: '#62edfa', padding: { x: 30, y: 15 },
      shadow: { offsetX: 0, offsetY: 0, color: '#20cdeb', blur: 14, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    replayButton.on('pointerover', () => replayButton.setScale(1.04).setBackgroundColor('#a0f8ff'));
    replayButton.on('pointerout', () => replayButton.setScale(1).setBackgroundColor('#62edfa'));
    replayButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('game');
    });
    this.add.text(width / 2, height * 0.72, text('controls.restart'), {
      fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#8793ac', align: 'center',
      wordWrap: { width: width * 0.8 },
    }).setOrigin(0.5);
    this.inputController = new InputController(this, () => this.scene.start('game'), () => this.scene.start('game'), { pointer: false });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.inputController.destroy());
    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onResize, this));
  }

  onResize() {
    this.scene.restart();
  }
}
