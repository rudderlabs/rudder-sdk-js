# CDN build metadata

`scripts/build-metadata.mjs` writes deterministic `build-metadata.json` files:

Each modern and legacy CDN output folder has its own `build-metadata.json` with
`variant` set to `modern` or `legacy`; the file deploys with that folder.

Modern example (`dist/cdn/modern/iife/build-metadata.json`):

```json
{
  "schemaVersion": 1,
  "package": { "name": "@rudderstack/analytics-js", "version": "3.36.0" },
  "variant": "modern",
  "files": { "rsa.min.js": { "integrity": "sha384-...", "size": 123 } }
}
```

Legacy example (`dist/cdn/legacy/iife/build-metadata.json`):

```json
{
  "schemaVersion": 1,
  "package": { "name": "@rudderstack/analytics-js", "version": "3.36.0" },
  "variant": "legacy",
  "files": { "rsa.min.js": { "integrity": "sha384-...", "size": 456 } }
}
```

Paths are relative, sorted, and use `/`. Integrity hashes the final bytes on disk;
size is the byte count. There are no timestamps. Future metadata fields may be
added at the top level or per file; readers **must ignore unknown fields**.
Integrity is one field in a generic build metadata format. No runtime reader or
JS bundle changes are introduced.

## Final writers

- Core: the CDN Rollup config's sequential, post-order `writeBundle`
  hook, after the sole output in `dist/cdn/{legacy,modern}/iife`. Dynamic custom
  and NPM builds write elsewhere and do not write this metadata. Development,
  start/watch and lite builds writing into these CDN directories run the hook too.
- Plugins: the CDN config's sequential, post-order `writeBundle` hook, after the
  sole output in `dist/cdn/{legacy,modern}/plugins`, including federation remote
  entry, shared chunks and maps. The subsequent declaration build writes outside
  this directory. Development and start/watch builds run the same hook. Deploy
  ships only the modern plugins directory.
- Integrations: `integrationBuildScript.js`, once all child builds succeed, in
  `dist/cdn/{legacy,modern}/js-integrations`. Each child invalidates any old
  metadata at build start, so failed or single-integration builds cannot leave
  a misleading complete inventory. Child builds never write metadata.
  The 83 integrations build as separate parallel Rollup processes into one folder,
  so a per-config write hook would race on the shared file. The orchestrator writes
  once after all children succeed.
- Loaders: every loader output's `writeBundle` hook updates
  `dist/build-metadata.json` with `variant: null`. Minified and unminified builds
  can run independently and in any order, including development/start builds
  that overwrite unminified loaders with `dev-snapshot` bytes. No combined Nx
  target is added.

## Inventory rule

Core/plugins/loaders use Rollup's emitted file set (including maps/federation
assets). Each output upserts its own entries into existing metadata for the same
package version and variant. Every write re-hashes every other listed entry
against disk and drops it if the file is missing or its hash or size no longer
matches; unchanged entries survive even if this build no longer emits them.
Metadata is accurate for the listed files on disk at the last write. Release
builds start clean, so obsolete maps and plugin chunks cannot enter the release
inventory. Development outputs previously emitted into a directory can remain
listed until a clean build; unrelated leftovers are never discovered by scanning.
Writes are atomic. Rollup configs in one process run sequentially, so no locks
are needed. Integrations write once after all parallel children succeed, using
the registered integration names with the two files emitted by each production
CLI build (`.min.js` and `.min.js.map`). Missing emitted files fail the build;
extra files in dist are ignored and are never added by scanning the directory.

Loaders record only the outputs built so far from deploy.yml's four-file
allowlist: `loader.js`, `loader.min.js`, `loader-gtm.js`, `loader-gtm.min.js`.
Other loader `dist` files (including `dts` and dev server HTML) are ignored.
Loader metadata is generated locally; the existing explicit loader upload loops
do not publish it. Recursive uploads for the other packages include metadata
automatically. Metadata itself is outside this build-time inventory.
Deployment archives and listing HTML created by deploy.yml after the build are intentionally excluded from build metadata; the SDK-6089 release manifest covers deploy-time files.

Nx configuration and caching are unchanged (SDK-6095 tracks caching separately).
Builds that concurrently write the same output directory are unsupported, as
before; run complete builds sequentially within each directory.

## Verification

- `npm run test:build-metadata`: fast helper unit tests, also run in CI.
- `npm run test:build-metadata:build`: opt-in local/release check. Deletes the four
  packages' CDN outputs (loader `dist`), builds both variants with existing npm
  scripts, checks partial-integration invalidation, loader build order and stale
  entry pruning, verifies production-to-development loader overwrites and retained
  core development outputs, and checks emitted
  file sets and every SHA-384 hash and size. No Nx cache or cold full build
  is added to CI. Build logs: system temporary directory's
  `sdk-6103-build-metadata-build.log`.
