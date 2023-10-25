/* eslint-disable no-underscore-dangle */
import Matomo from '../../../src/integrations/Matomo/browser';

const matomoConfig = {
  serverUrl: 'https://www.test.com/',
  siteId: 1,
  trackAllContentImpressions: false,
  trackVisibleContentImpressions: false,
  logAllContentBlocksOnPage: false,
  enableHeartBeatTimer: false,
  enableLinkTracking: false,
  disablePerformanceTracking: false,
  enableCrossDomainLinking: false,
  setCrossDomainLinkingTimeout: false,
  getCrossDomainLinkingUrlParameter: false,
  disableBrowserFeatureDetection: false,
  eventsToStandard: [{ from: 'test', to: '' }],
  oneTrustCookieCategories: [],
};
afterAll(() => {
  jest.restoreAllMocks();
  delete window._paq;
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window._paq;
});
describe('Matomo init tests', () => {
  test('Testing init call of Matomo with serverUrl with no matomoVersion -> backward Compatability', () => {
    const matomo = new Matomo(matomoConfig, { loglevel: 'debug' }, destinationInfo);
    matomo.init();
    // eslint-disable-next-line no-underscore-dangle
    expect(typeof window._paq).toBe('object');
  });
  test('Testing init call of Matomo with premiseUrl -> new enhancement', () => {
    const matomo = new Matomo(
      matomoConfig,
      { loglevel: 'debug' },
      { matomoVersion: 'cloud', premiseUrl: 'https://www.test.com/premise.js' },
    );
    matomo.init();
    // eslint-disable-next-line no-underscore-dangle
    expect(typeof window._paq).toBe('object');
  });
  test('Testing init call of Matomo with premiseUrl -> new enhancement', () => {
    const matomo = new Matomo(
      matomoConfig,
      { loglevel: 'debug' },
      { serverUrl: 'https://www.test.com/server.js' },
    );
    matomo.init();
    // eslint-disable-next-line no-underscore-dangle
    expect(typeof window._paq).toBe('object');
  });
});

describe('matomo page', () => {
  let matomo;
  beforeEach(() => {
    matomo = new Matomo(matomoConfig, { loglevel: 'DEBUG' }, destinationInfo);
    matomo.init();
    window._paq.page = jest.fn();
  });

  test('send pageview', () => {
    matomo.page({
      message: {
        context: {},
        properties: {
          url: 'http://localhost',
        },
      },
    });
    expect(window._paq[2]).toEqual(['trackPageView']);
  });
});

describe('Matomo Track event', () => {
  let matomo;
  beforeEach(() => {
    matomo = new Matomo(matomoConfig, { loglevel: 'DEBUG' }, destinationInfo);
    matomo.init();
    window._paq.track = jest.fn();
  });
  test('Testing Track Ecomm Event', () => {
    matomo.track({
      message: {
        context: {},
        event: 'Order Completed',
        properties: {
          customProp: 'testProp',
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: 'transactionId',
          value: 35.0,
          shipping: 4.0,
          coupon: 'APPARELSALE',
          currency: 'GBP',
          products: [
            {
              customPropProd: 'testPropProd',
              product_id: 'abc',
              category: 'Merch',
              name: 'Food/Drink',
              brand: '',
              variant: 'Extra topped',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/bacon-jam',
              image_url: 'https://www.example.com/product/bacon-jam.jpg',
            },
          ],
          isRudderEvents: true,
        },
      },
    });
    expect(window._paq[2]).toEqual([
      'trackEcommerceOrder',
      'transactionId',
      10,
      6,
      undefined,
      4.0,
      undefined,
    ]);
  });
  test('Testing Track Custom Events', () => {
    matomo.track({
      message: {
        context: {},
        event: 'testing event',
        properties: {
          customProp: 'testProp',
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: 'transactionId',
          value: 35.0,
          shipping: 4.0,
          coupon: 'APPARELSALE',
          action: 'property-level-action',
          currency: 'GBP',
          category: 'property-level-category',
          products: [
            {
              customPropProd: 'testPropProd',
              product_id: 'abc',
              category: 'Merch',
              name: 'Food/Drink',
              brand: '',
              variant: 'Extra topped',
              price: 3.0,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.0,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/bacon-jam',
              image_url: 'https://www.example.com/product/bacon-jam.jpg',
            },
          ],
          isRudderEvents: true,
        },
      },
    });
  expect(window._paq[2]).toEqual([
      'trackEvent',
      'property-level-category',
      'property-level-action',
      'testing event',
      35.0,
    ]);
  });
});
describe('Matomo Identify event', () => {
  let matomo;
  beforeEach(() => {
    matomo = new Matomo(matomoConfig, { loglevel: 'DEBUG' }, destinationInfo);
    matomo.init();
    window._paq.identify = jest.fn();
  });
  test('Testing Identify Custom Events', () => {
    matomo.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
            isRudderEvents: true,
          },
        },
      },
    });
    expect(window._paq[2]).toEqual(['setUserId', 'rudder01']);
  });
});
