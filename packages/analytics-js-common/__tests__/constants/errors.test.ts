import {
  PLUGINS_LOAD_FAILURE_MESSAGES,
  SCRIPT_LOAD_FAILURE_MESSAGES,
} from '../../src/constants/errors';

const matchesAny = (patterns: RegExp[], message: string) =>
  patterns.some(pattern => pattern.test(message));

const CDN_URL = 'https://cdn.rudderlabs.com/3.34.1/modern/plugins/rsa-plugins.js';

describe('constants - errors', () => {
  describe('PLUGINS_LOAD_FAILURE_MESSAGES', () => {
    it.each([
      ['Chromium', `Failed to fetch dynamically imported module: ${CDN_URL}`],
      ['Firefox', `error loading dynamically imported module: ${CDN_URL}`],
    ])('should match the %s dynamic import failure wording', (_browser, message) => {
      expect(matchesAny(PLUGINS_LOAD_FAILURE_MESSAGES, message)).toBe(true);
    });

    it('should not match an unrelated failure', () => {
      expect(
        matchesAny(PLUGINS_LOAD_FAILURE_MESSAGES, 'Some other error happened while loading'),
      ).toBe(false);
    });
  });

  it('should carry both browser wordings into SCRIPT_LOAD_FAILURE_MESSAGES', () => {
    PLUGINS_LOAD_FAILURE_MESSAGES.forEach(pattern => {
      expect(SCRIPT_LOAD_FAILURE_MESSAGES).toContain(pattern);
    });
  });
});
