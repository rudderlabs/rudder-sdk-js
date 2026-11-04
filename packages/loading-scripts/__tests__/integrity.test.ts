import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const artifacts = ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'];
const coreDir = process.env.PINNED_CORE_DIR
  ? resolve(__dirname, '..', process.env.PINNED_CORE_DIR)
  : join(__dirname, '../../analytics-js/dist/cdn');
const { version } = JSON.parse(readFileSync(resolve(coreDir, '../../package.json'), 'utf8'));
const coreIntegrity = (variant: string) =>
  `sha384-${createHash('sha384')
    .update(readFileSync(join(coreDir, `${variant}/iife/rsa.min.js`)))
    .digest('base64')}`;

// Exercise shipped JavaScript, including minification and build-time branch removal.
describe.each(['floating', 'pinned'])('%s loaders', build => {
  describe.each(artifacts)('%s', artifact => {
    const isPinned = build === 'pinned';
    const isGtm = artifact.includes('-gtm');
    const source = readFileSync(
      join(__dirname, isPinned ? '../dist-pinned' : '../dist', artifact),
      'utf8',
    );
    let scripts: HTMLScriptElement[];

    beforeEach(() => {
      window.rudderanalytics = undefined;
      document.head.innerHTML = '';
      document.body.innerHTML = '';
      scripts = [];
      jest.spyOn(document.head, 'insertBefore').mockImplementation(node => {
        scripts.push(node as unknown as HTMLScriptElement);
        return node;
      });
    });

    afterEach(() => jest.restoreAllMocks());

    const insertedScript = (index: number): HTMLScriptElement => {
      const script = scripts[index];
      if (!script) throw new Error(`Expected an inserted script at index ${index}`);
      return script;
    };

    it('embeds only the configuration for its build', () => {
      expect(source).not.toMatch(/__IS_(?:PINNED|GTM)_BUILD__|__SDK_/);
      if (isPinned) {
        expect(source).toMatch(
          new RegExp(`var sdkVersion\\s*=\\s*"${version.replaceAll('.', '\\.')}"`),
        );
        expect(source).toContain(coreIntegrity('modern'));
        expect(source).toContain(coreIntegrity('legacy'));
      } else {
        expect(source).toMatch(/var sdkVersion\s*=\s*"v3"/);
        expect(source).not.toMatch(/integrity|crossOrigin|sha384/i);
      }
    });

    it.each(['modern', 'legacy'])('mounts the %s core with matching attributes', variant => {
      if (variant === 'legacy') {
        jest.spyOn(window, 'Function').mockImplementation(() => {
          throw new SyntaxError('Legacy browser');
        });
      }
      window.eval(source);
      expect(scripts).toHaveLength(1);
      const script = insertedScript(0);
      expect(script.src).toBe(
        `https://cdn.rudderlabs.com/${isPinned ? version : 'v3'}/${variant}/rsa.min.js`,
      );
      expect(script.integrity || '').toBe(isPinned ? coreIntegrity(variant) : '');
      expect(script.crossOrigin).toBe(isPinned ? 'anonymous' : null);
      expect(script.async).toBe(true);
      expect(script.getAttribute('data-rsa-write-key')).toBe(isGtm ? null : '__WRITE_KEY__');
      expect(Array.from(window.rudderanalytics as unknown as unknown[])).toEqual(
        isGtm ? [] : [['load', '__WRITE_KEY__', '__DATAPLANE_URL__', {}]],
      );
    });

    it('preserves buffered GTM configuration', () => {
      const load = ['load', 'gtm-write-key', 'https://data.example.com', { logLevel: 'DEBUG' }];
      window.rudderanalytics = [load] as any;
      window.eval(source);
      expect((window.rudderanalytics as unknown as unknown[])[0]).toEqual(load);
      expect((window.rudderanalytics as unknown as unknown[]).length).toBe(isGtm ? 1 : 2);
    });

    it('leaves the polyfill unconfigured and protects the core when mounted later', () => {
      const originalPromise = window.Promise;
      try {
        // @ts-expect-error simulate a browser needing the bootstrap polyfill
        window.Promise = undefined;
        window.eval(source);
        expect(insertedScript(0).src).toContain('polyfill-fastly.io');
        expect(insertedScript(0).integrity).toBeFalsy();
        expect(insertedScript(0).crossOrigin).toBeNull();
      } finally {
        window.Promise = originalPromise;
      }
      window.rudderAnalyticsMount();
      expect(insertedScript(1).integrity || '').toBe(isPinned ? coreIntegrity('modern') : '');
      expect(insertedScript(1).crossOrigin).toBe(isPinned ? 'anonymous' : null);
    });
  });
});
