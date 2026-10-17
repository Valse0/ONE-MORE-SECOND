ONE MORE SECOND — Phase 1: Project Bootstrap & Playable Prototype

Role

Act as a senior JavaScript game engineer and technical lead. Build the foundation of a polished, browser-based 2D arcade game called ONE MORE SECOND.

Work directly in the VPS environment. Inspect the current working directory and available tools before making changes. Implement the project, run the available checks, fix errors, and report the actual results.

1. Core constraints

* Game engine: Phaser 3.
* Language: pure JavaScript ES6+ using native ES modules.
* Build tool: Vite.
* Package manager: npm.
* Target: modern desktop and mobile browsers.
* Version control: Git, prepared for a new GitHub repository.
* Deployment target: itch.io HTML5.
* Use JavaScript only. No TypeScript.
* Do not use React, Vue, Angular, Next.js, Tailwind, or DOM-based UI frameworks.
* Do not add a backend, database, authentication, analytics, or online leaderboard.
* Avoid unnecessary dependencies. Use Phaser for gameplay and ordinary HTML/CSS only for the surrounding shell when needed.
* Pin compatible dependency versions in package.json and commit the lockfile.

2. Before coding

1. Inspect the current directory, Node.js version, npm version, Git availability, and whether the directory contains existing files.
2. Do not overwrite, delete, or reinitialize an existing project without understanding its contents.
3. If the current directory is unsuitable or contains unrelated work, create a new directory named one-more-second.
4. Check the installed environment before selecting compatible dependency versions.
5. If a required dependency cannot be downloaded or a tool is unavailable, report the actual blocker. Never pretend a command succeeded.
6. Do not expose environment variables, credentials, tokens, or other secrets.

3. Game concept

ONE MORE SECOND is a minimalist, high-replayability survival arcade game.

The player controls a glowing object that automatically moves around a circular arena. The arena has two concentric lanes. Obstacles approach along these lanes, and the player must switch lanes at the right moment to survive.

Controls:

* Desktop: Spacebar, Enter, or left mouse click to switch lanes.
* Mobile: tap the game area or use a clearly visible touch control.
* Prevent a single held key or touch from triggering repeated unintended switches.
* Support restarting immediately after a game over.

Core loop:

1. Start the game immediately from a clear start screen.
2. Survive by switching between the two lanes.
3. Avoid obstacles and earn score based on survival time.
4. Increase difficulty gradually.
5. Every 10 seconds, introduce a clearly communicated rule change.
6. On collision, stop gameplay and show the final score and best score.
7. Allow immediate replay.

For the first prototype, implement ONE rule change only: reverse the lane-switching input mapping for a short, clearly announced period. Provide an on-screen warning before the change. Make the change fair and understandable.

Important: lane switching must remain deterministic, obstacles must be avoidable, and collisions must be reliable. Do not use random changes that can create unavoidable collisions.

4. Visual direction

Create a distinctive minimalist neon arcade aesthetic:

* Dark background.
* Clear geometric arena.
* Bright player character.
* Contrasting obstacles.
* Restrained glow and particle effects.
* Smooth movement and readable animations.
* Strong visual distinction between safe space, obstacles, warnings, and game-over state.

Draw simple graphics programmatically with Phaser where practical. Do not depend on external image assets for the prototype.

Avoid excessive screen shake, effects that obscure hazards, and decorative elements that harm readability.

The game should feel intentional and polished, not like a generic tutorial demo.

5. Architecture

Keep the code modular and easy to maintain. Use a sensible structure such as:

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
ScoreManager.js
utils/
storage.js
styles/
main.css

You may adjust this structure if there is a concrete reason. Do not create empty abstractions or unnecessary files.

Responsibilities:

* BootScene: initialize assets and transition to the menu.
* MenuScene: title, instructions, and start action.
* GameScene: gameplay lifecycle, movement, obstacles, collision handling, scoring, and rule changes.
* GameOverScene: final score, best score, and replay.
* InputController: normalize desktop and touch input.
* DifficultyManager: predictable difficulty progression.
* ObstacleManager: obstacle spawning, movement, and cleanup.
* ScoreManager: survival-time scoring.
* storage.js: safe local best-score persistence.

Use Phaser’s lifecycle correctly. Clean up event listeners, timers, and scene-owned objects when appropriate. Avoid duplicated update loops and orphaned timers.

6. Gameplay requirements

* Implement real collision detection, not visual-only collision.
* Obstacles must be telegraphed sufficiently early to permit a reaction.
* Difficulty must increase gradually and have reasonable limits.
* Pause or handle gameplay appropriately when the browser tab becomes hidden.
* Prevent repeated game-over triggers.
* Restarting must reset the game state without duplicated objects or event listeners.
* Store the best score locally, with defensive handling if browser storage is unavailable.
* Display the current score, best score, and rule-change countdown or warning.
* Include a sound toggle, but do not make sound mandatory for understanding the game.
* Respect reduced-motion preferences where practical.
* Make controls usable on both desktop and mobile.

7. Responsive layout and performance

* Support landscape and portrait screens.
* Resize the Phaser canvas correctly.
* Keep the important play area visible on narrow mobile screens.
* Avoid scrollbars, accidental page scrolling during gameplay, and accidental browser zoom gestures where reasonably possible.
* Keep gameplay rendering inside Phaser rather than repeatedly manipulating DOM elements.
* Clean up off-screen obstacles.
* Avoid unnecessary per-frame object allocation.
* Use a consistent and readable visual hierarchy.

8. Testing and quality assurance

Add an appropriate lightweight test setup only if it provides real value. At minimum:

1. Install dependencies successfully.
2. Run the production build.
3. Run any tests or static checks that are configured.
4. Fix all errors introduced by this implementation.
5. Check that scene transitions, input handling, collision handling, score updates, rule changes, best-score persistence, and restart logic are implemented.
6. Inspect the generated project for broken imports, missing files, and unused dependencies.
7. If browser automation or a graphical browser is available, launch the game and verify the actual rendered experience. Test desktop and mobile-sized viewports when possible.
8. Do not claim visual or gameplay tests were performed if they were not.

If browser testing is unavailable, explicitly distinguish verified build results from unverified gameplay behavior.

9. Git and safety

* Create a local Git repository only if appropriate and safe.
* Add a suitable .gitignore for Node.js, Vite, generated build output, local environment files, and editor artifacts.
* Never commit node_modules, generated secrets, .env files, or credentials.
* Create a sensible initial commit only after the project passes its available checks and only if Git identity is configured.
* Do not create a remote repository, push to GitHub, change VPS security settings, or modify SSH configuration in this phase.
* Do not run destructive shell commands or alter unrelated files.

10. Completion report

When finished, provide a concise factual report containing:

1. The project directory.
2. The architecture and important files created.
3. The exact commands to start the development server and build the game.
4. The build and test results, including failures.
5. Whether the game was actually launched and visually tested.
6. Any remaining bugs or limitations.
7. Git status and commit information, if applicable.
8. The single most valuable next development step.

Definition of done

Phase 1 is complete only when a player can open the game, start playing, switch lanes, avoid real obstacles, see the score increase, experience a fair rule change, lose, see the best score, and restart.

Prioritize a reliable playable loop over extra features. Do not add features outside this scope merely to make the project appear more advanced.
