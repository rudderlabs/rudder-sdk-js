import Ninetailed from '../../../src/integrations/Ninetailed/browser';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
window.ninetailed = {};

describe('Ninetailed page', () => {
  let nt;
  beforeEach(() => {
    nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
    window.ninetailed.page = jest.fn();
  });

  test('send pageview', () => {
    nt.page({
      message: {
        context: {},
        properties: {
          category: 'test cat',
          path: '/test',
          url: 'http://localhost',
          referrer: '',
          title: 'test page',
          testDimension: 'abc',
          isRudderEvents: true,
        },
      },
    });
    expect(window.ninetailed.page.mock.calls[0][0]).toEqual({
      category: 'test cat',
      path: '/test',
      url: 'http://localhost',
      referrer: '',
      title: 'test page',
      testDimension: 'abc',
      isRudderEvents: true,
    });
  });
});

describe('Ninetailed Track event', () => {
  let nt;
  beforeEach(() => {
    nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
    window.ninetailed.track = jest.fn();
  });
  test('Testing Track Custom Events', () => {
    const properties = {
      customProp: 'testProp',
      checkout_id: 'what is checkout id here??',
      event_id: 'purchaseId',
      order_id: 'transactionId',
      value: 35.0,
      shipping: 4.0,
      isRudderEvents: true,
    };
    nt.track({
      message: {
        context: {},
        event: 'Custom',
        properties,
      },
    });
    expect(window.ninetailed.track.mock.calls[0][0]).toEqual('Custom');
    expect(window.ninetailed.track.mock.calls[0][1]).toEqual(properties);
  });
});
describe('Ninetailed Identify event', () => {
  let nt;
  beforeEach(() => {
    nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
    window.ninetailed.identify = jest.fn();
  });
  test('Testing Identify Custom Events', () => {
    const traits = {
      email: 'abc@ruddertack.com',
      isRudderEvents: true,
    };
    nt.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits,
        },
      },
    });
    expect(window.ninetailed.identify.mock.calls[0][0]).toEqual('rudder01');
    expect(window.ninetailed.identify.mock.calls[0][1]).toEqual(traits);
  });
});
