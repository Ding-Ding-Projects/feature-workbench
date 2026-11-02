# Optional synthesized action sounds

`src/sounds.js` provides original, short sine-wave cues for `success`, `refused`, and `delete`. The sequences were composed directly as frequencies and durations in source. They contain no recorded sample, downloaded asset, operating-system sound, or imitation claim. In particular, they are **not** the Windows “tada” sound.

## Integration

```js
import {createSoundPlayer, SOUND_DEFAULTS} from './sounds.js';
const sounds = createSoundPlayer({getPreferences: () => preferences});
// Only after an intentional user action has actually succeeded:
void sounds.play('success');
// On sound preference changes, route teardown, or cancellation:
sounds.stop();
// At application teardown:
sounds.destroy();
```

Defaults are `soundEffects: false`, `soundVolume: 0.4`, and `soundMuted: false`. The host owns the opt-in settings controls, accessible labels, language, persistence, and event-result classification. A `success` cue must never be sent optimistically before success. A `delete` cue is for a completed intentional deletion, not opening a confirmation dialog. Sounds complement rather than replace visible and screen-reader status. No construction, startup, timer, or background event automatically plays a cue.

`play(kind)` resolves `{played, reason}`. `played:true` with `reason:'scheduled'` means Web Audio accepted scheduling; it does **not** prove audible playback, a connected output device, or the OS volume. Failures and suppression return `played:false` with generic codes: `disabled`, `muted`, `reduced-sound`, `quiet-hours`, `zero-volume`, `busy`, `cooldown`, `unavailable`, `suspended`, `audio-refused`, `preferences-unavailable`, `unknown-cue`, `cancelled`, or `destroyed`. Optional `onStatus` receives the same object, never user content or exception details. Do not block the user's operation while waiting for audio or turn audio failure into operation failure.

All cues use the same lazy AudioContext and gain/envelope path. Volume is bounded to 0–1 and gain peaks at 0.12 times volume; this is an internal amplitude limit, **not** a hardware loudness guarantee. Gain ramps avoid abrupt starts and endings. Overlapping requests are refused instead of queued, and a 350 ms cooldown avoids rapid repeated cues. Each cue lasts less than half a second. Audio nodes disconnect after completion; `stop` cancels current/pending scheduling and `destroy` also attempts to close the context. Both are safe to call repeatedly.

Playback checks current `reducedSound`, `quietHours`, mute, opt-in and volume settings before context creation and again after asynchronous resume. The host must call `stop()` when these settings change to immediately halt a cue already scheduled. `reducedMotion` alone intentionally does not mute sound. Browser autoplay restrictions may leave a context suspended or refuse resume; no workaround or automatic retry is attempted. A later explicit user action may retry. No network, browser storage, external dependency, host sound setting, or system audio device configuration is accessed.

Test injections: `AudioContext`, `now`, `setTimer`, `clearTimer`, `cooldownMs`, `getPreferences`, and `onStatus`. Production defaults use platform APIs. Only host calls to `play` authorize sound; the module cannot independently establish whether an application result succeeded or whether its caller represents an intentional user gesture.

## Verification scope

`node --test tests/sounds.test.mjs` tests a fake Web Audio API: opt-in defaults, lazy initialization, actual node/envelope scheduling, bounded gain, shared context, no overlap, cooldown, cleanup, suppression preferences, resume races, failures, and callback isolation. These are unit tests, not proof of actual audible output or browser autoplay behavior. Browser smoke testing and listening verification remain separate; no exact operating-system sound parity is claimed.
