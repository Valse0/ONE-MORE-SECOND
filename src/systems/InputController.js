import Phaser from 'phaser';

export default class InputController {
  constructor(scene, onSwitch, onRestart = () => {}, { pointer = true } = {}) {
    this.scene = scene;
    this.onSwitch = onSwitch;
    this.onRestart = onRestart;
    this.held = new Set();
    this.onKeyDown = (event) => {
      const key = event.code;
      if (!['Space', 'Enter', 'ArrowUp', 'ArrowDown'].includes(key) || this.held.has(key)) return;
      this.held.add(key);
      if (key === 'Enter' && this.scene.scene.key === 'game-over') this.onRestart();
      else this.onSwitch(key);
    };
    this.onKeyUp = (event) => this.held.delete(event.code);
    this.onBlur = () => this.held.clear();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    this.pointerEnabled = pointer;
    if (pointer) this.scene.input.on('pointerdown', this.onPointerDown);
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  onPointerDown = () => this.onSwitch('pointer');

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    if (this.pointerEnabled) this.scene.input.off('pointerdown', this.onPointerDown);
    this.held.clear();
  }
}
