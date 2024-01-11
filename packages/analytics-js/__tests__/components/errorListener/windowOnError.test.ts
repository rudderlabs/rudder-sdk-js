import { attachOnError } from '../../../src/components/errorListener/windowOnError';
import { defaultLogger } from '../../../src/services/Logger';
import { state } from '../../../src/state';

describe('attachOnError', () => {
  const pluginManager = jest.fn();
  defaultLogger.error = jest.fn();

  afterEach(() => {
    window.onerror = null;
  });
  it('should attach onerror listener to capture unhandled exception', () => {
    expect(window.onerror).toBe(null);
    attachOnError(pluginManager);
    expect(typeof window.onerror).toBe('function');
  });

  it('should log the error if reporting is not enabled', () => {
    attachOnError(pluginManager, defaultLogger);
    expect(typeof window.onerror).toBe('function');

    state.reporting.isErrorReportingEnabled = false;
    window.onerror?.call('Uncaught Error: Bad things', 'foo.js', 10, 20, new Error('Bad things'));
    expect(defaultLogger.error).toHaveBeenCalled();
  });
});
