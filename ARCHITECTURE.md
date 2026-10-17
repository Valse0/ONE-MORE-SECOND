# Technical Architecture

## Repository status

Phase 1 now has a Vite and Phaser application with localized menu, gameplay, and game-over scenes. The structure below records the implementation and its responsibilities.

## Implemented structure

```text
public/
  locales/
    en.json
    tr.json
src/
  main.js
  game/
    config.js
  scenes/
    BootScene.js
    MenuScene.js
    GameScene.js
    GameOverScene.js
  systems/
    InputController.js
    DifficultyManager.js
    ObstacleManager.js
    ObstaclePattern.js
    ScoreManager.js
  styles/
    main.css
  utils/
    localization.js
    storage.js
  styles/
    main.css
index.html
package.json
package-lock.json
```

`test/game-logic.test.js` covers deterministic scoring, difficulty bounds, rule timing, lane mapping, obstacle lane sequencing, and locale key parity.

## Responsibilities

- `main.js` creates the Phaser game and registers scenes. It should not contain gameplay rules.
- `game/config.js` defines Phaser scale, renderer, dimensions, and scene configuration.
- `BootScene` performs startup setup and moves to the menu.
- `MenuScene` renders localized title/instructions, controls, and start action.
- `GameScene` coordinates the run lifecycle and composes arena/player rendering with input, obstacles, score, difficulty, and rule timing. Keep each system's logic in its own module where useful.
- `GameOverScene` presents final and best scores and restarts cleanly.
- `InputController` normalizes keyboard, pointer, and touch input and prevents held-input repeats. It should emit one semantic lane-switch action per deliberate activation.
- `ObstacleManager` owns deterministic obstacle scheduling, warning/approach timing, collision checks or collision callbacks, and off-screen cleanup. It must avoid patterns with no viable response.
- `DifficultyManager` applies gradual, bounded progression. Rule-change scheduling and temporary input mapping reversal should have explicit state and warning timing, coordinated with the run rather than hidden in rendering code.
- `ScoreManager` computes survival-time score and handles run/best-score values. `utils/storage.js` reads/writes best score defensively and keeps storage concerns out of scenes.
- `public/locales` contains the source UI dictionaries as specified in `LOCALIZATION.md`.

The responsibilities above are implemented in the listed modules. Phaser rendering remains in the scenes and the obstacle renderer; score, lane mapping, difficulty timing, and persistence are isolated in small systems and utilities.

## Startup and transitions

`main.js` constructs Phaser with `BootScene`, then boot setup loads the locale dictionaries and transitions to `MenuScene`. Starting enters `GameScene`. A single guarded collision/game-over path freezes score, saves a new best score if appropriate, and transitions to `GameOverScene`. Replay starts a fresh `GameScene`; scene shutdown removes input, resize, and visibility listeners and destroys obstacle graphics.

## Gameplay systems

Input is normalized once and only accepted while the run is active; keyboard down/up and pointer activation prevent repeats from held controls. A single toggle between two lanes is symmetric and cannot meaningfully reverse, so Up and Down provide explicit lane selection and their mapping reverses during the warned period. Space, Enter, click, and tap remain direct toggle controls. The warning names the reversed keys in both locales.

Obstacle scheduling is deterministic: obstacles alternate lanes, approach along the ring from ahead of the player, and are spaced to give time to react and switch. Collision checks compare wrapped angular distance and lane occupancy. Resolve collision once, stop scoring on game over, and destroy passed obstacles. Difficulty progression adjusts bounded speed and spawn interval; no random patterns are used.

Score derives from elapsed active survival time. Best score is persisted locally through guarded storage access; if storage is unavailable, the run must still work. The exact score scale is a tuning decision.

## Responsive layout and visibility

Configure Phaser scaling to fit the available browser viewport in portrait and landscape while keeping both lanes visible on narrow screens. Prevent page scrolling and accidental zoom gestures only as needed for usable gameplay. On document visibility changes, pause or safely suspend gameplay timers and scoring; resume in a predictable state. Remove visibility listeners when their owner is destroyed. Prefer Phaser rendering for the game UI and avoid per-frame DOM updates.

## Testing and dependency policy

The Node built-in test runner covers pure gameplay logic and locale parity without another dependency. Keep browser-specific Phaser behavior covered by manual/browser checks where available. Keep Phaser and Vite pinned and the npm lockfile synchronized.

Run `npm run dev`, `npm run build`, and `npm test` after installing dependencies. Report only checks actually run; this architecture file does not imply any check passed.
