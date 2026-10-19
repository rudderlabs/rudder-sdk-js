import Clevertap from '../../../src/integrations/Clevertap/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import Logger from '../../../src/utils/logger';

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
      expect(window.clevertap.privacy).toEqual([
        { optOut: false },
        { optOut: true },
        { useIP: false },
      ]);
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

  test('warns when a preloaded account differs from the configured account', () => {
    const warn = jest.spyOn(Logger.prototype, 'warn');
    window.clevertap = { account: [{ id: 'different-account' }] };
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(warn).toHaveBeenCalledWith('Ignoring preloaded account different-account');
    warn.mockRestore();
  });

  test('does not warn when a preloaded account matches the configured account', () => {
    const warn = jest.spyOn(Logger.prototype, 'warn');
    window.clevertap = { account: [{ id: '12567839' }] };
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test('clears account-scoped settings when a preloaded account differs', () => {
    window.clevertap = {
      account: [{ id: 'different-account' }],
      region: 'eu',
      targetDomain: 'example.com',
      token: 'token',
    };
    clevertap = new Clevertap(
      { accountId: '12567839', region: 'none' },
      { loadOnlyIntegrations: {} },
    );

    clevertap.init();

    expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
    expect(window.clevertap).not.toHaveProperty('region');
    expect(window.clevertap).not.toHaveProperty('targetDomain');
    expect(window.clevertap).not.toHaveProperty('token');
  });

  test('keeps account-scoped settings when a preloaded account matches', () => {
    window.clevertap = {
      account: [{ id: '12567839' }],
      region: 'eu',
      targetDomain: 'example.com',
      token: 'token',
    };
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(window.clevertap.region).toBe('eu');
    expect(window.clevertap.targetDomain).toBe('example.com');
    expect(window.clevertap.token).toBe('token');
  });

  test('replaces a preloaded account and region fallback with the configured account', () => {
    window.clevertap = { account: [{ id: 'different-account' }, 'eu'] };
    clevertap = new Clevertap(
      { accountId: '12567839', region: 'none' },
      { loadOnlyIntegrations: {} },
    );

    clevertap.init();

    expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
    expect(window.clevertap.region).toBeUndefined();
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

  test.each([undefined, null, false])(
    'initializes the global and all queues when the global is %p',
    global => {
      window.clevertap = global;
      clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

      clevertap.init();

      expect(window.clevertap.event).toEqual([]);
      expect(window.clevertap.profile).toEqual([]);
      expect(window.clevertap.onUserLogin).toEqual([]);
      expect(window.clevertap.notifications).toEqual([]);
      expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
      expect(window.clevertap.privacy).toEqual([{ optOut: false }, { useIP: false }]);
    },
  );

  test('preserves the global, every existing queue, and additional properties', () => {
    const existing = {
      event: ['Order Completed', { orderId: 'order-1' }],
      profile: [{ Site: { Name: 'Test User' } }],
      onUserLogin: [{ Site: { Identity: 'user-1' } }],
      notifications: [{ titleText: 'Receive updates?' }],
      privacy: [{ optOut: true }],
      customProperty: { enabled: true },
    };
    const queues = { ...existing };
    window.clevertap = existing;
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(window.clevertap).toBe(existing);
    Object.keys(queues).forEach(key => {
      expect(window.clevertap[key]).toBe(queues[key]);
    });
    expect(window.clevertap.event).toEqual(['Order Completed', { orderId: 'order-1' }]);
    expect(window.clevertap.profile).toEqual([{ Site: { Name: 'Test User' } }]);
    expect(window.clevertap.onUserLogin).toEqual([{ Site: { Identity: 'user-1' } }]);
    expect(window.clevertap.notifications).toEqual([{ titleText: 'Receive updates?' }]);
    expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
    expect(window.clevertap.privacy).toEqual([
      { optOut: true },
      { optOut: false },
      { useIP: false },
    ]);
  });

  test('fills missing queues on a partial global without replacing existing properties', () => {
    const existing = { notifications: [{ skipDialog: false }], customProperty: 'retained' };
    window.clevertap = existing;
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });

    clevertap.init();

    expect(window.clevertap).toBe(existing);
    expect(window.clevertap.notifications).toEqual([{ skipDialog: false }]);
    expect(window.clevertap.customProperty).toBe('retained');
    expect(window.clevertap.event).toEqual([]);
    expect(window.clevertap.profile).toEqual([]);
    expect(window.clevertap.onUserLogin).toEqual([]);
    expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
    expect(window.clevertap.privacy).toEqual([{ optOut: false }, { useIP: false }]);
  });

  test('preserves native SDK APIs without checking whether the SDK is loaded', () => {
    const existing = { logout: jest.fn() };
    ['event', 'profile', 'onUserLogin', 'notifications', 'privacy'].forEach(key => {
      existing[key] = { push: jest.fn() };
    });
    const apis = { ...existing };
    window.clevertap = existing;
    clevertap = new Clevertap({ accountId: '12567839' }, { loadOnlyIntegrations: {} });
    const isLoaded = jest.spyOn(clevertap, 'isLoaded');

    clevertap.init();

    expect(isLoaded).not.toHaveBeenCalled();
    expect(window.clevertap).toBe(existing);
    Object.keys(apis).forEach(key => {
      expect(window.clevertap[key]).toBe(apis[key]);
    });
    expect(window.clevertap.account).toEqual([{ id: '12567839' }]);
    expect(existing.privacy.push.mock.calls).toEqual([[{ optOut: false }], [{ useIP: false }]]);
  });
});
