import { BingAds } from '../../../src/integrations/BingAds/browser';

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});
afterEach(() => {
  // Reset DOM to original state
  document.getElementById('dummyScript')?.remove();
});
afterAll(() => {
  jest.restoreAllMocks();
});
describe('BingAds init tests', () => {
  let Bingads;
  test('Testing init call of Bing ads', () => {
    Bingads = new BingAds({ tagID: '12567839' }, { loglevel: 'debug' });
    Bingads.init();
    expect(typeof window.bing12567839).toBe('object');
  });
});

describe('Bing Ads page', () => {
  let bingAds;
  const output = [];
  beforeEach(() => {
    bingAds = new BingAds({ tagID: '12567839' }, { loglevel: 'debug' });
    bingAds.init();
    window.bing12567839.push = jest.fn(x => output.push(x));
  });

  test('send pageview', () => {
    bingAds.page({
      context: {},
      properties: {
        category: 'test category',
        path: '/test',
        url: 'http://localhost',
        referrer: '',
        title: 'test page',
        testDimension: 'abc',
      },
    });
    expect(output[0]).toEqual('pageLoad');
  });
});

describe('Bingads Track event', () => {
  let bingAds;
  const output = [];
  beforeEach(() => {
    bingAds = new BingAds({ tagID: '12567839' }, { loglevel: 'DEBUG' });
    bingAds.init();
    window.bing12567839.push = jest.fn((x, y, z) => output.push({ event: y, ...z }));
  });
  test('Testing Track Custom Events', () => {
    bingAds.track({
      message: {
        type: 'track',
        context: {},
        event: 'Custom',
        properties: {
          category: 'testCategory',
          currency: 'INR',
          value: 500,
          revenue: 200,
          total: 300,
        },
      },
    });
    expect(output[0]).toEqual({
      event: 'track',
      event_category: 'testCategory',
      currency: 'INR',
      event_label: 'Custom',
      revenue_value: 300,
    });
  });
  test('Testing Track no type passed', () => {
    try {
      bingAds.track({
        message: {
          context: {},
          event: 'Custom',
          properties: {
            category: 'testCategory',
            currency: 'INR',
            value: 500,
            revenue: 200,
            total: 300,
          },
        },
      });
    } catch (e) {
      expect(e.message).toEqual('Event type not present');
    }
  });
});
