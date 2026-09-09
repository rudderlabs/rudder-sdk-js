import sha256 from 'crypto-js/sha256';
import OpenAIAds from '../../../src/integrations/OpenAIAds/browser';
import OpenAIAdsDefault, { OpenAIAds as OpenAIAdsNamed } from '../../../src/integrations/OpenAIAds';
import { integrations } from '../../../src/integrations';
import { PIXEL_URL } from '../../../src/integrations/OpenAIAds/constants';
import { toMinorUnits } from '../../../src/integrations/OpenAIAds/currency';
import { resetNativeSdkLoaderForTests } from '../../../src/integrations/OpenAIAds/nativeSdkLoader';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { configToIntNames } from '../../../../analytics-js-legacy-utilities/src/config_to_integration_names';

const baseConfig = {
  pixelId: 'pixel-123',
  eventMapping: [
    { from: 'Product Viewed', to: 'contents_viewed', deduplicationKey: 'properties.orderId' },
    { from: 'Trial Signup', to: 'custom', customEventName: 'TrialSignupCustom' },
    { from: 'Landing Page', to: 'page_viewed' },
    { from: 'Mobile Install', to: 'app_installed' },
    { from: 'Subscription Created', to: 'subscription_created' },
  ],
  defaultCurrency: 'USD',
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

beforeEach(() => {
  document.head.innerHTML = '<script id="dummyScript"></script>';
  document.cookie = '__obref=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
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
    expect(configToIntNames.OPENAI_ADS).toBe('OpenAIAds');
  });

  test('exports the default and named constructors for registry and CDN loading', () => {
    expect(OpenAIAdsDefault).toBe(OpenAIAds);
    expect(OpenAIAdsNamed).toBe(OpenAIAds);
  });

  test('loads the Measurement Pixel once and initializes with pixelId only', () => {
    const integration = makeIntegration({ apiKey: 'secret-api-key' });
    integration.init();

    const script = document.getElementById('openai-ads-measurement-pixel');
    expect(script.src).toBe(PIXEL_URL);
    expect(script.getAttribute('data-loader')).toBe('RS_JS_SDK');
    expect(Array.from(window.oaiq.q[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
    expect(JSON.stringify(window.oaiq.q)).not.toContain('secret-api-key');
    expect(integration.isLoaded()).toBe(true);
    expect(integration.isReady()).toBe(true);

    const secondIntegration = makeIntegration();
    secondIntegration.init();
    expect(document.querySelectorAll(`script[src="${PIXEL_URL}"]`)).toHaveLength(1);
    expect(window.oaiq.q).toHaveLength(2);
  });

  test('stays inert but resolves readiness immediately when pixelId is missing', () => {
    const integration = makeIntegration({ pixelId: undefined });

    expect(() => {
      integration.identify({
        message: { type: 'identify', context: { traits: { email: 'person@example.com' } } },
      });
      integration.track({
        message: { type: 'track', event: 'Product Viewed', properties: {} },
      });
    }).not.toThrow();

    // The pixel is never loaded and no call is made, but readiness resolves right away so a
    // destination saved without a pixelId does not stall device-mode delivery for its peers.
    expect(window.oaiq).toBeUndefined();
    expect(integration.isLoaded()).toBe(true);
    expect(integration.isReady()).toBe(true);
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

    expect(Array.from(window.oaiq.q[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
    expect(Array.from(window.oaiq.q[1])).toEqual([
      'init',
      { pixelId: 'pixel-123', user: { email_sha256: sha256('person@example.com').toString() } },
    ]);
    expect(document.querySelectorAll(`script[src="${PIXEL_URL}"]`)).toHaveLength(1);
  });

  test('uses the pixel queue when the script tag already exists', () => {
    document.head.innerHTML = `<script id="openai-ads-measurement-pixel" src="${PIXEL_URL}"></script>`;
    const integration = makeIntegration();

    integration.init();

    expect(integration.isReady()).toBe(true);
    expect(document.querySelectorAll('#openai-ads-measurement-pixel')).toHaveLength(1);
    expect(Array.from(window.oaiq.q[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
  });

  test('seeds restored user data once during init', () => {
    const integration = makeIntegration(
      {},
      {
        getUserId: () => 'Stored-User',
        getUserTraits: () => ({ email: 'stored@example.com', firstName: 'Stored User' }),
      },
    );

    integration.init();

    expect(Array.from(window.oaiq.q[0])).toEqual(['init', { pixelId: 'pixel-123' }]);
    expect(Array.from(window.oaiq.q[1])).toEqual([
      'init',
      {
        pixelId: 'pixel-123',
        user: {
          email_sha256: sha256('stored@example.com').toString(),
          external_id_sha256: sha256('Stored-User').toString(),
          first_name_sha256: sha256('storeduser').toString(),
        },
      },
    ]);
  });
});

describe('OpenAIAds identify', () => {
  test('sets hashed scalar user data with the spec init signature', () => {
    const integration = initForCalls();
    integration.identify({
      message: {
        type: 'identify',
        userId: 'User-123',
        context: {
          traits: {
            email: ' Person@Example.COM ',
            phone: ' +1 (555) 120-0100 ',
            firstName: ' Mary Jane ',
            lastName: " O'Connor ",
            obref: 'not-forwarded',
            city: ' San Francisco ',
            country: 'US',
          },
          ip: '192.0.2.1',
          userAgent: 'Mozilla/5.0',
        },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(1);
    expect(window.oaiq).toHaveBeenCalledWith('init', {
      pixelId: 'pixel-123',
      user: {
        email_sha256: sha256('person@example.com').toString(),
        phone_number_sha256: sha256('15551200100').toString(),
        external_id_sha256: sha256('User-123').toString(),
        first_name_sha256: sha256('maryjane').toString(),
        last_name_sha256: sha256('oconnor').toString(),
        city: 'San Francisco',
        country: 'US',
      },
    });
  });

  test('skips identify when there is no usable user data', () => {
    const integration = initForCalls();
    integration.identify({
      message: { type: 'identify', context: { traits: { email: 'not-valid' } } },
    });

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

  test('skips non-scalar trait paths and falls through to later ones', () => {
    const integration = initForCalls();

    integration.identify({
      message: {
        type: 'identify',
        context: {
          traits: { email: 'person@example.com' },
          userAgent: 'Mozilla/5.0',
        },
        request_ip: '5.6.7.8',
      },
    });

    expect(window.oaiq).toHaveBeenCalledWith('init', {
      pixelId: 'pixel-123',
      user: {
        email_sha256: sha256('person@example.com').toString(),
      },
    });
  });

  test('prefers userId over anonymousId for the external id', () => {
    const integration = initForCalls();

    integration.identify({
      message: {
        type: 'identify',
        userId: 'User-123',
        anonymousId: 'anon-abc',
        context: { traits: {} },
      },
    });

    expect(window.oaiq).toHaveBeenCalledWith('init', {
      pixelId: 'pixel-123',
      user: { external_id_sha256: sha256('User-123').toString() },
    });
  });

  test('falls back to anonymousId for the external id when userId is absent', () => {
    const integration = initForCalls();

    integration.identify({
      message: {
        type: 'identify',
        anonymousId: 'anon-abc',
        context: { traits: { email: 'person@example.com' } },
      },
    });

    expect(window.oaiq).toHaveBeenCalledWith('init', {
      pixelId: 'pixel-123',
      user: {
        email_sha256: sha256('person@example.com').toString(),
        external_id_sha256: sha256('anon-abc').toString(),
      },
    });
  });

  test('ignores trait and context external ids for the external id', () => {
    const integration = initForCalls();

    integration.identify({
      message: {
        type: 'identify',
        context: {
          traits: {
            externalId: 'trait-external-id',
            external_ids: ['legacy-external-id'],
            email: 'person@example.com',
          },
        },
      },
    });

    expect(window.oaiq).toHaveBeenCalledWith('init', {
      pixelId: 'pixel-123',
      user: { email_sha256: sha256('person@example.com').toString() },
    });
  });

  test('seeds the external id from anonymousId for an anonymous visitor', () => {
    const integration = makeIntegration({}, { getAnonymousId: () => 'anon-seeded' });

    integration.init();

    expect(Array.from(window.oaiq.q[1])).toEqual([
      'init',
      { pixelId: 'pixel-123', user: { external_id_sha256: sha256('anon-seeded').toString() } },
    ]);
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
        pixelId: 'pixel-123',
        user: {
          email_sha256: sha256('new@example.com').toString(),
          external_id_sha256: sha256('new-user').toString(),
        },
      },
    ]);
  });

  test('does not republish stale traits when identify logs out', () => {
    const integration = initForCalls({}, { getUserId: () => 'old-user' });

    integration.identify({
      message: {
        type: 'identify',
        userId: '',
        context: {
          traits: {
            email: 'old@example.com',
            phone: '+1 (555) 120-0100',
          },
        },
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(1);
    expect(window.oaiq).toHaveBeenCalledWith('init', { pixelId: 'pixel-123', user: {} });
  });
});

describe('OpenAIAds conversion events', () => {
  test('fires mapped standard track events with pixel event data and event options', () => {
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
          oppref: 'not-forwarded',
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
        currency: 'USD',
        amount: 12999,
        contents: [
          {
            id: 'sku-1',
            name: 'Product One',
            quantity: 2,
            currency: 'USD',
            amount: 1234,
          },
        ],
      },
      { event_id: 'order-123', opt_out: true },
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
      },
    });

    expect(window.oaiq).toHaveBeenCalledTimes(2);
    expect(window.oaiq.mock.calls[0]).toEqual(['init', { pixelId: 'pixel-123', user: {} }]);
    expect(window.oaiq.mock.calls[1]).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      { type: 'contents' },
      { event_id: 'post-reset' },
    ]);
    expect(window.oaiq).not.toHaveBeenCalledWith('init', { pixelId: 'pixel-123' });
  });

  test('does not clear pixel user state when userId is omitted or numeric zero is current', () => {
    const integration = initForCalls({}, { getUserId: () => 0 });

    integration.track({
      message: {
        type: 'track',
        userId: 0,
        event: 'Product Viewed',
        messageId: 'numeric-zero',
        properties: {},
      },
    });

    expect(window.oaiq).not.toHaveBeenCalledWith('init', { pixelId: 'pixel-123', user: {} });
    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      { type: 'contents' },
      { event_id: 'numeric-zero' },
    ]);
  });

  test('fires mapped custom events with literal custom event name and messageId fallback', () => {
    const integration = initForCalls();
    integration.track({
      message: {
        type: 'track',
        event: 'Trial Signup',
        messageId: 'msg-123',
        properties: {
          amount: 10,
          plan_id: 'trial-plan',
          customFlag: true,
          email: 'drop@example.com',
        },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'custom',
      {
        type: 'custom',
        currency: 'USD',
        amount: 1000,
        plan_id: 'trial-plan',
      },
      { event_id: 'msg-123', custom_event_name: 'TrialSignupCustom' },
    ]);
  });

  test('skips custom mappings with invalid custom event names', () => {
    const integration = initForCalls({
      eventMapping: [{ from: 'Trial Signup', to: 'custom', customEventName: 'Trial Started' }],
    });

    integration.track({
      message: { type: 'track', event: 'Trial Signup', messageId: 'msg-123', properties: {} },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads custom event mapping has invalid customEventName'),
      ),
    ).toBe(true);
  });

  test('skips exact OpenAI standard event names without mapping', () => {
    const integration = initForCalls({ eventMapping: [] });
    integration.track({
      message: {
        type: 'track',
        event: 'order_created',
        messageId: 'msg-456',
        properties: {},
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event mapping not found for order_created'),
      ),
    ).toBe(true);
  });

  test('reports invalid mapping destinations distinctly from missing mappings', () => {
    const integration = initForCalls({
      eventMapping: [{ from: 'Product Viewed', to: 'not_a_pixel_event' }],
    });

    integration.track({
      message: { type: 'track', event: 'Product Viewed', messageId: 'invalid-map' },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes(
          'OpenAI Ads event mapping for Product Viewed has invalid destination not_a_pixel_event',
        ),
      ),
    ).toBe(true);
  });

  test('maps events named after Object prototype members', () => {
    const integration = initForCalls({
      eventMapping: [{ from: 'constructor', to: 'order_created' }],
    });

    integration.track({
      message: {
        type: 'track',
        event: 'constructor',
        messageId: 'proto-id',
        properties: {},
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'order_created',
      { type: 'contents' },
      { event_id: 'proto-id' },
    ]);
  });

  test('does not resolve unmapped Object prototype members as event mappings', () => {
    const integration = initForCalls({ eventMapping: [] });

    integration.track({
      message: {
        type: 'track',
        event: 'constructor',
        messageId: 'proto-id',
        properties: {},
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event mapping not found for constructor'),
      ),
    ).toBe(true);
  });

  test('does not require source URL or forward CAPI-only attribution fields', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'no-source-url',
        properties: { action_source: 'web', source_url: 'https://example.com/item' },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      { type: 'contents' },
      { event_id: 'no-source-url' },
    ]);
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
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads source event key is required'),
      ),
    ).toBe(true);
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes('OpenAI Ads event app_installed is unsupported by Measurement Pixel'),
      ),
    ).toBe(true);
  });

  test('handles page source names through event mapping', () => {
    const integration = initForCalls();

    integration.page({
      message: { type: 'page', name: 'Landing Page', messageId: 'page-id' },
    });

    expect(window.oaiq).toHaveBeenCalledWith(
      'measureSingle',
      'pixel-123',
      'page_viewed',
      { type: 'contents' },
      { event_id: 'page-id' },
    );
  });

  test('maps plan enrollment events with plan_id, amount, currency, and contents', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Subscription Created',
        messageId: 'subscription-id',
        properties: {
          amount: '25.00',
          currency: 'USD',
          planId: 'pro_monthly',
          contents: [
            { id: 'plan-pro', name: 'Pro plan', quantity: 1, variantDict: 'blue' },
            { id: 'plan-basic', currency: 'US' },
          ],
        },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'subscription_created',
      {
        type: 'plan_enrollment',
        amount: 2500,
        currency: 'USD',
        plan_id: 'pro_monthly',
        contents: [{ id: 'plan-pro', name: 'Pro plan', quantity: 1 }, { id: 'plan-basic' }],
      },
      { event_id: 'subscription-id' },
    ]);
  });

  test('drops unusable optional amount and quantity values without dropping the event', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'bad-optionals',
        properties: {
          amount: '25.999',
          currency: 'USD',
          contents: [{ id: 'sku-1', quantity: 0, price: '10.999' }],
        },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        contents: [{ id: 'sku-1' }],
      },
      { event_id: 'bad-optionals' },
    ]);
  });

  test('falls back to products when contents is present but empty', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'products-fallback',
        properties: {
          contents: [],
          products: [{ product_id: 'sku-2', name: 'Product Two', price: '5.00' }],
        },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      {
        type: 'contents',
        contents: [{ id: 'sku-2', name: 'Product Two', amount: 500, currency: 'USD' }],
      },
      { event_id: 'products-fallback' },
    ]);
  });

  test('skips only non-scalar deduplication paths', () => {
    const integration = initForCalls();

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        properties: { orderId: { id: 'not-scalar' } },
      },
    });

    expect(window.oaiq).not.toHaveBeenCalled();
    expect(
      console.error.mock.calls.some(call =>
        call[0].includes(
          'OpenAI Ads deduplication key "properties.orderId" must resolve to a scalar value',
        ),
      ),
    ).toBe(true);
  });

  test('does not resolve prototype-chain segments in configured deduplication paths', () => {
    const integration = initForCalls({
      eventMapping: [
        {
          from: 'Product Viewed',
          to: 'contents_viewed',
          deduplicationKey: 'properties.constructor',
        },
      ],
    });

    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'safe-fallback',
        properties: { constructor: 'polluted-id' },
      },
    });

    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'contents_viewed',
      { type: 'contents' },
      { event_id: 'safe-fallback' },
    ]);
  });

  test('does not update pixel user data from per-event traits before measuring', () => {
    const integration = makeIntegration(
      {},
      {
        getUserId: () => 'Stored-User',
        getUserTraits: () => ({ email: 'stored@example.com' }),
      },
    );
    integration.init();
    expect(Array.from(window.oaiq.q[1])).toEqual([
      'init',
      {
        pixelId: 'pixel-123',
        user: {
          email_sha256: sha256('stored@example.com').toString(),
          external_id_sha256: sha256('Stored-User').toString(),
        },
      },
    ]);

    window.oaiq = jest.fn();
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'msg-user',
        traits: { email: 'event-user@example.com' },
        properties: {},
      },
    });

    expect(window.oaiq.mock.calls.filter(call => call[0] === 'init')).toHaveLength(0);
    expect(getMeasureCall()[3]).not.toHaveProperty('user');
    expect(window.oaiq.mock.calls[0][0]).toBe('measureSingle');
  });

  test('does not forward __obref cookie because the pixel handles it', () => {
    const integration = initForCalls();

    document.cookie = '__obref=first-obref';
    integration.track({
      message: {
        type: 'track',
        event: 'Product Viewed',
        messageId: 'first',
        properties: {},
      },
    });

    expect(window.oaiq.mock.calls.filter(call => call[0] === 'init')).toHaveLength(0);
    expect(window.oaiq.mock.calls.filter(call => call[0] === 'measureSingle')).toHaveLength(1);
    expect(JSON.stringify(getMeasureCall())).not.toContain('first-obref');
  });

  test('does not merge arbitrary custom properties or pollution keys into custom event data', () => {
    const integration = initForCalls();
    const properties = { amount: 10, customFlag: true, prototype: { polluted: true } };
    Object.defineProperty(properties, '__proto__', {
      value: { polluted: true },
      enumerable: true,
    });
    properties.constructor = { prototype: { polluted: true } };

    integration.track({
      message: {
        type: 'track',
        event: 'Trial Signup',
        messageId: 'pollution-test',
        properties,
      },
    });

    expect({}.polluted).toBeUndefined();
    expect(getMeasureCall()).toEqual([
      'measureSingle',
      'pixel-123',
      'custom',
      {
        type: 'custom',
        currency: 'USD',
        amount: 1000,
      },
      { event_id: 'pollution-test', custom_event_name: 'TrialSignupCustom' },
    ]);
  });
});

describe('OpenAIAds currency helper', () => {
  test('converts ISO-4217 major units to minor units and rejects invalid values', () => {
    expect(toMinorUnits('129.99', 'usd')).toBe(12999);
    expect(toMinorUnits('129.0', 'JPY')).toBe(129);
    expect(toMinorUnits('1.2300', 'USD')).toBe(123);
    expect(toMinorUnits('1.234', 'KWD')).toBe(1234);
    expect(toMinorUnits('1.2', 'JPY')).toBeUndefined();
    expect(toMinorUnits(1, 'NOPE')).toBeUndefined();
    expect(toMinorUnits('-1.23', 'USD')).toBeUndefined();
  });
});
