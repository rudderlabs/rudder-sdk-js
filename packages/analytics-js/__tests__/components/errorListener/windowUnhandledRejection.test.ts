import { attachUnhandledRejection } from '../../../src/components/errorListener/windowUnhandledRejection';
import { defaultLogger } from '../../../src/services/Logger';
import { state } from '../../../src/state';

describe('attachUnhandledRejection', () => {
  const pluginManager = jest.fn();
  defaultLogger.error = jest.fn();

  const unhandledRejectionListener = jest.spyOn(window, 'addEventListener');

  function getUnhandledRejectionHandler() {
    const handler = (window.addEventListener as jest.MockedFunction<typeof window.addEventListener>)
      .mock.calls[0][1];
    return handler as (payload: any) => void;
  }

  it('should attach onerror listener to capture unhandled exception', () => {
    attachUnhandledRejection(pluginManager);
    expect(unhandledRejectionListener).toHaveBeenCalledTimes(1);
  });

  it('should log the error if reporting is not enabled', () => {
    attachUnhandledRejection(pluginManager, defaultLogger);
    state.reporting.isErrorReportingEnabled = false;

    const handler = getUnhandledRejectionHandler();
    // simulate an UnhandledRejection event
    handler({ reason: new Error('BAD_PROMISE') });

    expect(window.addEventListener).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalled();
  });
});
