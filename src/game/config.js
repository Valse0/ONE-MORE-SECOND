import Phaser from 'phaser';

export const gameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#080b14',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: 960,
    height: 960,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
  },
  input: {
    activePointers: 2,
  },
  audio: {
    noAudio: false,
  },
};
