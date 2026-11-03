/** @jest-environment-options {"runScripts":"outside-only"} */
import RollBar from '../../../src/integrations/RollBar/browser';

describe('RollBar script readiness', () => {
  let rollBar;
  let script;

  beforeEach(() => {
    document.body.innerHTML = '<script></script>';
    rollBar = new RollBar({ accessToken: 'test-token', ignoredMessages: [] }, {});
    rollBar.init();
    script = document.querySelector('script[src]');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.Rollbar;
    delete window.rollbar;
    delete window._rollbarShims;
    delete window._rollbarWrappedError;
    delete window._rollbarDidLoad;
    delete window._rollbarInitialized;
  });

  it('stays not ready after the vendor script errors', () => {
    expect(window.Rollbar).toBeDefined();
    script.dispatchEvent(new Event('error'));
    expect(rollBar.isLoaded()).toBe(false);
    expect(rollBar.isReady()).toBe(false);
  });

  it('becomes ready only after the vendor script loads', () => {
    expect(rollBar.isReady()).toBe(false);
    const configure = jest.fn();
    window.rollbar = jest.fn().mockImplementation(() => ({ configure }));
    window._rollbarDidLoad = true;
    script.dispatchEvent(new Event('load'));
    expect(rollBar.isLoaded()).toBe(true);
    expect(rollBar.isReady()).toBe(true);
    expect(window._rollbarInitialized).toBe(true);
    rollBar.identify({ message: { userId: 'user-id', context: { traits: {} } } });
    expect(configure).toHaveBeenCalledWith({ payload: { person: { id: 'user-id' } } });
  });

  it('stays not ready if the load event fires without the vendor SDK', () => {
    script.dispatchEvent(new Event('load'));
    expect(rollBar.isReady()).toBe(false);
  });
});
