# Sample Workbench

A browser-local task workspace and interactive guide. This is an **incomplete reference implementation**, not a certified implementation of every product contract.

## Run and verify

Requires an existing Node.js 20 or later. No third-party runtime dependencies are installed.

```sh
npm test
npm run check
npm run build
```

Serve `dist/` with a trusted static HTTP server. Build output is self-contained; no CDN is required. Source and build provenance are displayed on the initial screen. The build records the source commit's timestamp, not the visitor's launch time. A dirty build is for development, not release evidence.

`build.bat` invokes the same build on an existing Windows Node installation. Automatic trusted dependency acquisition is incomplete and returns nonzero when Node is missing. `build-installer.bat` returns nonzero because no native installer exists. These entrypoints are not evidence of native delivery.

## Privacy and boundaries

Tasks, settings, onboarding progress and local history belong to this browser profile. They do not synchronize to other devices or native apps. Browser storage can be cleared by the user or browser. Export a backup before clearing site data.

Personal wording, when supplied by the visitor, is validated and cached separately on this device. No mappings ship with the application. It is never included in workspace exports or history. Do not put secrets in tasks or import files from untrusted sources.

The site has no server-side account system, telemetry, authenticated forge integration, native installer, operating-system credential store, local model manager or game-server manager. Browser controls must never claim those operations occurred.

## Structure

- `src/`: application, local validation and feature inventory.
- `scripts/`: deterministic packaging and source checks.
- `tests/`: focused executable tests, not a substitute for browser verification.
- `docs/`: architecture, acceptance status and runtime verification.
- `dist/`: generated standalone static application, intentionally untracked.

## Acceptance

The required feature identifiers are fixed independently of the implementation inventory. The acceptance guard rejects missing identifiers and fabricated completion evidence. Incomplete contracts remain explicitly incomplete, even if a useful browser-local subset works. Documentation coverage and implementation proof are separate.

Nothing in this repository grants permission to publish private configuration, credentials, personal wording, or machine-specific details.
