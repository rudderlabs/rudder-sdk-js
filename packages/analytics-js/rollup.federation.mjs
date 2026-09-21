/**
 * Placeholder origin that a base path without one of its own is parsed against, so that a single
 * code path normalises both an absolute and a relative base path. It is stripped again before the
 * value is returned, and it sits on the reserved `.invalid` TLD so that it could never resolve if
 * it ever leaked.
 */
const RELATIVE_BASE_ORIGIN = 'https://remote-plugins.invalid';

/**
 * Parses a base path into a URL and says whether it was relative.
 *
 * Every base path in this file goes through here, so no consumer has to decide for itself what
 * part of a URL a string operation is landing on. Returns `null` for a value that is not a URL
 * at all: `assertRemotePluginsBasePath` rejects that for the module federated build, and every
 * other build, which does not use the value, is left to build.
 *
 * @param {string} basePath Raw base path
 * @returns {{ url: URL, isRelative: boolean } | null} The parsed base path, or null
 */
const parseBasePath = basePath => {
  try {
    return { url: new URL(basePath), isRelative: false };
  } catch {
    // Not an absolute URL, so try it as a path against a placeholder origin below.
  }

  try {
    return { url: new URL(basePath, RELATIVE_BASE_ORIGIN), isRelative: true };
  } catch {
    return null;
  }
};

/** Reassembles a parsed base path, dropping the placeholder origin from a relative one. */
const serialiseBasePath = ({ url, isRelative }) =>
  isRelative ? `${url.pathname}${url.search}${url.hash}` : url.href;

/**
 * Normalises a build time base path to end in a slash.
 *
 * An unset `REMOTE_MODULES_BASE_PATH` falls back to the given default, while an explicitly empty
 * one stays empty: appending a trailing slash to it would turn "no base path" into the bare path
 * `/`, which composes into a URL that resolves against the host page instead of being rejected.
 *
 * The slash goes on the pathname, not the end of the raw string. A base path may legitimately
 * carry a query or a fragment, and `https://cdn.example/plugins?sig=abc` normalised by string
 * append becomes `https://cdn.example/plugins?sig=abc/`, which puts the separator inside the
 * signature rather than on the path. Both consumers of this value read it as a directory, so
 * both inherited that.
 *
 * @param {string | undefined} envValue Value of `REMOTE_MODULES_BASE_PATH`
 * @param {string} defaultBasePath Base path to use when the environment does not set one
 * @returns {string} The normalised base path, empty when there is none
 */
const getRemotePluginsBasePath = (envValue, defaultBasePath) => {
  const basePath = envValue ?? defaultBasePath;

  if (!basePath) {
    return '';
  }

  const parsed = parseBasePath(basePath);

  if (!parsed) {
    return basePath;
  }

  const { url } = parsed;
  url.pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;

  return serialiseBasePath(parsed);
};

/**
 * Resolves the base path the dev server page is given.
 *
 * `rollup.config.mjs` serves two consumers that want different shapes from the same idea. The
 * federation fallback wants the plugins directory, which is what `REMOTE_MODULES_BASE_PATH` now
 * means and what both deploy workflows set it to. The dev server page appends
 * `<variant>/plugins` to whatever it is handed, so it wants the parent of that directory, and
 * feeding it the directory appended it twice (`.../modern/plugins/modern/plugins`), which then
 * won over the fallback. The two are therefore derived separately rather than one being reshaped
 * into the other. `BASE_CDN_URL` remains the knob for pointing the dev server somewhere else.
 *
 * @param {string} baseCdnUrl CDN origin the build targets
 * @returns {string} The normalised parent path of the plugins directory
 */
const getDevServerPluginsBasePath = baseCdnUrl =>
  getRemotePluginsBasePath(undefined, `${baseCdnUrl}/v3`);

/**
 * Resolves the base path the module federation fallback URL is composed from.
 *
 * The deploy workflow passes the plugins directory itself, so the default carries the build
 * variant and the directory too. A default of just `<cdn>/v3` is what baked
 * `https://cdn.rudderlabs.com/v3//rsa-plugins.js` into the shipped artifact: no variant segment
 * and no plugins directory, pointing at a file that was never published there.
 *
 * @param {string | undefined} envValue Value of `REMOTE_MODULES_BASE_PATH`
 * @param {string} baseCdnUrl CDN origin the build targets
 * @param {string} variantSubfolder Build variant segment, `/legacy` or `/modern`
 * @returns {string} The normalised base path, empty when there is none
 */
const getRemotePluginsFallbackBasePath = (envValue, baseCdnUrl, variantSubfolder) =>
  getRemotePluginsBasePath(envValue, `${baseCdnUrl}/v3${variantSubfolder}/plugins`);

/**
 * Fails the build when the remote plugins fallback base path is not something a working URL can
 * be composed from.
 *
 * The check lives at build time on purpose. The generated expression falls back to this path
 * whenever `pluginsCDNPath` is not exposed, so a runtime guard after that fallback can never be
 * reached and would be dead code in every artifact. An artifact that cannot name where its
 * plugins live should not be produced at all, so the build stops here instead.
 *
 * Only structural defects are rejected: an empty path, one that is not an absolute URL, one that
 * is not served over http or https, and one carrying an empty path segment, which is how
 * `https://cdn.rudderlabs.com/v3//rsa-plugins.js` came to ship. A custom host that does not follow
 * the `<variant>/plugins` convention is a deliberate deployment choice and still builds.
 *
 * `new URL()` also accepts `file:`, `data:` and every other scheme, none of which a browser can
 * import a federated remote from. The runtime rejects the same thing one layer down: the
 * `pluginsUrl` load option goes through `isValidURL`, whose `URL_PATTERN` is anchored on
 * `^(https?:\/\/)`. The build time check mirrors that protocol rule rather than inventing a third
 * one, so the two ends of the same path agree on what a plugins host may be.
 *
 * Only the module federated build composes this path into an artifact. The legacy, bundled, lite
 * and dynamic builds never load a remote, and `REMOTE_MODULES_BASE_PATH` is documented as
 * optional, so an explicitly empty one must not stop a build that would not have used it.
 *
 * @param {string} basePath Normalised base path
 * @param {boolean} isModuleFederatedBuild Whether the build composes a remote entry URL
 * @returns {string} The same base path, when the build can use it
 */
const assertRemotePluginsBasePath = (basePath, isModuleFederatedBuild) => {
  if (!isModuleFederatedBuild) {
    return basePath;
  }

  const hint = 'Set REMOTE_MODULES_BASE_PATH to the directory the remote plugins are served from.';

  if (!basePath) {
    throw new Error(`The remote plugins base path resolved to an empty value. ${hint}`);
  }

  let parsed;
  try {
    parsed = new URL(basePath);
  } catch {
    throw new Error(`The remote plugins base path "${basePath}" is not an absolute URL. ${hint}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `The remote plugins base path "${basePath}" is not served over http or https. ${hint}`,
    );
  }

  if (parsed.pathname.includes('//')) {
    throw new Error(
      `The remote plugins base path "${basePath}" contains an empty path segment. ${hint}`,
    );
  }

  return basePath;
};

/**
 * Composes the remote entry URL the build bakes in as the fallback.
 *
 * The file name belongs on the path, so it is appended to the parsed pathname rather than
 * concatenated onto the raw base path. Concatenation gets a whole class of valid base paths
 * wrong at once: a query swallows the file name (`...?sig=abc/rsa-plugins.js`), a fragment hides
 * it entirely, and a trailing slash composes a double one. Parsing the URL once and setting its
 * pathname removes all three together, instead of growing one string rule per symptom. It shares
 * `parseBasePath` with the normaliser so both ends of this path treat a URL as a URL.
 *
 * @param {string} basePath Validated base path, empty when there is none
 * @param {string} exportsFilename Remote entry file name without the extension
 * @returns {string} The remote entry URL, empty when there is no base path
 */
const getRemotePluginsFallbackURL = (basePath, exportsFilename) => {
  if (!basePath) {
    return '';
  }

  const parsed = parseBasePath(basePath);

  if (!parsed) {
    return basePath;
  }

  const { url } = parsed;
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/${exportsFilename}.js`;

  return serialiseBasePath(parsed);
};

/**
 * Escapes `$` so an interpolated value cannot be read as a `String.replace` substitution pattern.
 *
 * The emitted expression composes the runtime URL with `replace`, which gives `$` a meaning of
 * its own in the replacement string. Serialising with `JSON.stringify` makes the value a valid
 * string literal but not an inert replacement, so the two escapes are both needed.
 *
 * @param {string} value Value interpolated into a replacement string
 * @returns {string} The same value, inert as a replacement pattern
 */
const escapeReplacementPattern = value => value.replace(/\$/g, '$$$$');

/**
 * Builds the expression that resolves the module federation remote plugins entry URL.
 *
 * The expression is injected verbatim into the generated bundle as the remote's
 * `externalType: 'promise'` value, so it has to be a self-contained expression that evaluates to
 * a promise of the remote entry URL.
 *
 * Its two halves resolve the same URL by different means, and deliberately so. The build time
 * fallback is composed with `URL` in Node, where the constructor is trusted. The runtime half
 * cannot use it: `pluginsCDNPath` comes from the page, and `globalThis.URL` is precisely the
 * built-in SDK-5499 saw a page overwrite with a string and SDK-5494 removed load path dependencies
 * on. It splits any query or fragment off with a regex instead, so the file name lands on the path
 * in both halves without the loader depending on a built-in that may be missing or hostile. It is ES5 syntax apart from `Object.assign` and
 * `Object.create`, and it is emitted only for non legacy builds, whose browserslist requires
 * dynamic `import()` and therefore has both.
 *
 * `pluginsCDNPath` is exposed on `window.RudderStackGlobals` under the analytics instance key,
 * which is configurable, so every instance is searched for it instead of reading the default
 * `app` key only. The base path is the build time fallback, and it is trailing slash normalised
 * before the file name is appended so the two cannot compose into a double slash.
 *
 * The default `app` key is read before the scan. A scan alone takes whichever instance happens
 * to be enumerated first, so two instances exposing different paths would resolve the remote
 * against an arbitrary one of them. Reading `app` first makes the result depend on the value
 * rather than on object insertion order. `PluginsManager` writes only under `app` today, so this
 * is determinism, not a live fix.
 *
 * The scan reads own properties only, at both levels. `RudderStackGlobals` and the instances
 * under it are ordinary objects, so a dependency that pollutes `Object.prototype` with an
 * enumerable `pluginsCDNPath`, or with an `app` carrying one, would otherwise be read as an
 * exposed path and the remote fetched from wherever it pointed. `Object.keys` enumerates own
 * keys, and copying each object onto a null prototype before reading `pluginsCDNPath` keeps the
 * read off the prototype chain, which the key check alone would not. That is the same posture
 * `PROTOTYPE_POLLUTION_KEYS` takes in `customContext`.
 *
 * Both build time values are serialised with `JSON.stringify` rather than wrapped in quotes by
 * hand. This is code generation, so a value carrying a quote of its own would otherwise close
 * the literal early and emit a bundle that does not parse; a path such as
 * `https://cdn.example.test/o'brien/plugins/` is a perfectly valid URL and the protocol check
 * above has no reason to reject it.
 *
 * @param {string} basePath Validated build time fallback base path
 * @param {string} exportsFilename Remote entry file name without the extension
 * @returns {string} The expression source
 */
const getRemotePluginsHostPromise = (basePath, exportsFilename) =>
  `(function () {
  var ownProperties = function (value) {
    return Object.assign(Object.create(null), value);
  };
  var instances = ownProperties(window.RudderStackGlobals);
  var cdnPath = ownProperties(instances.app).pluginsCDNPath;

  Object.keys(instances).forEach(function (instanceKey) {
    cdnPath = cdnPath || ownProperties(instances[instanceKey]).pluginsCDNPath;
  });

  return Promise.resolve(cdnPath ? cdnPath.replace(/\\/*(\\?|#|$)/, ${JSON.stringify(`/${escapeReplacementPattern(exportsFilename)}.js$1`)}) : ${JSON.stringify(getRemotePluginsFallbackURL(basePath, exportsFilename))});
})()`;

export {
  getDevServerPluginsBasePath,
  getRemotePluginsBasePath,
  getRemotePluginsFallbackBasePath,
  assertRemotePluginsBasePath,
  getRemotePluginsFallbackURL,
  getRemotePluginsHostPromise,
};
