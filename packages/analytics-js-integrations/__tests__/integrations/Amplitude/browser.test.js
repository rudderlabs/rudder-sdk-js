/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
import { errorMock } from '../../../__mocks__/logger';
import Amplitude from '../../../src/integrations/Amplitude/browser';

const AMPLITUDE_V1_SDK_URL = 'https://cdn.amplitude.com/libs/analytics-browser-1.9.1-min.js.gz';
const AMPLITUDE_V2_SDK_URL = 'https://cdn.amplitude.com/libs/analytics-browser-2.32.0-min.js.gz';
const AMPLITUDE_V1_SDK_INTEGRITY =
  'sha384-TPZhteUkZj8CAyBx+GZZytBdkuKnhKsSKcCoVCq0QSteWf/Kw5Kb9oVFUROLE1l3';
const AMPLITUDE_V2_SDK_INTEGRITY =
  'sha384-hZ3s3uB8PfU4QYbgXXtU9kEy7lt8i7kRKIWzbVjnS//GQSyv42iEVDEniwLASsSh';

const destinationConfig = {
  apiKey: 'AMPLITUDE_API_KEY',
  proxyServerUrl: 'https://some.proxyserverurl.com',
  groupTypeTrait: 'email',
  attribution: true,
  trackNewCampaigns: false,
  eventUploadThreshold: 50,
  eventUploadPeriodMillis: 2000,
  groupValueTrait: 'age',
  versionName: '1.0.0',
  preferAnonymousIdForDeviceId: true,
  traitsToIncrement: [
    {
      traits: 'age',
    },
    {
      traits: 'friends',
    },
  ],
  traitsToSetOnce: [
    {
      traits: 'subjects',
    },
    {
      traits: '',
    },
  ],
  traitsToAppend: [
    {
      traits: 'name',
    },
    {
      traits: '',
    },
  ],
  traitsToPrepend: [
    {
      traits: 'experience',
    },
    {
      traits: '',
    },
  ],
};

const analyticsInstance = {
  logLevel: 'DEBUG',
  getAnonymousId: () => 'ANONYMOUS_ID',
  loadIntegration: true,
};

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const defaultV2Autocapture = {
  attribution: true,
  pageViews: false,
  sessions: false,
  formInteractions: false,
  fileDownloads: false,
  elementInteractions: false,
  frustrationInteractions: false,
  networkTracking: false,
  webVitals: false,
  pageUrlEnrichment: false,
};

describe('Amplitude', () => {
  beforeAll(() => {
    // Add a dummy script as it is required by the init script
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.id = 'dummyScript';
    const headElements = document.getElementsByTagName('head');
    headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  });

  describe('init', () => {
    beforeEach(() => {
      window.amplitude = undefined;
      document
        .querySelectorAll(
          `script[src="${AMPLITUDE_V1_SDK_URL}"], script[src="${AMPLITUDE_V2_SDK_URL}"]`,
        )
        .forEach(element => element.remove());
    });

    it('should initialize the destination SDK', () => {
      const amplitude = new Amplitude(destinationConfig, analyticsInstance, destinationInfo);
      amplitude.init();

      expect(window.amplitude._q[0].name).toBe('init');
      expect(window.amplitude._q[0].args).toStrictEqual([
        'AMPLITUDE_API_KEY',
        null,
        {
          attribution: {
            disabled: true,
            trackNewCampaigns: true,
          },
          flushQueueSize: 50,
          flushIntervalMillis: 2000,
          appVersion: '1.0.0',
          serverUrl: 'https://some.proxyserverurl.com',
          deviceId: 'ANONYMOUS_ID',
        },
      ]);
    });

    it('should initialize the destination SDK if the integration is already loaded', () => {
      // Mock the amplitude object on the window
      window.amplitude = {
        init: jest.fn(),
      };

      const amplitude = new Amplitude(
        destinationConfig,
        {
          ...analyticsInstance,
          loadIntegration: false, // Indicate that the integration is already loaded
        },
        destinationInfo,
      );
      amplitude.init();

      expect(window.amplitude.init).toHaveBeenCalledWith(
        'AMPLITUDE_API_KEY',
        null,
        expect.any(Object),
      );
    });

    it('should log an error and initialize the destination SDK if the proxy server URL is not secure', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          proxyServerUrl: 'http://some.proxyserverurl.com',
        },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(errorMock).toHaveBeenCalledWith(
        'Please use a secure proxy server URL: http://some.proxyserverurl.com',
      );

      expect(window.amplitude._q[0].name).toBe('init');
      expect(window.amplitude._q[0].args).toStrictEqual([
        'AMPLITUDE_API_KEY',
        null,
        {
          attribution: {
            disabled: true,
            trackNewCampaigns: true,
          },
          flushQueueSize: 50,
          flushIntervalMillis: 2000,
          appVersion: '1.0.0',
          deviceId: 'ANONYMOUS_ID',
        },
      ]);
    });

    it('should format the proxy server URL and initialize the destination SDK if it is unformatted', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          proxyServerUrl: 'some.proxyserverurl.com/',
        },
        analyticsInstance,
        destinationInfo,
      );

      amplitude.init();

      expect(window.amplitude._q[0].args[2].serverUrl).toBe('https://some.proxyserverurl.com/');
    });

    it('should set the transport mechanism to xhr for IE browser', () => {
      const navigatorSpy = jest.spyOn(window, 'navigator', 'get');

      // Mock the navigator object for Microsoft Internet Explorer
      navigatorSpy.mockReturnValue({
        userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)',
        appVersion: '',
      });

      const amplitude = new Amplitude(destinationConfig, analyticsInstance, destinationInfo);

      amplitude.init();

      expect(window.amplitude._q[0].args[2].transport).toBe('xhr');

      // Restore the original navigator object
      navigatorSpy.mockRestore();
    });

    it('should set the transport mechanism to xhr for IE browser (relying on appVersion)', () => {
      const navigatorSpy = jest.spyOn(window, 'navigator', 'get');

      // Mock the navigator object for Microsoft Internet Explorer
      navigatorSpy.mockReturnValue({
        userAgent: '',
        appVersion: 'Trident/7.0',
      });

      const amplitude = new Amplitude(destinationConfig, analyticsInstance, destinationInfo);

      amplitude.init();

      expect(window.amplitude._q[0].args[2].transport).toBe('xhr');

      // Restore the original navigator object
      navigatorSpy.mockRestore();
    });

    it('should initialize the destination SDK with EU residency server', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          residencyServer: 'EU',
        },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(window.amplitude._q[0].args[2].serverZone).toBe('EU');
    });

    it('should load v1 sdk by default when sdk version is not configured', () => {
      const amplitude = new Amplitude(destinationConfig, analyticsInstance, destinationInfo);
      amplitude.init();

      expect(document.querySelector(`script[src="${AMPLITUDE_V1_SDK_URL}"]`)).toBeTruthy();
    });

    it('should load v1 sdk when sdkVersion is explicitly set to 1', () => {
      const amplitude = new Amplitude(
        { ...destinationConfig, sdkVersion: 1 },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(document.querySelector(`script[src="${AMPLITUDE_V1_SDK_URL}"]`)).toBeTruthy();
      // v1 init passes an explicit null userId
      expect(window.amplitude._q[0].name).toBe('init');
      expect(window.amplitude._q[0].args[1]).toBeNull();
    });

    it('should load v1 sdk when sdkVersion is an invalid value', () => {
      const amplitude = new Amplitude(
        { ...destinationConfig, sdkVersion: 'foo' },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(document.querySelector(`script[src="${AMPLITUDE_V1_SDK_URL}"]`)).toBeTruthy();
    });

    it('should load v2 sdk and enable attribution autocapture when attribution is not disabled', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          sdkVersion: 2,
          attribution: false,
        },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(document.querySelector(`script[src="${AMPLITUDE_V2_SDK_URL}"]`)).toBeTruthy();
      // v2 init passes an undefined userId (not null)
      expect(window.amplitude._q[0].name).toBe('init');
      expect(window.amplitude._q[0].args[1]).toBeUndefined();
      expect(window.amplitude._q[0].args[2]).toMatchObject({
        autocapture: defaultV2Autocapture,
        serverUrl: 'https://some.proxyserverurl.com',
      });
      expect(window.amplitude._q[0].args[2].attribution).toBeUndefined();
    });

    it('should load v2 sdk and disable attribution autocapture when attribution is disabled', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          sdkVersion: 2,
          attribution: true,
        },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(document.querySelector(`script[src="${AMPLITUDE_V2_SDK_URL}"]`)).toBeTruthy();
      expect(window.amplitude._q[0].args[2]).toMatchObject({
        autocapture: {
          ...defaultV2Autocapture,
          attribution: false,
        },
        serverUrl: 'https://some.proxyserverurl.com',
      });
      expect(window.amplitude._q[0].args[2].attribution).toBeUndefined();
    });

    it.each([
      ['enablePageViewsAutoCapture', 'pageViews', true],
      ['enablePageUrlEnrichmentAutoCapture', 'pageUrlEnrichment', true],
      ['trackSessionEvents', 'sessions', true],
      ['enableWebVitalsAutoCapture', 'webVitals', true],
      ['enableFileDownloadsAutoCapture', 'fileDownloads', true],
      ['enableFrustrationInteractionsAutoCapture', 'frustrationInteractions', true],
      ['enableNetworkTrackingAutoCapture', 'networkTracking', true],
      ['enableElementInteractionsAutoCapture', 'elementInteractions', true],
      ['enableFormInteractionsAutoCapture', 'formInteractions', true],
    ])(
      'should map %s config to only autocapture.%s for v2',
      (configKey, autocaptureKey, configValue) => {
        const amplitude = new Amplitude(
          {
            ...destinationConfig,
            sdkVersion: 2,
            attribution: false,
            [configKey]: configValue,
          },
          analyticsInstance,
          destinationInfo,
        );
        amplitude.init();

        expect(window.amplitude._q[0].args[2].autocapture).toStrictEqual({
          ...defaultV2Autocapture,
          [autocaptureKey]: true,
        });
      },
    );

    it('should keep auto-capture page views independent from user-instrumented page toggles', () => {
      const amplitude = new Amplitude(
        {
          ...destinationConfig,
          sdkVersion: 2,
          attribution: false,
          enablePageViewsAutoCapture: true,
          trackAllPages: false,
          trackCategorizedPages: false,
          trackNamedPages: false,
        },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      expect(window.amplitude._q[0].args[2].autocapture).toStrictEqual({
        ...defaultV2Autocapture,
        pageViews: true,
      });
      expect(amplitude.trackAllPages).toBe(false);
      expect(amplitude.trackCategorizedPages).toBe(false);
      expect(amplitude.trackNamedPages).toBe(false);
    });

    it('should set the correct SRI integrity on the injected v1 script', () => {
      const amplitude = new Amplitude(
        { ...destinationConfig, sdkVersion: 1 },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      const script = document.querySelector(`script[src="${AMPLITUDE_V1_SDK_URL}"]`);
      expect(script.integrity).toBe(AMPLITUDE_V1_SDK_INTEGRITY);
    });

    it('should set the correct SRI integrity on the injected v2 script', () => {
      const amplitude = new Amplitude(
        { ...destinationConfig, sdkVersion: 2 },
        analyticsInstance,
        destinationInfo,
      );
      amplitude.init();

      const script = document.querySelector(`script[src="${AMPLITUDE_V2_SDK_URL}"]`);
      expect(script.integrity).toBe(AMPLITUDE_V2_SDK_INTEGRITY);
    });
  });

  describe('identify', () => {
    // Identify user with userId and traits
    it('should identify user with userId and traits', () => {
      const config = {
        apiKey: 'AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        attribution: true,
        flushQueueSize: 30,
        flushIntervalMillis: 1000,
        trackNewCampaigns: true,
        trackRevenuePerProduct: false,
        preferAnonymousIdForDeviceId: false,
        traitsToSetOnce: ['email', 'name'],
        traitsToIncrement: ['age'],
        appendFieldsToEventProps: false,
        unsetParamsReferrerOnNewSession: false,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              name: 'John Doe',
              age: 30,
            },
          },
          userId: 'USER_ID',
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();
      amplitude.identify(rudderElement);

      // Add assertions here
    });

    // Identify user with only userId
    it('should identify user with only userId', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        attribution: true,
        flushQueueSize: 30,
        flushIntervalMillis: 1000,
        trackNewCampaigns: true,
        trackRevenuePerProduct: false,
        preferAnonymousIdForDeviceId: false,
        traitsToSetOnce: ['email', 'name'],
        traitsToIncrement: ['age'],
        appendFieldsToEventProps: false,
        unsetParamsReferrerOnNewSession: false,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          userId: 'USER_ID',
          context: {
            traits: {},
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();
      amplitude.identify(rudderElement);

      // Add assertions here
    });
    // Identify user with only traits
    it('should identify user with only traits', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        attribution: true,
        flushQueueSize: 30,
        flushIntervalMillis: 1000,
        trackNewCampaigns: true,
        trackRevenuePerProduct: false,
        preferAnonymousIdForDeviceId: false,
        traitsToSetOnce: ['email', 'name'],
        traitsToIncrement: ['age'],
        appendFieldsToEventProps: false,
        unsetParamsReferrerOnNewSession: false,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              name: 'John Doe',
              age: 30,
            },
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();
      amplitude.identify(rudderElement);

      // Add assertions here
    });
    it('should identify user with no traits and unset field only', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        attribution: true,
        flushQueueSize: 30,
        flushIntervalMillis: 1000,
        trackNewCampaigns: true,
        trackRevenuePerProduct: false,
        preferAnonymousIdForDeviceId: false,
        traitsToSetOnce: ['email', 'name'],
        traitsToIncrement: ['age'],
        appendFieldsToEventProps: false,
        unsetParamsReferrerOnNewSession: false,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          context: {},
          integrations: {
            Amplitude: {
              fieldsToUnset: ['unsetField', 'objUn.innerObj.ina'],
            },
          },
        },
      };
      window.amplitude.identify = jest.fn();
      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();
      amplitude.identify(rudderElement);
      expect(window.amplitude.identify.mock.calls[0][0]._q).toEqual([
        {
          args: ['unsetField'],
          name: 'unset',
        },
        {
          args: ['objUn.innerObj.ina'],
          name: 'unset',
        },
      ]);
    });
    it('should identify user with no traits and empty unset field', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        attribution: true,
        flushQueueSize: 30,
        flushIntervalMillis: 1000,
        trackNewCampaigns: true,
        trackRevenuePerProduct: false,
        preferAnonymousIdForDeviceId: false,
        traitsToSetOnce: ['email', 'name'],
        traitsToIncrement: ['age'],
        appendFieldsToEventProps: false,
        unsetParamsReferrerOnNewSession: false,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          context: {},
          integrations: {
            Amplitude: {
              fieldsToUnset: [],
            },
          },
        },
      };
      window.amplitude.identify = jest.fn();
      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();
      amplitude.identify(rudderElement);
      expect(window.amplitude.identify).toHaveBeenCalledTimes(0);
    });
  });

  describe('track', () => {
    // Track event with properties and no products
    it('should track event with properties and no products ', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        trackNewCampaigns: true,
        trackRevenuePerProduct: true,
        preferAnonymousIdForDeviceId: true,
        traitsToSetOnce: ['trait1', 'trait2'],
        traitsToIncrement: ['trait3', 'trait4'],
        appendFieldsToEventProps: true,
        unsetParamsReferrerOnNewSession: true,
        trackProductsOnce: true,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: true,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();

      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.track(rudderElement);

      expect(spy).toHaveBeenCalledWith(undefined, {
        key1: 'value1',
        key2: 'value2',
      });
    });
    // Track event with properties and empty products
    it('should track event with properties and empty products ', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        trackNewCampaigns: true,
        trackRevenuePerProduct: true,
        preferAnonymousIdForDeviceId: true,
        traitsToSetOnce: ['trait1', 'trait2'],
        traitsToIncrement: ['trait3', 'trait4'],
        appendFieldsToEventProps: true,
        unsetParamsReferrerOnNewSession: true,
        trackProductsOnce: true,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: true,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          properties: {
            key1: 'value1',
            key2: 'value2',
            products: [],
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();

      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.track(rudderElement);

      expect(spy).toHaveBeenCalledWith(undefined, {
        key1: 'value1',
        key2: 'value2',
        products: [],
      });
    });

    it('should track event with properties when trackProductsOnce is true', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        trackNewCampaigns: true,
        trackRevenuePerProduct: true,
        preferAnonymousIdForDeviceId: true,
        traitsToSetOnce: ['trait1', 'trait2'],
        traitsToIncrement: ['trait3', 'trait4'],
        appendFieldsToEventProps: true,
        unsetParamsReferrerOnNewSession: true,
        trackProductsOnce: true,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: true,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          type: 'track',
          event: 'Order Completed',
          sentAt: '2020-08-14T05:30:30.118Z',
          context: {
            source: 'test',
            traits: {
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            library: {
              name: 'rudder-sdk-ruby-sync',
              version: '1.0.6',
            },
          },
          messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
          timestamp: '2020-08-14T05:30:30.118Z',
          properties: {
            tax: 2,
            total: 27.5,
            coupon: 'hasbros',
            revenue: 48,
            price: 25,
            quantity: 2,
            currency: 'USD',
            discount: 2.5,
            order_id: '50314b8e9bcf000000000000',
            products: [
              {
                sku: '45790-32',
                url: 'https://www.example.com/product/path',
                name: 'Monopoly: 3rd Edition',
                price: 19,
                category: 'Games',
                quantity: 1,
                image_url: 'https:///www.example.com/product/path.jpg',
                product_id: '507f1f77bcf86cd799439011',
              },
              {
                sku: '46493-32',
                name: 'Uno Card Game',
                price: 3,
                category: 'Games',
                quantity: 2,
                product_id: '505bd76785ebb509fc183733',
              },
            ],
            shipping: 3,
            subtotal: 22.5,
            affiliation: 'Google Store',
            checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
          },
          anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
          integrations: {
            S3: false,
            All: true,
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();

      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.track(rudderElement);

      expect(spy).toHaveBeenCalledWith('Order Completed', {
        affiliation: 'Google Store',
        checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
        coupon: 'hasbros',
        currency: 'USD',
        discount: 2.5,
        order_id: '50314b8e9bcf000000000000',
        price: 25,
        products: [
          {
            category: 'Games',
            name: 'Monopoly: 3rd Edition',
            price: 19,
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
            sku: '45790-32',
          },
          {
            category: 'Games',
            name: 'Uno Card Game',
            price: 3,
            productId: '505bd76785ebb509fc183733',
            quantity: 2,
            sku: '46493-32',
          },
        ],
        quantity: 2,
        revenue: 48,
        shipping: 3,
        subtotal: 22.5,
        tax: 2,
        total: 27.5,
      });
    });
    it('should track event with properties when trackProductsOnce is false', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackNamedPages: true,
        trackCategorizedPages: true,
        trackNewCampaigns: true,
        trackRevenuePerProduct: true,
        preferAnonymousIdForDeviceId: true,
        traitsToSetOnce: ['trait1', 'trait2'],
        traitsToIncrement: ['trait3', 'trait4'],
        appendFieldsToEventProps: true,
        unsetParamsReferrerOnNewSession: true,
        trackProductsOnce: false,
        versionName: '1.0.0',
        groupTypeTrait: 'groupType',
        groupValueTrait: 'groupValue',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: true,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          type: 'track',
          event: 'Order Completed',
          sentAt: '2020-08-14T05:30:30.118Z',
          context: {
            source: 'test',
            traits: {
              anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
            },
            library: {
              name: 'rudder-sdk-ruby-sync',
              version: '1.0.6',
            },
          },
          messageId: '7208bbb6-2c4e-45bb-bf5b-ad426f3593e9',
          timestamp: '2020-08-14T05:30:30.118Z',
          properties: {
            tax: 2,
            total: 27.5,
            coupon: 'hasbros',
            revenue: 48,
            price: 25,
            quantity: 2,
            currency: 'USD',
            discount: 2.5,
            order_id: '50314b8e9bcf000000000000',
            products: [
              {
                sku: '45790-32',
                url: 'https://www.example.com/product/path',
                name: 'Monopoly: 3rd Edition',
                price: 19,
                category: 'Games',
                quantity: 1,
                image_url: 'https:///www.example.com/product/path.jpg',
                product_id: '507f1f77bcf86cd799439011',
              },
              {
                sku: '46493-32',
                name: 'Uno Card Game',
                price: 3,
                category: 'Games',
                quantity: 2,
                product_id: '505bd76785ebb509fc183733',
              },
            ],
            shipping: 3,
            subtotal: 22.5,
            affiliation: 'Google Store',
            checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
          },
          anonymousId: '50be5c78-6c3f-4b60-be84-97805a316fb1',
          integrations: {
            S3: false,
            All: true,
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      amplitude.init();

      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.track(rudderElement);

      expect(spy).toHaveBeenCalledWith('Product Purchased', {
        category: 'Games',
        image_url: 'https:///www.example.com/product/path.jpg',
        name: 'Monopoly: 3rd Edition',
        price: 19,
        product_id: '507f1f77bcf86cd799439011',
        quantity: 1,
        revenue: 48,
        sku: '45790-32',
        url: 'https://www.example.com/product/path',
      });
    });
  });
  describe('page', () => {
    // logs 'Loaded a page' event when trackAllPages is enabled
    it("should log 'Loaded a page' event when trackAllPages is enabled", () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: true,
        trackCategorizedPages: false,
        trackNamedPages: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          properties: {},
          name: '',
          category: '',
          integrations: {},
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.page(rudderElement);

      expect(spy).toHaveBeenCalledWith('Loaded a page', {});
    });

    // logs 'Viewed page {category}' event when category is present and trackCategorizedPages is enabled
    it("should log 'Viewed page {category}' event when category is present and trackCategorizedPages is enabled", () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: false,
        trackCategorizedPages: true,
        trackNamedPages: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          properties: {},
          name: '',
          category: 'CATEGORY',
          integrations: {},
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.page(rudderElement);

      expect(spy).toHaveBeenCalledWith('Viewed page CATEGORY', {});
    });

    // logs 'Viewed page {name}' event when name is present and trackNamedPages is enabled
    it("should log 'Viewed page {name}' event when name is present and trackNamedPages is enabled", () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        trackAllPages: false,
        trackCategorizedPages: false,
        trackNamedPages: true,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          properties: {},
          name: 'NAME',
          category: '',
          integrations: {},
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.page(rudderElement);

      expect(spy).toHaveBeenCalledWith('Viewed page NAME', {});
    });

    it('should not translate page calls when only v2 auto-capture page views is enabled', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        sdkVersion: 2,
        enablePageViewsAutoCapture: true,
        trackAllPages: false,
        trackCategorizedPages: false,
        trackNamedPages: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const rudderElement = {
        message: {
          properties: {},
          name: 'NAME',
          category: 'CATEGORY',
          integrations: {},
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      window.amplitude = window.amplitude ?? { track: jest.fn() };
      const spy = jest.spyOn(window.amplitude, 'track');

      amplitude.page(rudderElement);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('group', () => {
    // sets groupType and groupValue if both are present in traits
    it('should set groupType and groupValue when both are present in traits', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
        groupTypeTrait: 'groupTypeTrait',
        groupValueTrait: 'groupValueTrait',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          groupId: 'GROUP_ID',
          traits: {
            groupTypeTrait: 'GROUP_TYPE',
            groupValueTrait: 'GROUP_VALUE',
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      const spy = jest.spyOn(window.amplitude, 'setGroup');
      amplitude.group(rudderElement);

      // Assert that groupType and groupValue are set correctly
      expect(spy).toHaveBeenCalledWith('groupTypeTrait', 'groupValueTrait');
    });
    // sets '[Rudderstack] Group' and groupId if groupType and groupValue are not present
    it("should set '[Rudderstack] Group' and groupId when groupType and groupValue are not present", () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          groupId: 'GROUP_ID',
          traits: {},
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);
      const spy = jest.spyOn(window.amplitude, 'setGroup');
      amplitude.group(rudderElement);

      // Assert that '[Rudderstack] Group' and groupId are set correctly
      expect(spy).toHaveBeenCalledWith('[Rudderstack] Group', 'GROUP_ID');
    });

    // does not throw errors if all required parameters are present
    it('should not throw errors when all required parameters are present', () => {
      const config = {
        apiKey: 'YOUR_AMPLITUDE_API_KEY',
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const destinationInfo = {
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
        destinationId: 'DESTINATION_ID',
      };

      const rudderElement = {
        message: {
          groupId: 'GROUP_ID',
          traits: {
            groupTypeTrait: 'GROUP_TYPE',
            groupValueTrait: 'GROUP_VALUE',
          },
        },
      };

      const amplitude = new Amplitude(config, analytics, destinationInfo);

      // Assert that no errors are thrown
      expect(() => {
        amplitude.group(rudderElement);
      }).not.toThrow();
    });
  });
});
