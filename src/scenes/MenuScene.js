import Phaser from 'phaser';
import { loadBestScore } from '../utils/storage.js';
import { text } from '../utils/localization.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create() {
    this.drawBackdrop();
    const { width, height } = this.scale;
    const titleSize = Math.min(54, Math.max(30, width * 0.075));
    this.add.text(width / 2, height * 0.25, text('app.title'), {
      fontFamily: 'Arial, sans-serif', fontSize: `${titleSize}px`, fontStyle: 'bold',
      color: '#f2f5ff', letterSpacing: 4, shadow: { offsetX: 0, offsetY: 0, color: '#13dafa', blur: 18, fill: true },
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.35, text('menu.instructions'), {
      fontFamily: 'Arial, sans-serif', fontSize: `${Math.min(20, Math.max(15, width * 0.027))}px`,
      color: '#9ea9c4', align: 'center', wordWrap: { width: width * 0.82 },
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.48, `${text('controls.keyboard')}\n${text('controls.directional')}\n${text('controls.mouse')}\n${text('controls.touch')}`, {
      fontFamily: 'Arial, sans-serif', fontSize: `${Math.min(16, Math.max(12, width * 0.021))}px`,
      color: '#6f7d9e', align: 'center', lineSpacing: 8, wordWrap: { width: width * 0.84 },
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.6, `${text('game.bestScore')}: ${loadBestScore()}`, {
      fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#7485a8',
    }).setOrigin(0.5);
    const startButton = this.add.text(width / 2, height * 0.72, text('menu.start'), {
      fontFamily: 'Arial, sans-serif', fontSize: '23px', fontStyle: 'bold', color: '#061017',
      backgroundColor: '#62edfa', padding: { x: 38, y: 17 },
      shadow: { offsetX: 0, offsetY: 0, color: '#20cdeb', blur: 16, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    startButton.on('pointerover', () => startButton.setScale(1.04).setBackgroundColor('#a0f8ff'));
    startButton.on('pointerout', () => startButton.setScale(1).setBackgroundColor('#62edfa'));
    startButton.on('pointerdown', (pointer, x, y, event) => {
      event.stopPropagation();
      this.scene.start('game');
    });
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('game'));
    this.scale.on('resize', this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.onResize, this));
  }

  onResize() {
    this.scene.restart();
  }

  drawBackdrop() {
    this.cameras.main.setBackgroundColor('#080b14');
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x172034, 0.65);
    const gap = Math.max(36, Math.min(width, height) / 12);
    for (let x = 0; x < width; x += gap) graphics.lineBetween(x, 0, x, height);
    for (let y = 0; y < height; y += gap) graphics.lineBetween(0, y, width, y);
    const radius = Math.min(width, height) * 0.28;
    graphics.lineStyle(1, 0x17405b, 0.2);
    graphics.strokeCircle(width / 2, height * 0.52, radius);
    graphics.strokeCircle(width / 2, height * 0.52, radius * 1.28);
    graphics.lineStyle(2, 0x24486f, 0.16);
    graphics.strokeCircle(width / 2, height * 0.52, radius * 0.72);
    graphics.setAlpha(0.5);
  }
}
