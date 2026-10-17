# Project Rules

## Project and stack

ONE MORE SECOND is a small, replayable survival arcade game for modern desktop and mobile browsers, with itch.io HTML5 as the planned deployment target. The approved stack is Phaser 3, pure JavaScript ES modules, Vite, and npm. Use ordinary HTML/CSS only for the surrounding shell when needed.

Do not use TypeScript, React, Vue, Angular, Next.js, Tailwind, DOM UI frameworks, backends, databases, authentication, analytics, online leaderboards, or dependencies without a concrete need. Pin compatible dependency versions and keep `package-lock.json` in sync when the app is initialized.

## Before changing code

Read the relevant parts of `GDD.md`, `ARCHITECTURE.md`, and `TASKS.md` before implementing a task. Treat `TASKS.md` as the implementation scope. Inspect the actual repository, scripts, and Git status first; do not assume files or commands exist. Preserve unrelated and uncommitted work. Make the smallest coherent change and do not reinitialize or destructively clean the repository.

Update the relevant documentation when an intentional design or architecture decision changes. Keep planned components clearly distinguished from implemented ones. Never claim tests, builds, or visual checks passed unless you ran them.

## Organization and boundaries

Use the documented structure in `ARCHITECTURE.md` as a guide, adjusting it only for a concrete reason. Keep gameplay rules and state separate from Phaser rendering; normalize input in an input controller; keep spawning/collision ownership in obstacle/gameplay systems; keep score calculation separate from rendering; and isolate persistence behind utilities. Scenes coordinate lifecycle and transitions rather than becoming a home for unrelated systems. Avoid empty abstractions and unnecessary files.

Use PascalCase for scene and class files, camelCase for functions and variables, and descriptive names. Keep modules small and use native ES module imports/exports. Handle browser storage and other browser APIs defensively. Report errors with useful context; do not silently swallow unexpected failures.

## Phaser lifecycle and resources

Register scene-owned listeners, timers, and input once and remove or stop them when the scene shuts down. Destroy scene-owned game objects and timers during cleanup. Avoid duplicate update loops, orphaned timers, repeated game-over transitions, and per-frame allocations where practical. Respect Phaser scene lifecycle events and pause or otherwise handle play when the document becomes hidden.

## Player experience

All player-facing text must follow `LOCALIZATION.md`; do not hard-code UI copy in scenes. Keep gameplay usable in portrait and landscape, on narrow mobile displays, and with keyboard, mouse, and touch input. Prevent held inputs from causing repeated lane changes. Preserve clear hazard contrast, sufficient reaction time, readable text, and usable touch targets. Honor reduced-motion preferences where practical and keep effects from obscuring play.

Keep rendering and gameplay in Phaser; do not update DOM UI every frame. Clean up off-screen obstacles and avoid avoidable allocation or rendering work.

## Verification

Once the app exists, use the scripts actually present in `package.json`. The intended commands are `npm run dev` and `npm run build`; run `npm test` only if a real test suite is configured, and `npm run check` only if it performs a meaningful, reliable check. Do not create placeholder scripts or tests. Locale JSON can be checked with Node without adding a dependency. Record which checks actually ran and their outcomes.

## Git and secrets

Never expose or commit credentials, tokens, `.env` values, or generated secrets. Do not commit, push, change remotes, or discard user changes unless explicitly requested. Review the diff and status before finishing. Keep changes surgical and scoped to the task.
