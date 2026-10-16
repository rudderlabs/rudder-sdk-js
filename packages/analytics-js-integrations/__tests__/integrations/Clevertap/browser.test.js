import Clevertap from '../../../src/integrations/Clevertap/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';

jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));

beforeEach(() => {
  delete window.clevertap;
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

afterEach(() => {
  delete window.clevertap;
  // Reset DOM to original state
  document.getElementById('dummyScript')?.remove();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Clevertap init tests', () => {
  let clevertap;

  test('Testing init call of clevertap without region value', () => {
    clevertap = new Clevertap(
      { accountId: '12567839', passcode: '123456' },
      { loglevel: 'debug', loadOnlyIntegrations: {} },
    );
    clevertap.init();
    expect(typeof window.clevertap).toBe('object');
    expect(window.clevertap.region).toBeUndefined();
  });

  test('Testing init call of clevertap with valid region value', () => {
    clevertap = new Clevertap(
      { accountId: '12567839', passcode: '123456', region: 'in' },
      { loglevel: 'debug', loadOnlyIntegrations: {} },
    );
    clevertap.init();
    expect(typeof window.clevertap).toBe('object');
    expect(window.clevertap.region).toBe('in');
  });

  test('makes early notification requests available to the native SDK with destination settings', () => {
    const notification = {
      titleText: 'Receive order updates?',
      bodyText: 'Get notifications about your orders.',
      okButtonText: 'Enable',
      rejectButtonText: 'Later',
      serviceWorkerPath: '/clevertap_sw.js',
    };
    const notifications = [];
    window.clevertap = {
      notifications,
      account: [{ id: 'different-account' }],
      privacy: [{ optOut: false }],
      region: 'eu',
    };
    window.clevertap.notifications.push(notification);

    ScriptLoader.mockImplementationOnce(() => {
      expect(window.clevertap.notifications).toBe(notifications);
      expect(window.clevertap.notifications).toEqual([notification]);
      expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
      expect(window.clevertap.region).toBe('in');
      expect(window.clevertap.privacy).toEqual([{ optOut: true }, { useIP: false }]);
    });

    clevertap = new Clevertap(
      { accountId: '12567839', region: 'in' },
      { loadOnlyIntegrations: { CleverTap: { optOut: true } } },
    );
    clevertap.init();

    expect(ScriptLoader).toHaveBeenCalledWith(
      'clevertap-integration',
      'https://static.clevertap.com/js/clevertap.min.js',
    );
    expect(clevertap.isReady()).toBe(false);
  });

  test('retains the preload queue when requests are added after initialization', () => {
    const notifications = [];
    window.clevertap = { notifications };
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();
    const notification = { skipDialog: true };
    notifications.push(notification);

    expect(window.clevertap.notifications).toBe(notifications);
    expect(window.clevertap.notifications).toEqual([notification]);
  });

  test.each([undefined, null, {}, 'invalid'])(
    'initializes an empty queue when preload notifications are %p',
    notifications => {
      window.clevertap = { notifications };
      clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

      clevertap.init();

      expect(window.clevertap.notifications).toEqual([]);
    },
  );

  test('does not reuse the notification implementation of an already loaded SDK', () => {
    const notifications = [{ skipDialog: true }];
    notifications.push = jest.fn();
    window.clevertap = { notifications, logout: jest.fn() };
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(window.clevertap.notifications).toEqual([]);
    expect(window.clevertap.notifications).not.toBe(notifications);
    expect(notifications.push).not.toHaveBeenCalled();
  });
});
