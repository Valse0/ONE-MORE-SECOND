# Localization Policy

## Supported locales

English (`en`) is the default language. Turkish (`tr`) is also supported. The initial source dictionaries are `public/locales/en.json` and `public/locales/tr.json`.

## Rules

- All player-facing text comes from locale files, including menu labels, instructions, control hints, score labels, rule-change warnings, game-over messages, sound controls, and accessibility-related text.
- Use stable, descriptive keys grouped by context (for example `menu.start` or `game.ruleChangeWarning`). Do not use translated text as a key.
- Keep both dictionaries structurally in sync. Any added or renamed key must be updated in both files.
- Do not duplicate locale strings directly in scene code. Dynamic values such as score, seconds, or best score should be supplied separately to the localized text/template where practical.
- Use UTF-8 and preserve Turkish characters. Avoid concatenating fragments whose grammar differs across languages; use a complete localized phrase with named placeholders if interpolation becomes necessary.
- Do not add a localization library unless the project demonstrates a need that a small local loader cannot meet.

## Fallback

English is the default dictionary. If a selected-locale key is missing, use the English value for that key. If it is missing there too, surface a clear development-time diagnostic and render a safe empty or key-visible fallback rather than crashing gameplay. Validate key parity during quality checks so this fallback is exceptional.

No localization engine or loader is implemented yet; these are requirements for future UI work.
