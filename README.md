# ONE MORE SECOND

A small neon survival arcade prototype built with Phaser 3, JavaScript ES modules, and Vite.

## Run locally

Use Node.js 24 LTS (or a compatible supported LTS release) and npm:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`. Run deterministic logic and locale checks with `npm test`.

## Controls

- Space, Enter, click, or tap: switch lanes.
- Up and Down: choose the inner or outer lane. Their mapping reverses during the warned rule change.
- Any supported input restarts after a collision.

English is selected by default; browsers using Turkish receive the Turkish locale.
