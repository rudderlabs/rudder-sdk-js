import { contextState } from '../../../src/state/slices/context';

/**
 * Tests for context state slice, specifically the variant field
 * which tracks which build variant is being used
 */
describe('context state - library variant', () => {
  let originalBuildVariant: string;
  let originalWindow: any;

  beforeAll(() => {
    // Store original values
    originalBuildVariant = (global as any).__BUILD_VARIANT__;
    originalWindow = global.window;
  });

  afterEach(() => {
    // Restore original values
    (global as any).__BUILD_VARIANT__ = originalBuildVariant;
    global.window = originalWindow;
    // Clear module cache
    jest.resetModules();
  });

  describe('NPM builds - variant from __BUILD_VARIANT__', () => {
    it('should use "modern" variant for modern npm build', () => {
      // Mock modern NPM build
      (global as any).__BUILD_VARIANT__ = 'modern';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('modern');
    });

    it('should use "legacy" variant for legacy npm build', () => {
      // Mock legacy NPM build
      (global as any).__BUILD_VARIANT__ = 'legacy';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('legacy');
    });

    it('should use "lite" variant for lite npm build', () => {
      // Mock lite NPM build
      (global as any).__BUILD_VARIANT__ = 'lite';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('lite');
    });

    it('should use "legacy-lite" variant for legacy lite npm build', () => {
      // Mock legacy lite NPM build
      (global as any).__BUILD_VARIANT__ = 'legacy-lite';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('legacy-lite');
    });

    it('should use "bundled" variant for bundled npm build', () => {
      // Mock bundled NPM build
      (global as any).__BUILD_VARIANT__ = 'bundled';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('bundled');
    });

    it('should use "legacy-bundled" variant for legacy bundled npm build', () => {
      // Mock legacy bundled NPM build
      (global as any).__BUILD_VARIANT__ = 'legacy-bundled';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('legacy-bundled');
    });

    it('should use "content-script" variant for content script build', () => {
      // Mock content script build
      (global as any).__BUILD_VARIANT__ = 'content-script';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('content-script');
    });

    it('should use "legacy-content-script" variant for legacy content script build', () => {
      // Mock legacy content script build
      (global as any).__BUILD_VARIANT__ = 'legacy-content-script';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      expect(freshContextState.library.value.variant).toBe('legacy-content-script');
    });
  });

  describe('CDN builds - variant from window.rudderAnalyticsBuildType', () => {
    // Note: CDN runtime variant detection is tested in browser integration tests
    // These tests verify the logic exists but cannot fully test runtime window access in Jest

    it('should have CDN_RUNTIME_VALUE marker for CDN builds', () => {
      // Mock CDN build marker
      (global as any).__BUILD_VARIANT__ = 'CDN_RUNTIME_VALUE';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      // In CDN builds, variant comes from window.rudderAnalyticsBuildType at runtime
      // In test environment without that property, it should be undefined
      expect(freshContextState.library.value.variant).toBeUndefined();
    });

    it('should distinguish CDN marker from NPM variants', () => {
      // CDN build marker
      (global as any).__BUILD_VARIANT__ = 'CDN_RUNTIME_VALUE';
      jest.resetModules();
      const cdnModule = require('../../../src/state/slices/context');

      // NPM build
      (global as any).__BUILD_VARIANT__ = 'modern';
      jest.resetModules();
      const npmModule = require('../../../src/state/slices/context');

      // CDN should not have static variant, NPM should
      expect(cdnModule.contextState.library.value.variant).toBeUndefined();
      expect(npmModule.contextState.library.value.variant).toBe('modern');
    });
  });

  describe('library context integration', () => {
    it('should include all required library fields', () => {
      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      const library = freshContextState.library.value;

      expect(library).toHaveProperty('name');
      expect(library).toHaveProperty('version');
      expect(library).toHaveProperty('snippetVersion');
      expect(library).toHaveProperty('variant');

      expect(library.name).toBe('RudderLabs JavaScript SDK');
      expect(typeof library.version).toBe('string');
    });

    it('should set variant as optional field', () => {
      // Mock build without variant
      (global as any).__BUILD_VARIANT__ = undefined;

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      const library = freshContextState.library.value;

      // Variant should be present but can be undefined
      expect('variant' in library).toBe(true);
      expect(library.variant).toBeUndefined();
    });

    it('should preserve snippet version alongside variant', () => {
      // Mock modern build
      (global as any).__BUILD_VARIANT__ = 'modern';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      const library = freshContextState.library.value;

      // Snippet version comes from window.RudderSnippetVersion
      // Variant comes from __BUILD_VARIANT__ in NPM builds
      expect(library).toHaveProperty('snippetVersion');
      expect(library).toHaveProperty('variant');
      expect(library.variant).toBe('modern');
    });
  });

  describe('variant tracking use cases', () => {
    it('should allow identification of lite build usage', () => {
      // Mock lite build
      (global as any).__BUILD_VARIANT__ = 'lite';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      const variant = freshContextState.library.value.variant;

      // Can identify lite builds
      expect(variant).toContain('lite');
    });

    it('should allow identification of legacy builds', () => {
      // Mock legacy build
      (global as any).__BUILD_VARIANT__ = 'legacy-bundled';

      // Re-import to get fresh context
      jest.resetModules();
      const { contextState: freshContextState } = require('../../../src/state/slices/context');

      const variant = freshContextState.library.value.variant;

      // Can identify legacy builds
      expect(variant).toContain('legacy');
    });

    it('should allow differentiation between npm and cdn builds', () => {
      // Test NPM build - has static variant
      (global as any).__BUILD_VARIANT__ = 'modern';
      jest.resetModules();
      const { contextState: npmContext } = require('../../../src/state/slices/context');

      // Test CDN build - uses runtime value (undefined in test environment)
      (global as any).__BUILD_VARIANT__ = 'CDN_RUNTIME_VALUE';
      jest.resetModules();
      const { contextState: cdnContext } = require('../../../src/state/slices/context');

      // NPM has static variant from build time
      expect(npmContext.library.value.variant).toBe('modern');
      // CDN uses runtime window.rudderAnalyticsBuildType (undefined in test)
      expect(cdnContext.library.value.variant).toBeUndefined();
    });
  });
});
