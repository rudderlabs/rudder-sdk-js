import { readFileSync } from 'fs';
import { join } from 'path';
import {
  getDevServerPluginsBasePath,
  getRemotePluginsBasePath,
  getRemotePluginsFallbackBasePath,
  assertRemotePluginsBasePath,
  getRemotePluginsFallbackURL,
  getRemotePluginsHostPromise,
} from '../rollup.federation.mjs';

const EXPORTS_FILENAME = 'rsa-plugins';
const BASE_CDN_URL = 'https://cdn.rudderlabs.com';
const VARIANT_SUBFOLDER = '/modern';
const DEPLOY_BASE_PATH = `${BASE_CDN_URL}/3.x.x/modern/plugins`;

/**
 * The default is read from the build helper rather than restated here, so a regression in the
 * baked default cannot slip past a test carrying its own copy of the expected value.
 */
const DEFAULT_BASE_PATH = getRemotePluginsFallbackBasePath(
  undefined,
  BASE_CDN_URL,
  VARIANT_SUBFOLDER,
).replace(/\/+$/, '');

/**
 * Every `REMOTE_MODULES_BASE_PATH` a build can actually be produced with. An earlier version of
 * this suite reached the unresolvable branch by handing the expression a raw `''` that
 * `rollup.config.mjs` could never emit, so the assertion passed here while the code it covered
 * was dead in every shipped artifact. The build configurations are therefore enumerated rather
 * than invented, and each one is driven through the same composition the build uses.
 */
const BUILD_CONFIGURATIONS: [string, string | undefined, string][] = [
  ['REMOTE_MODULES_BASE_PATH unset', undefined, `${DEFAULT_BASE_PATH}/`],
  ['REMOTE_MODULES_BASE_PATH empty', '', ''],
  ['REMOTE_MODULES_BASE_PATH set by the deploy workflow', DEPLOY_BASE_PATH, `${DEPLOY_BASE_PATH}/`],
];

/** Composes the fallback base path exactly as `rollup.config.mjs` does. */
const composeBasePath = (envValue: string | undefined) =>
  getRemotePluginsFallbackBasePath(envValue, BASE_CDN_URL, VARIANT_SUBFOLDER);

/**
 * Composes the remote entry expression exactly as `rollup.config.mjs` does, then evaluates it
 * the way the generated `remotesMap` does (`url: () => <expression>`).
 */
const resolveRemoteEntryURL = (envValue?: string): Promise<string> =>
  // eslint-disable-next-line no-eval
  (0, eval)(getRemotePluginsHostPromise(composeBasePath(envValue), EXPORTS_FILENAME));

describe('Module federation remote plugins base path', () => {
  it.each(BUILD_CONFIGURATIONS)(
    'should normalise the base path with %s',
    (_l, envValue, expected) => {
      expect(composeBasePath(envValue)).toBe(expected);
    },
  );

  it('should not turn an empty base path into a bare slash', () => {
    expect(composeBasePath('')).not.toBe('/');
  });

  it('should fail the build when the base path resolves empty', () => {
    expect(() => assertRemotePluginsBasePath(composeBasePath(''), true)).toThrow(
      /resolved to an empty value/,
    );
  });

  it('should fail the build when the base path is not an absolute URL', () => {
    expect(() => assertRemotePluginsBasePath('/', true)).toThrow(/not an absolute URL/);
  });

  it('should fail the build when the base path carries an empty path segment', () => {
    expect(() => assertRemotePluginsBasePath(`${BASE_CDN_URL}/v3//`, true)).toThrow(
      /empty path segment/,
    );
  });

  it('should accept the base paths the shipped build configurations produce', () => {
    expect(assertRemotePluginsBasePath(composeBasePath(undefined), true)).toBe(
      `${DEFAULT_BASE_PATH}/`,
    );
    expect(assertRemotePluginsBasePath(composeBasePath(DEPLOY_BASE_PATH), true)).toBe(
      `${DEPLOY_BASE_PATH}/`,
    );
  });

  it.each(['file:///tmp/plugins/', 'data:text/javascript,', 'ftp://cdn.example.test/plugins/'])(
    'should fail the build when the base path is not served over http(s): %s',
    basePath => {
      expect(() => assertRemotePluginsBasePath(basePath, true)).toThrow(/not served over http/);
    },
  );

  it.each(['http://localhost:3000/plugins/', `${DEPLOY_BASE_PATH}/`])(
    'should accept an http(s) base path: %s',
    basePath => {
      expect(assertRemotePluginsBasePath(basePath, true)).toBe(basePath);
    },
  );

  it('should not check the base path for a build that is not module federated', () => {
    expect(() => assertRemotePluginsBasePath(composeBasePath(''), false)).not.toThrow();
    expect(assertRemotePluginsBasePath(composeBasePath(''), false)).toBe('');
    expect(() => assertRemotePluginsBasePath('file:///tmp/plugins/', false)).not.toThrow();
  });
});

describe('Module federation remote plugins host promise', () => {
  beforeEach(() => {
    delete (window as any).RudderStackGlobals;
  });

  it('should resolve the remote entry from the default analytics instance key', async () => {
    (window as any).RudderStackGlobals = {
      app: { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins' },
    };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      'https://www.dummy.url/3.x.x/modern/plugins/rsa-plugins.js',
    );
  });

  it('should resolve the remote entry from a non-default analytics instance key', async () => {
    (window as any).RudderStackGlobals = {
      'dummy-write-key': { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins' },
    };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      'https://www.dummy.url/3.x.x/modern/plugins/rsa-plugins.js',
    );
  });

  it('should prefer the default analytics instance key over any other exposed path', async () => {
    (window as any).RudderStackGlobals = {
      'dummy-write-key': { pluginsCDNPath: 'https://www.other.url/3.x.x/modern/plugins' },
      app: { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins' },
    };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      'https://www.dummy.url/3.x.x/modern/plugins/rsa-plugins.js',
    );
  });

  it('should not compose a double slash into the remote entry URL', async () => {
    (window as any).RudderStackGlobals = {
      app: { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins/' },
    };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      'https://www.dummy.url/3.x.x/modern/plugins/rsa-plugins.js',
    );
  });

  it('should emit a parsable expression when the baked base path carries a quote', async () => {
    (window as any).RudderStackGlobals = { app: {} };
    const basePath = "https://cdn.example.test/o'brien/plugins/";
    const source = getRemotePluginsHostPromise(basePath, EXPORTS_FILENAME);

    expect(() => new Function(`return ${source};`)).not.toThrow();
    await expect((0, eval)(source)).resolves.toBe(
      `https://cdn.example.test/o'brien/plugins/${EXPORTS_FILENAME}.js`,
    );
  });

  it('should emit a parsable expression when the remote entry file name carries a quote', async () => {
    (window as any).RudderStackGlobals = {
      app: { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins' },
    };
    const source = getRemotePluginsHostPromise(`${DEPLOY_BASE_PATH}/`, "rsa'plugins");

    expect(() => new Function(`return ${source};`)).not.toThrow();
    await expect((0, eval)(source)).resolves.toBe(
      "https://www.dummy.url/3.x.x/modern/plugins/rsa'plugins.js",
    );
  });

  it('should fall back to the baked URL when no analytics instance exposed a path', async () => {
    (window as any).RudderStackGlobals = { app: {}, 'dummy-write-key': { state: {} } };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      `${DEFAULT_BASE_PATH}/${EXPORTS_FILENAME}.js`,
    );
  });

  it.each(BUILD_CONFIGURATIONS.filter(([, envValue]) => envValue !== ''))(
    'should bake a well formed fallback URL with %s',
    async (_l, envValue) => {
      (window as any).RudderStackGlobals = { app: {} };

      const url = await resolveRemoteEntryURL(envValue);
      const { pathname } = new URL(url);

      // The defect this replaces shipped as https://cdn.rudderlabs.com/3.27.0//rsa-plugins.js:
      // a double slash, no build variant segment and no plugins directory.
      expect(pathname).not.toContain('//');
      expect(pathname).toContain('/modern/');
      expect(pathname).toContain('/plugins/');
      expect(url.endsWith(`/${EXPORTS_FILENAME}.js`)).toBe(true);
    },
  );
});

describe('Module federation remote plugins fallback URL', () => {
  /**
   * The file name belongs on the path, so it is composed onto the parsed pathname rather than
   * concatenated onto the raw string. Every case below is one a string concatenation gets wrong.
   */
  /**
   * Each row is a base path a string concatenation gets wrong, carried through BOTH consumers:
   * the shared normaliser and the fallback composer. Normalising the raw string was the defect
   * that survived the composer being fixed, so the round trip is asserted rather than the
   * composer alone.
   */
  const SHAPES: [string, string, string, string][] = [
    [
      'a query string',
      'https://cdn.example.test/plugins?sig=abc',
      'https://cdn.example.test/plugins/?sig=abc',
      'https://cdn.example.test/plugins/rsa-plugins.js?sig=abc',
    ],
    [
      'a fragment',
      'https://cdn.example.test/plugins#v1',
      'https://cdn.example.test/plugins/#v1',
      'https://cdn.example.test/plugins/rsa-plugins.js#v1',
    ],
    [
      'a query and a fragment',
      'https://cdn.example.test/plugins?sig=abc#v1',
      'https://cdn.example.test/plugins/?sig=abc#v1',
      'https://cdn.example.test/plugins/rsa-plugins.js?sig=abc#v1',
    ],
    [
      'a trailing slash',
      'https://cdn.example.test/plugins/',
      'https://cdn.example.test/plugins/',
      'https://cdn.example.test/plugins/rsa-plugins.js',
    ],
    [
      'no path at all',
      'https://cdn.example.test',
      'https://cdn.example.test/',
      'https://cdn.example.test/rsa-plugins.js',
    ],
    [
      'a quote in the path',
      "https://cdn.example.test/o'brien/plugins",
      "https://cdn.example.test/o'brien/plugins/",
      "https://cdn.example.test/o'brien/plugins/rsa-plugins.js",
    ],
    [
      'a relative base path with a query',
      '/local/plugins?sig=abc',
      '/local/plugins/?sig=abc',
      '/local/plugins/rsa-plugins.js?sig=abc',
    ],
  ];

  it.each(SHAPES)(
    'should normalise the base path onto its pathname with %s',
    (_l, raw, normalised) => {
      expect(getRemotePluginsBasePath(raw, 'https://cdn.example.test/unused')).toBe(normalised);
    },
  );

  it.each(SHAPES)(
    'should compose the remote entry onto the normalised path with %s',
    (_l, _raw, normalised, composed) => {
      expect(getRemotePluginsFallbackURL(normalised, EXPORTS_FILENAME)).toBe(composed);
    },
  );

  it.each(SHAPES)('should round trip both consumers with %s', (_l, raw, _normalised, composed) => {
    expect(
      getRemotePluginsFallbackURL(
        getRemotePluginsBasePath(raw, 'https://cdn.example.test/unused'),
        EXPORTS_FILENAME,
      ),
    ).toBe(composed);
  });

  it('should strip a repeated trailing slash when composing', () => {
    expect(
      getRemotePluginsFallbackURL('https://cdn.example.test/plugins///', EXPORTS_FILENAME),
    ).toBe('https://cdn.example.test/plugins/rsa-plugins.js');
  });

  it('should compose nothing when there is no base path', () => {
    expect(getRemotePluginsFallbackURL('', EXPORTS_FILENAME)).toBe('');
  });

  /**
   * `rollup.config.mjs` feeds two consumers that want different shapes: the federation fallback
   * wants the plugins directory, and the dev server page appends `<variant>/plugins` to what it
   * is given, so it wants the parent. Both deploy workflows now set `REMOTE_MODULES_BASE_PATH` to
   * the directory, so deriving the dev server value from it appended the directory twice.
   */
  it('should give the dev server the parent of the plugins directory', () => {
    const devServerBasePath = getDevServerPluginsBasePath(BASE_CDN_URL);

    expect(`${devServerBasePath}modern/plugins`).toBe(
      getRemotePluginsFallbackBasePath(undefined, BASE_CDN_URL, VARIANT_SUBFOLDER).replace(
        /\/$/,
        '',
      ),
    );
  });

  it('should not derive the dev server base path from the plugins directory', () => {
    const workflowValue = `${BASE_CDN_URL}/3.x.x/modern/plugins`;

    // What the old wiring produced once the workflows started passing the directory itself.
    expect(`${getRemotePluginsBasePath(workflowValue, `${BASE_CDN_URL}/v3`)}modern/plugins`).toBe(
      `${BASE_CDN_URL}/3.x.x/modern/plugins/modern/plugins`,
    );
    expect(getDevServerPluginsBasePath(BASE_CDN_URL)).not.toContain('/plugins');
  });

  /**
   * The emitted expression has two halves and they must agree on the same input. The build time
   * fallback is composed with `URL` in Node; the runtime half cannot be, because `pluginsCDNPath`
   * is whatever the page supplied and `globalThis.URL` is exactly the built-in SDK-5499 saw a page
   * clobber with a string. It splits the query or fragment off with a regex instead, and this
   * asserts the two halves produce the same URL rather than the same code.
   */
  it.each(SHAPES)(
    'should resolve the runtime path the same way as the fallback with %s',
    async (_l, raw) => {
      (window as any).RudderStackGlobals = { app: { pluginsCDNPath: raw } };
      const source = getRemotePluginsHostPromise(DEPLOY_BASE_PATH, EXPORTS_FILENAME);

      await expect((0, eval)(source)).resolves.toBe(
        getRemotePluginsFallbackURL(raw, EXPORTS_FILENAME),
      );
    },
  );

  it('should not read a dollar in the file name as a replacement pattern', async () => {
    (window as any).RudderStackGlobals = {
      app: { pluginsCDNPath: 'https://www.dummy.url/plugins?sig=abc' },
    };
    const source = getRemotePluginsHostPromise(DEPLOY_BASE_PATH, 'rsa$&plugins');

    await expect((0, eval)(source)).resolves.toBe(
      'https://www.dummy.url/plugins/rsa$&plugins.js?sig=abc',
    );
  });

  it.each(SHAPES)('should bake a parsable expression with %s', async (_l, raw, _n, composed) => {
    (window as any).RudderStackGlobals = { app: {} };
    const source = getRemotePluginsHostPromise(
      getRemotePluginsBasePath(raw, 'https://cdn.example.test/unused'),
      EXPORTS_FILENAME,
    );

    expect(() => new Function(`return ${source};`)).not.toThrow();
    await expect((0, eval)(source)).resolves.toBe(composed);
  });
});

describe('Module federation remote plugins prototype pollution', () => {
  afterEach(() => {
    delete (Object.prototype as any).pluginsCDNPath;
    delete (Object.prototype as any).app;
    delete (window as any).RudderStackGlobals;
  });

  it('should ignore a pluginsCDNPath inherited from Object.prototype', async () => {
    (window as any).RudderStackGlobals = { app: {} };
    (Object.prototype as any).pluginsCDNPath = 'https://attacker.test/plugins';

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      `${DEFAULT_BASE_PATH}/${EXPORTS_FILENAME}.js`,
    );
  });

  it('should ignore an analytics instance inherited from Object.prototype', async () => {
    (window as any).RudderStackGlobals = {};
    (Object.prototype as any).app = { pluginsCDNPath: 'https://attacker.test/plugins' };

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      `${DEFAULT_BASE_PATH}/${EXPORTS_FILENAME}.js`,
    );
  });

  it('should still resolve an own pluginsCDNPath while the prototype is polluted', async () => {
    (window as any).RudderStackGlobals = {
      app: { pluginsCDNPath: 'https://www.dummy.url/3.x.x/modern/plugins' },
    };
    (Object.prototype as any).pluginsCDNPath = 'https://attacker.test/plugins';

    await expect(resolveRemoteEntryURL()).resolves.toBe(
      'https://www.dummy.url/3.x.x/modern/plugins/rsa-plugins.js',
    );
  });
});

/**
 * SDK-5498 started as `REMOTE_MODULES_BASE_PATH` being exported by the step that sets the
 * workspace up rather than the step that runs the build, so the value the deploy intended was not
 * the one the build baked. The same defect was sitting in the NPM release workflow. The invariant
 * is asserted against the workflow files rather than fixed twice by hand, so a third workflow
 * cannot reintroduce it.
 */
describe('Deploy workflows', () => {
  const WORKFLOWS_DIR = join(__dirname, '../../../.github/workflows');

  /** Splits a workflow into its job steps, keyed by the step name. */
  const getBuildSteps = (fileName: string): [string, string][] =>
    readFileSync(join(WORKFLOWS_DIR, fileName), 'utf8')
      .split(/^ {6}- name: /m)
      .slice(1)
      .map(block => [block.split('\n')[0] as string, block] as [string, string])
      .filter(([, block]) => /npm run build:/.test(block));

  /** Every `REMOTE_MODULES_BASE_PATH` value a workflow sets. */
  const getBasePathValues = (fileName: string): string[] =>
    readFileSync(join(WORKFLOWS_DIR, fileName), 'utf8')
      .split('\n')
      .filter(line => line.includes('REMOTE_MODULES_BASE_PATH:'))
      .map(line =>
        (line.split('REMOTE_MODULES_BASE_PATH:')[1] ?? '').trim().replace(/^["']|["']$/g, ''),
      );

  it.each(['deploy.yml', 'deploy-npm.yml'])(
    'should set REMOTE_MODULES_BASE_PATH on every build step of %s',
    fileName => {
      const buildSteps = getBuildSteps(fileName);

      expect(buildSteps.length).toBeGreaterThan(0);
      buildSteps.forEach(([name, block]) => {
        expect(`${fileName} / ${name}: ${/REMOTE_MODULES_BASE_PATH:/.test(block)}`).toBe(
          `${fileName} / ${name}: true`,
        );
      });
    },
  );

  /**
   * Presence is not enough. The variable was set correctly and still pointed somewhere the
   * workflow never publishes: in production `s3_dir_path` is `v3`, while plugin artifacts go to
   * the versioned directory and the `v3` copy step is gated to non production. The shape of the
   * value is therefore asserted too, so a fallback that names an unpublished directory fails here
   * rather than in a browser.
   */
  it.each(['deploy.yml', 'deploy-npm.yml'])(
    'should point REMOTE_MODULES_BASE_PATH at the published plugins directory in %s',
    fileName => {
      const values = getBasePathValues(fileName);

      expect(values.length).toBeGreaterThan(0);
      values.forEach(value => {
        expect(
          `${fileName} ends with the plugins directory: ${value.endsWith('/modern/plugins')}`,
        ).toBe(`${fileName} ends with the plugins directory: true`);
        expect(`${fileName} is version pinned: ${value.includes('CURRENT_VERSION_VALUE')}`).toBe(
          `${fileName} is version pinned: true`,
        );
        expect(
          `${fileName} is environment aware: ${value.includes("inputs.environment == 'production'")}`,
        ).toBe(`${fileName} is environment aware: true`);
      });
    },
  );
});
