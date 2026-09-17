import { errorMock } from '../../../__mocks__/logger';
import CustomerIO from '../../../src/integrations/CustomerIO/browser';
import { getSdkVersion } from '../../../src/integrations/CustomerIO/utils';

const V1_SDK_URL = 'https://assets.customer.io/assets/track.js';
const V1_SDK_URL_EU = 'https://assets.customer.io/assets/track-eu.js';
const WRITE_KEY = 'CIO_WRITE_KEY';
const V2_SDK_URL = `https://cdp.customer.io/v1/analytics-js/snippet/${WRITE_KEY}/analytics.min.js`;
const V2_SDK_URL_EU = `https://cdp-eu.customer.io/v1/analytics-js/snippet/${WRITE_KEY}/analytics.min.js`;
const ANONYMOUS_ID = 'ANONYMOUS_ID';

const v1Config = {
  siteID: 'SITE_ID',
  apiKey: 'API_KEY',
  datacenter: 'US',
  dataUseInApp: true,
  sendPageNameInSDK: true,
};

const v2Config = {
  sdkVersion: 'v2',
  writeKey: WRITE_KEY,
  datacenter: 'US',
  sendPageNameInSDK: true,
};

const analyticsInstance = {
  logLevel: 'DEBUG',
  getAnonymousId: () => ANONYMOUS_ID,
};

const destinationInfo = {
  shouldApplyDeviceModeTransformation: false,
  propagateEventsUntransformedOnError: false,
  destinationId: 'DEST_ID',
};

const removeInjectedScripts = () => {
  document.querySelectorAll('script[data-loader]').forEach(script => script.remove());
};

const resetGlobals = () => {
  delete window._cio;
  delete window.cioanalytics;
};

const queuedCall = (queue, method) => queue.find(call => call[0] === method);

describe('CustomerIO', () => {
  beforeAll(() => {
    // The loaders insert the SDK script before the first script on the page.
    const anchorScript = document.createElement('script');
    document.head.appendChild(anchorScript);
  });

  beforeEach(() => {
    resetGlobals();
    removeInjectedScripts();
    errorMock.mockClear();
  });

  describe('getSdkVersion', () => {
    it.each([
      [undefined, 'v1'],
      [null, 'v1'],
      ['v1', 'v1'],
      ['v2', 'v2'],
      ['V2', 'v1'],
      [2, 'v1'],
      ['2', 'v1'],
      ['v3', 'v1'],
      [true, 'v1'],
    ])('resolves sdkVersion %p to %p', (sdkVersion, expected) => {
      expect(getSdkVersion({ sdkVersion })).toBe(expected);
    });

    it('resolves a missing config to v1', () => {
      expect(getSdkVersion(undefined)).toBe('v1');
    });
  });

  describe('init (1.x)', () => {
    it('loads the legacy snippet with the Site ID when sdkVersion is missing', () => {
      const customerio = new CustomerIO(v1Config, analyticsInstance, destinationInfo);
      customerio.init();

      const script = document.querySelector(`script[src="${V1_SDK_URL}"]`);
      expect(script).toBeTruthy();
      expect(script.getAttribute('data-site-id')).toBe('SITE_ID');
      expect(script.getAttribute('data-use-in-app')).toBe('true');
      expect(window._cio).toBeDefined();
      expect(window.cioanalytics).toBeUndefined();
    });

    it('loads the legacy snippet when sdkVersion is explicitly v1', () => {
      const customerio = new CustomerIO(
        { ...v1Config, sdkVersion: 'v1' },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(document.querySelector(`script[src="${V1_SDK_URL}"]`)).toBeTruthy();
    });

    it('loads the EU legacy snippet for the EU datacenter', () => {
      const customerio = new CustomerIO(
        { ...v1Config, datacenter: 'EU' },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(document.querySelector(`script[src="${V1_SDK_URL_EU}"]`)).toBeTruthy();
    });
  });

  describe('init (2.x)', () => {
    it('loads the JavaScript client with the write key and no In-App Plugin option', () => {
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.init();

      const script = document.querySelector(`script[src="${V2_SDK_URL}"]`);
      expect(script).toBeTruthy();
      expect(script.getAttribute('data-global-customerio-analytics-key')).toBe('cioanalytics');
      expect(script.getAttribute('data-loader')).toBeTruthy();
      expect(script.async).toBe(true);
      expect(window.cioanalytics._writeKey).toBe(WRITE_KEY);
      expect(window.cioanalytics._loadOptions).toStrictEqual({});
      expect(window._cio).toBeUndefined();
    });

    it('loads from the EU CDN host for the EU datacenter', () => {
      const customerio = new CustomerIO(
        { ...v2Config, datacenter: 'EU' },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(document.querySelector(`script[src="${V2_SDK_URL_EU}"]`)).toBeTruthy();
    });

    it('treats a legacy integer sdkVersion as 1.x', () => {
      const customerio = new CustomerIO(
        { ...v2Config, sdkVersion: 2 },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(document.querySelector(`script[src="${V2_SDK_URL}"]`)).toBeNull();
      expect(document.querySelector(`script[src="${V1_SDK_URL}"]`)).toBeTruthy();
    });

    it('queues setAnonymousId with the RudderStack anonymous ID', () => {
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.init();

      expect(queuedCall(window.cioanalytics, 'setAnonymousId')).toStrictEqual([
        'setAnonymousId',
        ANONYMOUS_ID,
      ]);
    });

    it('does not queue setAnonymousId when there is no anonymous ID', () => {
      const customerio = new CustomerIO(
        v2Config,
        { ...analyticsInstance, getAnonymousId: () => undefined },
        destinationInfo,
      );
      customerio.init();

      expect(queuedCall(window.cioanalytics, 'setAnonymousId')).toBeUndefined();
    });

    it('does not call page() from the loader', () => {
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.init();

      expect(queuedCall(window.cioanalytics, 'page')).toBeUndefined();
    });

    it('passes the In-App Plugin option only when anonymousInApp is on', () => {
      const customerio = new CustomerIO(
        { ...v2Config, anonymousInApp: true },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(window.cioanalytics._loadOptions).toStrictEqual({
        integrations: { 'Customer.io In-App Plugin': { anonymousInApp: true } },
      });
    });

    it('never passes a siteId to the In-App Plugin', () => {
      const customerio = new CustomerIO(
        { ...v2Config, anonymousInApp: true, siteID: 'SITE_ID' },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(JSON.stringify(window.cioanalytics._loadOptions)).not.toContain('SITE_ID');
      expect(
        window.cioanalytics._loadOptions.integrations['Customer.io In-App Plugin'].siteId,
      ).toBeUndefined();
    });

    it('ignores a non-boolean anonymousInApp value', () => {
      const customerio = new CustomerIO(
        { ...v2Config, anonymousInApp: 'true' },
        analyticsInstance,
        destinationInfo,
      );
      customerio.init();

      expect(window.cioanalytics._loadOptions).toStrictEqual({});
    });

    it('throws and injects nothing when writeKey is empty', () => {
      const customerio = new CustomerIO(
        { ...v2Config, writeKey: '' },
        analyticsInstance,
        destinationInfo,
      );

      expect(() => customerio.init()).toThrow(
        'writeKey is required to load the Customer.io JavaScript client (SDK version 2.x); aborting load',
      );
      expect(document.querySelector('script[data-global-customerio-analytics-key]')).toBeNull();
      expect(window.cioanalytics).toBeUndefined();
    });

    it('does not reinstall the stub when the client snippet is already on the page', () => {
      const existingQueue = [];
      existingQueue.invoked = true;
      existingQueue.setAnonymousId = jest.fn();
      window.cioanalytics = existingQueue;

      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.init();

      expect(document.querySelector(`script[src="${V2_SDK_URL}"]`)).toBeNull();
      expect(existingQueue.setAnonymousId).toHaveBeenCalledWith(ANONYMOUS_ID);
    });
  });

  describe('isLoaded / isReady', () => {
    it('reports loaded on 1.x once the legacy snippet replaced the queue', () => {
      const customerio = new CustomerIO(v1Config, analyticsInstance, destinationInfo);
      customerio.init();
      expect(customerio.isLoaded()).toBe(false);
      expect(customerio.isReady()).toBe(false);

      window._cio.push = jest.fn();
      expect(customerio.isLoaded()).toBe(true);
      expect(customerio.isReady()).toBe(true);
    });

    it('reports loaded on 2.x only once the client sets initialized', () => {
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      expect(customerio.isLoaded()).toBe(false);

      customerio.init();
      expect(customerio.isLoaded()).toBe(false);
      expect(customerio.isReady()).toBe(false);

      window.cioanalytics.initialized = true;
      expect(customerio.isLoaded()).toBe(true);
      expect(customerio.isReady()).toBe(true);
    });
  });

  describe('identify', () => {
    const identifyElement = {
      message: {
        userId: 'USER_ID',
        context: {
          traits: { email: 'user@example.com', createdAt: '2024-01-01T00:00:00.000Z' },
        },
      },
    };

    it('calls the legacy client with the id inside the traits on 1.x', () => {
      window._cio = { identify: jest.fn() };
      const customerio = new CustomerIO(v1Config, analyticsInstance, destinationInfo);
      customerio.identify(JSON.parse(JSON.stringify(identifyElement)));

      expect(window._cio.identify).toHaveBeenCalledWith({
        id: 'USER_ID',
        email: 'user@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        created_at: 1704067200,
      });
    });

    it('calls the client with the id as its own argument on 2.x', () => {
      window.cioanalytics = { identify: jest.fn() };
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.identify(JSON.parse(JSON.stringify(identifyElement)));

      expect(window.cioanalytics.identify).toHaveBeenCalledWith('USER_ID', {
        email: 'user@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        created_at: 1704067200,
      });
    });

    it('works without traits on 2.x', () => {
      window.cioanalytics = { identify: jest.fn() };
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.identify({ message: { userId: 'USER_ID' } });

      expect(window.cioanalytics.identify).toHaveBeenCalledWith('USER_ID', {});
    });

    it.each([
      ['1.x', v1Config],
      ['2.x', v2Config],
    ])('logs an error and does not call the client without a userId on %s', (_, config) => {
      window._cio = { identify: jest.fn() };
      window.cioanalytics = { identify: jest.fn() };
      const customerio = new CustomerIO(config, analyticsInstance, destinationInfo);
      customerio.identify({ message: { context: { traits: { email: 'user@example.com' } } } });

      expect(errorMock).toHaveBeenCalledWith('userId is required for Identify call');
      expect(window._cio.identify).not.toHaveBeenCalled();
      expect(window.cioanalytics.identify).not.toHaveBeenCalled();
    });
  });

  describe('track', () => {
    const trackElement = { message: { event: 'Order Completed', properties: { total: 10 } } };

    it('forwards the event to the legacy client on 1.x', () => {
      window._cio = { track: jest.fn() };
      const customerio = new CustomerIO(v1Config, analyticsInstance, destinationInfo);
      customerio.track(trackElement);

      expect(window._cio.track).toHaveBeenCalledWith('Order Completed', { total: 10 });
    });

    it('forwards the event to the client on 2.x', () => {
      window.cioanalytics = { track: jest.fn() };
      const customerio = new CustomerIO(v2Config, analyticsInstance, destinationInfo);
      customerio.track(trackElement);

      expect(window.cioanalytics.track).toHaveBeenCalledWith('Order Completed', { total: 10 });
    });
  });

  describe('page', () => {
    const pageElement = {
      message: { name: 'Home', properties: { url: 'https://example.com/', title: 'Home' } },
    };

    it.each([
      ['1.x', v1Config, '_cio'],
      ['2.x', v2Config, 'cioanalytics'],
    ])('sends the page name and properties on %s', (_, config, globalName) => {
      window[globalName] = { page: jest.fn() };
      const customerio = new CustomerIO(config, analyticsInstance, destinationInfo);
      customerio.page(pageElement);

      expect(window[globalName].page).toHaveBeenCalledWith('Home', pageElement.message.properties);
    });

    it.each([
      ['1.x', v1Config, '_cio'],
      ['2.x', v2Config, 'cioanalytics'],
    ])('falls back to the URL as the page name on %s', (_, config, globalName) => {
      window[globalName] = { page: jest.fn() };
      const customerio = new CustomerIO(config, analyticsInstance, destinationInfo);
      customerio.page({ message: { properties: pageElement.message.properties } });

      expect(window[globalName].page).toHaveBeenCalledWith(
        'https://example.com/',
        pageElement.message.properties,
      );
    });

    it.each([
      ['1.x', v1Config, '_cio'],
      ['2.x', v2Config, 'cioanalytics'],
    ])('sends only properties when sendPageNameInSDK is off on %s', (_, config, globalName) => {
      window[globalName] = { page: jest.fn() };
      const customerio = new CustomerIO(
        { ...config, sendPageNameInSDK: false },
        analyticsInstance,
        destinationInfo,
      );
      customerio.page(pageElement);

      expect(window[globalName].page).toHaveBeenCalledWith(pageElement.message.properties);
    });
  });
});
