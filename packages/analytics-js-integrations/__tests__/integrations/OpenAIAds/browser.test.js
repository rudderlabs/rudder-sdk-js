import sha256 from 'crypto-js/sha256';
import OpenAIAds from '../../../src/integrations/OpenAIAds/browser';
import { integrations } from '../../../src/integrations';
import { PIXEL_URL } from '../../../src/integrations/OpenAIAds/constants';
import { toMinorUnits } from '../../../src/integrations/OpenAIAds/currency';
import { resetNativeSdkLoaderForTests } from '../../../src/integrations/OpenAIAds/nativeSdkLoader';

const baseConfig = {
  pixelId: 'pixel-123',
  eventMapping: [
    { from: 'Product Viewed', to: 'contents_viewed', deduplicationKey: 'properties.orderId' },
    { from: 'Trial Signup', to: 'custom', customEventName: 'Trial Started' },
    { from: 'Landing Page', to: 'page_viewed' },
    { from: 'Home Screen', to: 'contents_viewed' },
    { from: 'Mobile Install', to: 'app_installed' },
    { from: 'Subscription Created', to: 'subscription_created' },
  ],
  defaultCurrency: 'USD',
  defaultActionSource: 'web',
};

const makeIntegration = (config, analytics = {}) =>
  new OpenAIAds({ ...baseConfig, ...config }, { logLevel: 'DEBUG', ...analytics });

const initForCalls = (config, analytics) => {
  const integration = makeIntegration(config, analytics);
  integration.init();
  window.oaiq = jest.fn();
  return integration;
};

const getMeasureCall = () => window.oaiq.mock.calls.find(call => call[0] === 'measureSingle');
const getUserInitCall = () => window.oaiq.mock.calls.find(call => call[0] === 'init');

beforeEach(() => {
  document.head.innerHTML = '<script id="dummyScript"></script>';
  document.cookie = '__obref=; Max-Age=0';
  delete window.oaiq;
  resetNativeSdkLoaderForTests();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('OpenAIAds initialization and registry', () => {
  test('registers OPENAI_ADS in the integration registry', () => {
    expect(integrations.OPENAI_ADS).toBe(OpenAIAds);
  });

  test('loads the Measurement Pixel once and initializes with pixelId only', () => {
    const integration = makeIntegration({ apiKey: 'secret-api-key' });
    integration.init();

    const script = document.getElementById('openai-ads-measurement-pixel');
    expect(script.src).toBe(PIXEL_URL);
    expect(script.getAttribute('data-loader')).toBe('RS_JS_SDK');
    expect(Array.from(window.oaiq.queue[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
    expect(JSON.stringify(window.oaiq.queue)).not.toContain('secret-api-key');
    expect(integration.isLoaded()).toBe(true);
    expect(integration.isReady()).toBe(true);

    const secondIntegration = makeIntegration();
    secondIntegration.init();
    expect(document.querySelectorAll(`script[src="${PIXEL_URL}"]`)).toHaveLength(1);
    expect(window.oaiq.queue).toHaveLength(2);
  });

  test('guards identify and track when pixelId is missing', () => {
    const integration = makeIntegration({ pixelId: undefined });

    expect(() => {
      integration.identify({
        message: { type: 'identify', context: { traits: { email: 'person@example.com' } } },
      });
      integration.track({
        message: {
          type: 'track',
          event: 'Product Viewed',
          properties: {},
          context: { page: { url: 'https://example.com/product' } },
        },
      });
    }).not.toThrow();

    expect(window.oaiq).toBeUndefined();
    expect(
      console.error.mock.calls.filter(call =>
        call[0].includes('OpenAI Ads pixelId is required for initialization'),
      ),
    ).toHaveLength(2);
  });

  test('installs the pixel queue when identify is invoked before init', () => {
    const integration = makeIntegration();

    integration.identify({
      message: { type: 'identify', context: { traits: { email: 'person@example.com' } } },
    });

    expect(Array.from(window.oaiq.queue[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
    expect(Array.from(window.oaiq.queue[1])).toEqual([
      'init',
      { user: { emails_sha256: [sha256('person@example.com').toString()] } },
    ]);
    expect(document.querySelectorAll(`script[src="${PIXEL_URL}"]`)).toHaveLength(1);
  });

  test('uses the pixel queue when the script tag already exists', () => {
    document.head.innerHTML = `<script id="openai-ads-measurement-pixel" src="${PIXEL_URL}"></script>`;
    const integration = makeIntegration();

    integration.init();

    expect(integration.isReady()).toBe(true);
    expect(document.querySelectorAll('#openai-ads-measurement-pixel')).toHaveLength(1);
    expect(Array.from(window.oaiq.queue[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
  });
});

describe('OpenAIAds identify', () => {
  test('sets hashed user data with the spec init signature', () => {
    const integration = initForCalls();
    integration.identify({
      message: {
        type: 'identify',
        userId: 'User-123',
        context: {
          traits: {
            email: ' Person@Example.COM ',
            phone: ' +1 (555) 120-0100 ',
            firstName: ' A.Lice ',
            lastName: ' Example ',
            obref: 'obref-from-traits',
            city: ' San Francisco ',
            country: 'US',
          },
          ip: '192.168.0.1',
          userAgent: 'Mozilla/5.0',
        },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(1);
    expect(window.oaiq).toHaveBeenCalledWith('init', {
      user: {
        emails_sha256: [sha256('person@example.com').toString()],
        phone_numbers_sha256: [sha256('15551200100').toString()],
        external_ids_sha256: [sha256('user-123').toString()],
        first_names_sha256: [sha256('alice').toString()],
        last_names_sha256: [sha256('example').toString()],
        obref: 'obref-from-traits',
        cities: ['San Francisco'],
        countries: ['US'],
        ip_address: '192.168.0.1',
        user_agent: 'Mozilla/5.0',
      },
    });
  });

  test('skips identify when there is no usable user data', () => {
    const integration = initForCalls();
    integration.identify({ message: { type: 'identify', context: { traits: { email: 'not-valid' } } } });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads identify skipped because no usable user data was found'),
      ),
    ).toBe(true);
  });

  test('rejects apparent pre-hashed PII instead of passing through or double hashing', () => {
    const integration = initForCalls();
    integration.identify({
      message: {
        type: 'identify',
        context: { traits: { email: sha256('person@example.com').toString() } },
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads rejected apparent pre-hashed value for email'),
      ),
    ).toBe(true);
  });

  test('clears pixel user state before identify when userId changes, then repopulates', () => {
    const integration = initForCalls({}, { getUserId: () => 'old-user' });

    integration.identify({
      message: {
        type: 'identify',
        userId: 'new-user',
        context: { traits: { email: 'new@example.com' } },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(2);
    expect(window.oaiq.mock.calls[0]).toEqual(['init', { pixelId: 'pixel-123', user: {} }]);
    expect(window.oaiq.mock.calls[1]).toEqual([
      'init',
      {
        user: {
          emails_sha256: [sha256('new@example.com').toString()],
          external_ids_sha256: [sha256('new-user').toString()],
        },
      },
    ]);
  });
});

describe('OpenAIAds conversion events', () => {
  test('fires mapped standard track events with event data and event options', () => {
    const integration = initForCalls();
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'fallback-id',
        properties: {
          orderId: 'order-123',
          amount: '129.99',
          currency: 'usd',
          optOut: true,
          contents: {
            product_id: 'sku-1',
            name: 'Product One',
            groupId: 'group-1',
            variantDict: { color: 'red' },
            quantity: 2,
            price: '12.34',
          },
          oppref: 'oppref-value',
          ignoredStandardExtra: 'drop-me',
        },
        context: { page: { url: 'https://example.com/page?query=1#hash' } },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        action_source: 'web',
        source_url: 'https://example.com/page?query=1#hash',
        opt_out: true,
        oppref: 'oppref-value',
        currency: 'USD',
        amount: 12999,
        contents: [
          {
            id: 'sku-1',
            name: 'Product One',
            group_id: 'group-1',
            variant_dict: { color: 'red' },
            quantity: 2,
            currency: 'USD',
            amount: 1234,
          },
        ],
      },
      { id: 'order-123' },
    ]);
  });

  test('clears pixel user state before measuring when a previously known user logs out', () => {
    const integration = initForCalls({}, { getUserId: () => 'User-123' });

    integration.track({
      message: {
        type: 'track',
        userId: '',
        event: 'Product Viewed',
        messageId: 'post-reset',
        properties: {},
        context: { page: { url: 'https://example.com/post-reset' } },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(2);
    expect(window.oaiq.mock.calls[0]).toEqual(['init', { pixelId: 'pixel-123', user: {} }]);
    expect(window.oaiq.mock.calls[1]).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        action_source: 'web',
        source_url: 'https://example.com/post-reset',
      },
      { id: 'post-reset' },
    ]);
    expect(window.oaiq).not.toHaveBeenCalledWith('init', { pixelId: 'pixel-123' });
  });

  test('does not clear pixel user state when userId is omitted from an event', () => {
    const integration = initForCalls({}, { getUserId: () => 'User-123' });

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'without-user-id',
        properties: {},
        context: { page: { url: 'https://example.com/no-user-id' } },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(1);
    expect(window.oaiq.mock.calls[0]).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        action_source: 'web',
        source_url: 'https://example.com/no-user-id',
      },
      { id: 'without-user-id' },
    ]);
  });

  test('fires mapped custom events with custom properties and messageId fallback', () => {
    const integration = initForCalls();
    integration.track({
      message: {
        type: 'track',
        event: 'Trial Signup',
        messageId: 'msg-123',
        properties: {
          amount: 10,
          customFlag: true,
          nested: {
            ok: 'yes',
            profile: {
              email: 'nested@example.com',
              safe: 'kept',
            },
          },
          customList: [
            { label: 'allowed', phone: '5551200100' },
            { email: 'drop@example.com' },
          ],
          email: 'drop@example.com',
          emptyValue: '',
        },
        context: { page: { url: 'https://example.com/signup' } },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'Trial Started',
      {
        type: 'custom',
        action_source: 'web',
        source_url: 'https://example.com/signup',
        currency: 'USD',
        amount: 1000,
        customFlag: true,
        nested: { ok: 'yes', profile: { safe: 'kept' } },
        customList: [{ label: 'allowed' }],
      },
      { id: 'msg-123' },
    ]);
  });

  test('skips exact OpenAI standard event names without mapping', () => {
    const integration = initForCalls({ eventMapping: [] });
    integration.track({
      message: {
        type: 'track',
        event: 'order_created',
        messageId: 'msg-456',
        properties: {},
        context: { page: { url: 'https://example.com/order' } },
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event mapping not found for order_created'),
      ),
    ).toBe(true);
  });

  test('skips web action-source events without a valid source URL', () => {
    const integration = initForCalls();

    integration.track({ message: { type: 'track', event: 'Product Viewed', properties: {} } });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event skipped: source_url is required when action_source is web'),
      ),
    ).toBe(true);
  });

  test('skips unmapped, missing source, and pixel-unsupported app lifecycle events', () => {
    const integration = initForCalls();

    integration.track({ message: { type: 'track', event: 'Unknown Event', properties: {} } });
    integration.page({ message: { type: 'page', properties: {} } });
    integration.track({ message: { type: 'track', event: 'Mobile Install', properties: {} } });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event mapping not found for Unknown Event'),
      ),
    ).toBe(true);
    expect(
      console.error.mock.calls.some(call => call[0].includes('OpenAI Ads source event key is required')),
    ).toBe(true);
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event app_installed is unsupported by Measurement Pixel'),
      ),
    ).toBe(true);
  });

  test('handles page and screen source names through event mapping', () => {
    const integration = initForCalls();

    integration.page({
      message: {
        type: 'page',
        name: 'Landing Page',
        messageId: 'page-id',
        context: { page: { url: 'https://example.com/landing' } },
      },
    });
    integration.screen({
      message: {
        type: 'screen',
        name: 'Home Screen',
        messageId: 'screen-id',
        context: { page: { url: 'https://example.com/home' } },
      },
    });

    expect(window.oaiq).toHaveBeenCalledWith(
      'measureSingle',
      'pixel-123',
      'page_viewed',
      {
        type: 'contents',
        action_source: 'web',
        source_url: 'https://example.com/landing',
      },
      { id: 'page-id' },
    );
    expect(window.oaiq).toHaveBeenCalledWith(
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        action_source: 'web',
        source_url: 'https://example.com/home',
      },
      { id: 'screen-id' },
    );
  });

  test('maps plan enrollment events with amount, currency, and contents', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Subscription Created',
        messageId: 'subscription-id',
        properties: {
          amount: '25.00',
          currency: 'USD',
          contents: [
            { id: 'plan-pro', name: 'Pro plan', quantity: 1, variantDict: 'blue' },
            { id: 'plan-basic', currency: 'US' },
          ],
        },
        context: { page: { url: 'https://example.com/subscribe' } },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'subscription_created',
      {
        type: 'plan_enrollment',
        action_source: 'web',
        source_url: 'https://example.com/subscribe',
        amount: 2500,
        currency: 'USD',
        contents: [
          { id: 'plan-pro', name: 'Pro plan', quantity: 1 },
          { id: 'plan-basic' },
        ],
      },
      { id: 'subscription-id' },
    ]);
  });

  test('skips invalid action sources, opt out values, currency, and deduplication paths', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: { action_source: 'invalid_source', source_url: 'https://example.com/item' },
      },
    });
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: { optOut: 'true', source_url: 'https://example.com/item' },
      },
    });
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: { currency: 'NOPE', source_url: 'https://example.com/item' },
      },
    });
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: { orderId: { id: 'not-scalar' }, source_url: 'https://example.com/item' },
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('Unsupported OpenAI Ads action_source: invalid_source'),
      ),
    ).toBe(true);
    expect(console.error.mock.calls.some(call => call[0].includes('opt_out must be a boolean'))).toBe(
      true,
    );
    expect(console.error.mock.calls.some(call => call[0].includes('Unsupported currency code: NOPE'))).toBe(
      true,
    );
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes(
          'OpenAI Ads deduplication key "properties.orderId" must resolve to a scalar value',
        ),
      ),
    ).toBe(true);
  });

  test('updates pixel user data before measuring and does not put user under eventData', () => {
    const integration = initForCalls();
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-user',
        traits: { email: 'event-user@example.com' },
        properties: {},
        context: { page: { url: 'https://example.com/product' } },
      },
    });

    expect(getUserInitCall()).toEqual([
      'init',
      { user: { emails_sha256: [sha256('event-user@example.com').toString()] } },
    ]);
    expect(getMeasureCall()[3]).not.toHaveProperty('user');
    expect(window.oaiq.mock.calls[0][0]).toBe('init');
    expect(window.oaiq.mock.calls[1][0]).toBe('measureSingle');
  });

  test('reads __obref at send time without caching it', () => {
    const integration = initForCalls();

    document.cookie = '__obref=first-obref';
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'first',
        properties: {},
        context: { page: { url: 'https://example.com/first' } },
      },
    });
    document.cookie = '__obref=; Max-Age=0';
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'second',
        properties: {},
        context: { page: { url: 'https://example.com/second' } },
      },
    });

    expect(window.oaiq.mock.calls[0]).toEqual(['init', { user: { obref: 'first-obref' } }]);
    expect(window.oaiq.mock.calls[2]).toEqual(['init', { user: {} }]);
    expect(window.oaiq.mock.calls.filter(call => call[0] === 'init')).toHaveLength(2);
    expect(window.oaiq.mock.calls.filter(call => call[0] === 'measureSingle')).toHaveLength(2);
  });

  test('honors client-side allowlist, denylist, and disabled filtering settings', () => {
    const allowlisted = initForCalls({
      eventFilteringOption: { web: 'whitelistedEvents' },
      whitelistedEvents: { web: [{ eventName: 'Product Viewed' }] },
    });
    allowlisted.track({ message: { type: 'track', event: 'Trial Signup', properties: {} } });
    expect(window.oaiq).not.toHaveBeenCalled();

    const denylisted = initForCalls({
      eventFilteringOption: { web: 'blacklistedEvents' },
      blacklistedEvents: { web: [{ eventName: 'Product Viewed' }] },
    });
    denylisted.track({ message: { type: 'track', event: 'Product Viewed', properties: {} } });
    expect(window.oaiq).not.toHaveBeenCalled();

    const disabled = initForCalls({ eventFilteringOption: { web: 'disable' } });
    disabled.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: {},
        context: { page: { url: 'https://example.com/product' } },
      },
    });
    expect(getMeasureCall()).toBeTruthy();
  });
});

describe('OpenAIAds currency helper', () => {
  test('converts ISO-4217 major units to minor units and rejects invalid precision/currencies', () => {
    expect(toMinorUnits('129.99', 'usd')).toBe(12999);
    expect(toMinorUnits(129, 'JPY')).toBe(129);
    expect(toMinorUnits('1.234', 'KWD')).toBe(1234);
    expect(toMinorUnits('1.2', 'JPY')).toBeUndefined();
    expect(toMinorUnits(1, 'NOPE')).toBeUndefined();
    expect(toMinorUnits('-1.23', 'USD')).toBeUndefined();
  });
});
