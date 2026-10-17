# Game Design Document

## High concept

ONE MORE SECOND is a minimalist, high-replayability survival arcade game. The player guides a glowing object around a circular arena with two concentric lanes, changing lanes to avoid incoming obstacles. The intended audience is casual players looking for short, readable sessions on desktop or mobile browsers.

## Core loop

Start from a clear screen, survive by switching lanes, avoid approaching obstacles, and build a score based on survival time. Difficulty rises gradually. At regular intervals, a warning announces a temporary reversal of the lane-switch input mapping. A collision ends the run and shows the score and locally stored best score; the player can immediately restart.

## Arena and controls

The play field is a two-lane circular arena. The player moves automatically around it. A lane switch changes which concentric track the player occupies; the game must make the active lane and switch response clear. The exact geometry, orbit speed, and touch-control presentation are tuning choices to validate during implementation.

- Desktop: Space, Enter, or a left mouse click switches lanes.
- Up and Down select the inner and outer lane directly, which gives the temporary input reversal a meaningful mapping.
- Mobile: tapping the game area or a clearly visible touch control switches lanes.
- A held key or touch must not generate repeated unintended switches.
- Restart is available immediately after game over.

## Hazards, collisions, and score

Obstacles approach on either lane and must use real collision detection. Their approach must be telegraphed early enough for a reaction. Avoid random patterns that create unavoidable collisions. A collision ends gameplay once, freezes the run score, and presents final and best scores. Score is derived from survival time. Best score is stored locally with defensive behavior if browser storage is unavailable.

## Rule reversal and fairness

The initial prototype has one rule change: every 10 seconds, lane-switch input mapping reverses for a short period. An on-screen warning appears before the change and communicates the changed mapping. The prototype reverses Up and Down lane selection while Space, Enter, and tap remain available as a toggle. This makes the reversal meaningful despite a single toggle being symmetric across two lanes. The warning duration and reversal duration are provisional tuning values; the 10-second cadence and the single reversal mechanic are requirements from `TASKS.md`. The reversal must be understandable, deterministic, and introduced with enough warning to avoid unfair deaths.

Hazard timing and lane occupancy must remain deterministic enough that every presented obstacle pattern has a viable response. Difficulty increases gradually, is bounded, and must not reduce reaction time below a fair threshold. Exact speeds, spawn intervals, warning durations, and difficulty caps are provisional and should be tuned through playtesting.

## Presentation and settings

Use a minimalist neon arcade direction: dark background, geometric arena, bright player, contrasting obstacles, restrained glow and particles, and smooth, readable animation. Clearly distinguish safe space, hazards, warnings, and game-over state. Avoid excessive shake and decorative effects that compete with hazard readability. Provide a sound toggle; sound must not carry essential instructions. Respect reduced-motion preferences where practical.

## Scope

### MVP

- Start screen and immediately playable run.
- Two-lane circular arena, automatic player motion, and lane switching.
- Deterministic, avoidable obstacle patterns with real collision handling.
- Survival-time score, local best score, and immediate restart.
- Gradual difficulty progression and the warned temporary input reversal.
- Desktop and mobile controls, responsive portrait/landscape layout, sound toggle, visibility handling, and reduced-motion consideration.

### Deferred

Online leaderboards, accounts, backend services, analytics, databases, authentication, extra rule changes, and large feature additions are outside the initial scope. External art assets are not required for the prototype; simple Phaser-drawn geometry is preferred.

## Playtesting and acceptance

The prototype is acceptable when a player can start, switch lanes, avoid real obstacles, watch score increase, receive and understand the reversal warning, experience a fair rule reversal, lose on collision, see final and best score, and restart without duplicated state. Verify keyboard, mouse, and touch interaction; portrait and landscape resizing; hidden-tab handling; and best-score behavior when storage works and when it is unavailable.

Measure fairness by checking that every generated obstacle sequence has a viable lane response and that telegraph time exceeds the tested reaction requirement. Measure difficulty by confirming gradual bounded increases without unavoidable patterns. Exact numeric thresholds are provisional and should be set after an initial playable build and observed playtests.
