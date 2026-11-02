# Architecture and boundaries

## Product surfaces

The workspace is productive software: create and manage visitor-owned tasks, change presentation preferences, resume onboarding, and recover local changes. The separate Guide route teaches real workflows using visitor-controlled examples and progress. Neither is a substitute for an installed desktop runtime.

## Browser runtime

The static browser layer owns its own local data. It may use browser download and storage capabilities but cannot verify native installations, edit operating-system preferences, store credentials in a native keychain, or operate processes. Such actions need an authenticated, explicitly authorized native adapter with truthful error and cancellation results.

No mock adapter reports success. Native-only obligations remain incomplete until the actual adapter, build artifact, interaction evidence and captures exist. Adding a button or a registry entry is not delivery.

## State boundaries

Workspace state and settings can be exported only through a validated allowlist. Personal wording is held in a separate local cache, revalidated on every load, and excluded from exports and history. File paths and names are never cached. Invalid imports leave the last valid state intact.

## Evidence model

Feature rows distinguish source implementation, focused tests, browser runtime interaction and visual capture. No row is accepted solely from source inspection. The immutable required-ID list detects disappearance of an entire feature. Negative tests remove rows and evidence and require failure.

## Deliberate limitations

Native installation, updater and build companion delivery require a supported host and release pipeline. Universal cross-application settings need a shared native record and watcher, not browser storage. Full advanced regular-expression editing needs an independently bounded evaluation engine. Genuine framework component provenance requires an approved component dependency. These limitations are tracked, not disguised as completed equivalents.
