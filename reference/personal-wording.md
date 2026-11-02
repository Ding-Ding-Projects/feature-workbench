# Personal wording JSON compatibility

The sample accepts the same version-1 interchange contract as the reference browser extension. This is a local file format, not a server upload.

## Shape

The root has exactly two fields: `schemaVersion` equal to the integer `1`, and `entries`, an object whose keys and values are strings. An empty `entries` object is valid. The application ships no mappings. Unknown root fields and unsupported versions are rejected, not silently discarded or migrated.

## Validation

- Maximum original payload: 256 KiB of UTF-8, inclusive. UTF-8 decoding is fatal on invalid bytes; an initial UTF-8 byte-order mark is accepted.
- Maximum JSON depth: 8.
- Keys: at most 160 Unicode code points; values: at most 1,000 Unicode code points.
- Duplicate keys, including escaped equivalents, are rejected.
- Unsafe object keys are rejected.
- Replacement strings cannot contain forbidden control characters. Tab, line feed and carriage return remain permitted.
- The validated compact serialization must also fit the 256 KiB bound.

Validation is all-or-nothing. Invalid imports do not replace the previous valid local cache. The cache is revalidated on load. Clear removes it and restores shipped wording.

## Privacy

Parsing, applying and caching happen in the visitor's browser. The application does not transmit the file, its filename or its path. Workspace backups and history exclude the wording cache and file metadata. There is no personal-wording export action. An internal serializer exists only for validation and semantic roundtrip tests.

## Evidence and limits

The neutral synthetic validation suite and independent differential comparisons are described in [verification](verification.md). Browser testing observed immediate application, reload persistence, invalid duplicate-key rejection and clearing. These results do not claim every extension-specific page integration or replacement context has been reproduced. Protected code, URLs, identifiers and user-authored records must remain literal.
