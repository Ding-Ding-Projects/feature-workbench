# Process and delivery verification

This is an evidence audit, not a completion certificate. It covers 30 process/documentation requirements and 10 external-service requirements. A feasible next step is not a blocker; conditional requirements are not completed features. This document intentionally contains only independent public product descriptions.

## Audit boundary

- Baseline inspected: `b98d433` (2026-11-02). Later integration changes require rechecking affected rows.
- Read-only GitHub metadata: public repository, matching About/Pages homepage, legacy `gh-pages` source, built deployment, zero repository self-hosted runners, no releases, Discussions disabled.
- Project listing failed for missing `read:project`; no credentials were read, printed, created or expanded. No external recipients were contacted.
- Workflow-scope rejection is inherited verified delivery evidence from the integration owner; it was not retried.
- Historical screenshots remain historical. No new recording, native run, service integration or full interaction matrix is claimed.

## Verification commands

```sh
node --test tests/process-verification.test.mjs
node scripts/source-count.mjs HEAD
```

The counter uses committed blobs rather than a dirty worktree. Its default attribution is unknown: supply an explicit reviewed author-role mapping outside this public repository to classify authors. Names and email addresses never appear in its output. Line counts and illustrative time arithmetic are not release proof.

## Requirements

### job-experience-document-label
**Status: conditional.** No employment-document workflow exists. If introduced, use the default product label and persistent restoration switch without changing user files or API identities.

### forge-publishing
**Status: blocked.** Repository CLI authentication enables this task delivery, not product multi-account publishing. The product requires real account selection/sign-in, account-scoped OS credential storage, sign-out/refresh and verified publication/fallback readback. A static browser has no such trusted host adapter.

### product-evidence
**Status: open.** One historical inspected capture exists. Complete current built-surface, dialog, error, narrow and theme captures and source-controlled workflow diagrams remain required. Refresh references after interface changes; retain historical originals.

### screen-recording
**Status: open.** No genuine end-to-end renderer recording is retained. Record only the application renderer, inspect the complete recording for privacy, and bind it to source and artifact; a scenario script is not video evidence.

### design-folder
**Status: open.** No reviewed design-input archive exists. Store design inputs and revisions under design/ with provenance; a prototype is not shipped behavior.

### responsive-layout-matrix
**Status: open.** Full matrix not exercised. Cover three language modes, two tone extremes, both themes, narrow/desktop widths, high scale, keyboard/pointer input and reduced motion. Record actual dimensions and results.

### public-evidence-gallery
**Status: open.** A historical image is tracked, but no complete current published gallery is verified. Review genuine captures and safe metadata, publish within the authorized project, then fetch and inspect every live image. No new service account is inherently required.

### installer-download-button
**Status: conditional.** There is no verified native installer or release asset. Keep a native download button absent until its exact immutable asset resolves and has been verified. Static website output is not an installer.

### homepage-link
**Status: partial.** Read-only GitHub API confirmed the public repository About homepage equals its legacy Pages URL and Pages reports built on 2026-11-02. Final source-bound live page and asset validation must follow every new deployment.

### status-hub
**Status: blocked.** No verified owned Hub endpoint/enrollment configuration has been established for this product. Needs host registration, projection readback and actual inbox polling before claiming delivery. Implementing a local status label does not satisfy this.

### discord-status-bridge
**Status: blocked.** Requires an owned Hub deployment and separately owner-registered read-plus-reply bridge credential, distinct from enrollment credential. Credentials remain host-side, readback presence-only. A real reply must arrive through the ordinary session inbox; no messages were sent in this audit.

### panic-webhooks
**Status: blocked.** Requires an owned Hub and verified owner-managed receivers. Before delivery, implement fixed-schema confirmed-event handling, ordered independent destinations, idempotency, and fail-closed redirect/DNS-rebinding/SSRF limits. No receiver was contacted or credential created.

### tidbyt-displays
**Status: suspended.** Agent event display reporting is suspended; absent frames are not a blocker and this task must not activate reporting. Any independently requested product display implementation still needs an owned target and real evidence.

### dependency-fetcher
**Status: partial.** Pinned Windows portable bootstrap and offline archive-safety tests exist. Standalone root fetchers, cold/warm Windows acquisition, cancellation, UAC and silent runtime evidence remain outstanding; do not infer them from parser tests.

### app-icon
**Status: open.** A coherent tracked master and validated target icon derivatives need built-output inspection. Native executable/installer icons require a real native packaging target.

### release-workflow
**Status: blocked.** Custom workflow publication was rejected for missing workflow scope. Do not retry without new authorization/evidence. Built-in Pages publication is not a native release. The release route must build/package/publish one unique non-draft release without test/lint gating; report local checks separately.

### release-timing
**Status: open.** No releases exist. A future release must record actual first-job start, final publication completion and consistent UTC duration, not estimated timestamps.

### release-line-counts
**Status: partial.** The source counter in scripts/source-count.mjs reads an exact tracked revision, separates categories and exclusions, and reports explicit attribution uncertainty. Release-pipeline integration and a published release report remain outstanding.

### ci-bootstrap
**Status: blocked.** No authorized custom workflow is published. An eventual workflow needs a declared job/tool inventory, clean-cache execution and always-upload safe diagnostics without masking the original failure.

### runner-selection
**Status: partial.** Read-only repository runner inventory returned zero self-hosted runners on 2026-11-02. Do not queue work on invented labels. Select an available pinned hosted platform before authorized dispatch; no Windows run is claimed.

### encrypted-public-builder
**Status: not-applicable.** This repository is public source. Private-source encrypted build routing is conditional on private source and must not be fabricated here.

### tabbed-readme
**Status: open.** First-reader build/privacy essentials exist, but full visible index, collapsible references and accurate contribution/license/security/conduct tabs are not complete. Do not invent a license grant.

### human-time-estimate
**Status: partial.** The source counter derives a labeled illustrative range using the same count and explicit rate. It is not measured effort. README numbers must be refreshed from a real published release, not a development count.

### sanitized-instruction-copy
**Status: open.** A full reviewed neutral instruction mirror is not present. Never copy private locations, accounts, addresses, vocabulary or source payloads into this public repository.

### agents-md-vocabulary-block
**Status: open.** The approved term-free communication-discipline block requires byte-exact private-side verification and leak scanning before publication. This audit deliberately does not substitute an invented block.

### vocabulary-hash-lock
**Status: open.** No build/pre-push private-source currency gate is installed. Keep terms and expected digest outside public source; missing private input must explicitly skip, whereas present stale input must fail closed. This proves currency, not use of wording.

### roadmap-checklist
**Status: partial.** A scope roadmap exists; root milestone checklist and evidence-backed updates remain required. Do not tick features based on documentation or registry presence.

### feature-docs
**Status: partial.** Generated reference coverage exists, but each feature needs maintained category-indexed Markdown covering behavior, configuration, failures, security and verification; documentation coverage is not implementation proof.

### postman-collections
**Status: conditional.** The current product exposes no HTTP application API. The loopback static file server is not a business API. When host/service APIs are added, create category and master collections and document authentication without embedding credentials.

### wiki-documentation-sync
**Status: open.** No remote wiki publication verified. Keep tracked full documentation and wiki source in sync, validate links, then read back the authorized remote update without recursive commits.

### handoff-record
**Status: open.** Final exact-source handoff and verified remote issue section belong to integration closeout. Include changed scope, actual checks, unresolved work, blockers and next owner.

### closeout-prompt
**Status: open.** Integration must commit a current copy-ready root continuation record, sanitize it, push the owning branch and verify the exact remote ref. This audit is not final delivery proof.

### discussion-records
**Status: open.** Read-only repository metadata reports Discussions disabled. This is configuration, not proof of insufficient permission. Before an authorized enable/create action, inventory categories and existing records; maintain one task record and deduplicated release announcements without altering user-managed pins.

### project-board
**Status: blocked.** The authenticated read-only project listing failed: missing read:project scope. No scope expansion or retry performed. Repository work can continue; selecting/creating/updating a project requires authorized access and an exact target. Never mark Done before delivery evidence.

### operational-skill
**Status: open.** A reusable operational skill must describe routes actually exercised and pass skill validation. This checklist is not an installed or validated skill.

### readme-prompt-banner
**Status: not-applicable.** Applies to an instruction-authoring repository, not this consumer sample. Do not publish private prompts here.

### canonical-portable-editions
**Status: not-applicable.** Instruction-authoring export formats are outside this consumer repository. Do not generate private instruction editions as public artifacts.

### project-profile
**Status: conditional.** Project memory profiles belong in their owning memory system. This public consumer does not create or mirror private project snapshots.

### roblox-model-catalogue
**Status: not-applicable.** This is not a native game. If a game is introduced, licensed model acquisition, an actual integration ledger and native interaction evidence are required.

### roblox-visual-realism
**Status: not-applicable.** No native game world exists. Browser illustrations cannot prove native object form, contact, support or operation.

## Release evidence checklist

- [ ] Exact clean source revision and artifact digest recorded; remote main readback matches intended source.
- [ ] Tests/checks actually run recorded separately from release automation.
- [ ] Built workflow interactions, current capture metadata and complete renderer recording inspected.
- [ ] Every current image reference checked for stale source/artifact; historical originals retained.
- [ ] Required native/host flows exercised on a supported owned target, or explicitly blocked.
- [ ] Immutable release assets downloaded and verified; actual workflow timing and source counts recorded.
- [ ] Public leak scan passes before transmission; final handoff and continuation record stored and read back.

Do not tick these boxes from the existence of this file or a green structural test.
