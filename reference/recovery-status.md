# Verified public-source restart

This checkout continues the publicly retained `5c0faa0` source, preserving its Material 3 Expressive design and 114-row inventory. It does not contain or claim recovery of later unpublished work from a previous execution workspace. Historical results for that unavailable source are not acceptance evidence for this revision.

The retained baseline ran 203 tests: 202 passed, none failed, and one PowerShell-dependent check was skipped because PowerShell is unavailable in the current environment. The first rebuilt change opts out of PowerShell telemetry before launching the version probe, parser or offline test process, and before the Windows build launcher starts PowerShell. Node-only tests verify child environment inheritance without printing the environment.

With that change, 205 tests ran: 204 passed, none failed, and the same PowerShell-dependent check was skipped. Syntax checks and static packaging passed. Actual Windows UAC, dependency installation and native runtime behavior remain unverified here.

The startup configuration follows [Microsoft's documented telemetry opt-out](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_telemetry?view=powershell-7.5). No machine-wide settings or network security controls are changed.

The requirement inventory remains incomplete. Documentation, rendered controls, source checks and aggregate test counts do not establish every contract's acceptance. Subsequent changes must carry their own current-source evidence and preserve the designer's incoming work.
