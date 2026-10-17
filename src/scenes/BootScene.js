import Phaser from 'phaser';
import { loadLocales } from '../utils/localization.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  async create() {
    try {
      await loadLocales();
      this.scene.start('menu');
    } catch (error) {
      console.error('Game startup failed while loading localization:', error);
      this.add.text(this.scale.width / 2, this.scale.height / 2, error.message, {
        color: '#ffffff', fontFamily: 'sans-serif', fontSize: '18px',
      }).setOrigin(0.5);
    }
  }
}
