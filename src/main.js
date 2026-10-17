import Phaser from 'phaser';
import { gameConfig } from './game/config.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import './styles/main.css';

new Phaser.Game({
  ...gameConfig,
  parent: 'game',
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
});
