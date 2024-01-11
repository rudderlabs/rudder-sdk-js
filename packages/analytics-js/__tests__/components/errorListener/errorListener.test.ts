import { ErrorListener } from '@rudderstack/analytics-js/components/errorListener/errorListener';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { PluginsManager } from '../../../src/components/pluginsManager';

describe('ErrorListener', () => {
  const defaultPluginsManager = new PluginsManager(
    defaultPluginEngine,
    defaultErrorHandler,
    defaultLogger,
  );

  describe('attachErrorListeners', () => {
    it('should attach errorListeners', () => {
      const unhandledRejectionListener = jest.spyOn(window, 'addEventListener');
      // eslint-disable-next-line no-new
      new ErrorListener(defaultPluginsManager, defaultLogger);
      expect(typeof window.onerror).toBe('function');
      expect(unhandledRejectionListener).toHaveBeenCalled();
    });
  });
});
