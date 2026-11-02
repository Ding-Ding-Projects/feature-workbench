# Sample Workbench

A browser-local task workspace and interactive guide. This is an **incomplete reference implementation**, not a certified implementation of every product contract.

## Run and verify

On Windows 10/11 x64, run `build.bat` from any directory. It requests native Windows UAC consent interactively; only you can approve it. Cancellation fails without reporting a successful build. `build.bat /s`, `build.bat --silent`, or `SILENT=1` never prompts, pauses or launches anything and works without administrator rights. No machine security settings or persistent PATH values are changed.

The entrypoint detects compatible Node.js (20+) and Git (2+). If either is missing, it downloads the pinned portable release from its publisher, verifies committed archive and executable SHA-256 hashes, installs in `%LOCALAPPDATA%\SampleWorkbench\tools`, verifies the executable, and continues. Valid installed tools and verified caches are reused. Network/download, checksum, consent and test failures return nonzero. The explicit tool inventory and upstream checksum sources are in `scripts/build-tools.json`; Windows PowerShell 5.1 and .NET ZIP support are built-in host requirements. No third-party project packages are needed. Adding packages requires updating the locked bootstrap inventory rather than silently installing unpinned packages.

Build phases run in order: dependencies, all tests, source checks, static build. On other platforms, with Node.js 20+ and Git already available, the equivalent development checks are:

```sh
npm test
npm run check
npm run build
```

After a successful interactive build, answer **y** to run: the built-in server chooses a free loopback port, opens its actual URL in your browser, and stays running until Ctrl+C. Silent builds never prompt or launch. You can also run `node scripts/serve.mjs` from the project root (default `http://127.0.0.1:8080`). Set `PORT` to choose a port; only explicit `HOST=0.0.0.0` enables a container bind, and no firewall setting is changed. The server rejects traversal and symbolic links. Build output is self-contained; no CDN is required. Source and build provenance are displayed on the initial screen. The build records the source commit's timestamp, not the visitor's launch time. A dirty build is for development, not release evidence.

`build-installer.bat` exits **2 (not applicable)**: this browser-only project has no supported installable desktop target. It produces no fake package, performs no installation, and does not publish, tag or push. Building the website does not prove native delivery.

PowerShell parser and offline archive-safety tests are separate from Windows runtime proof. Fresh Windows download/install, UAC acceptance/cancellation and `.bat` execution must be verified on a Windows host before claiming this entrypoint's runtime acceptance.

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
