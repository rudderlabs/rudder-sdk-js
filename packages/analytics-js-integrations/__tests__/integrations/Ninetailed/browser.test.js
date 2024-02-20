import Ninetailed from '../../../src/integrations/Ninetailed/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('Ninetailed Integration Intialization Test Cases', () => {
  let nt;
  beforeEach(() => {
    nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
  });
  afterEach(() => {
    jest.restoreAllMocks();
    window.ninetailed = undefined;
  });
  describe(' Is Loaded test Cases', () => {
    // when ninetailed is not loaded from webapp
    test('isLoaded should return False', () => {
      expect(nt.isLoaded()).toBe(false);
    });
    // when ninetailed is loaded from webapp
    test('isLoaded should return True', () => {
      // since init call does not have any body so we are intialising the ninetailed object
      window.ninetailed = {};
      expect(nt.isLoaded()).toBeTruthy();
    });
  });
  describe(' Is Ready test Cases', () => {
    // when ninetailed is not loaded from webapp
    test('isReady should return False', () => {
      expect(nt.isReady()).toBe(false);
    });
    // when ninetailed is loaded from webapp
    test('isReady should return True', () => {
      // since init call does not have any body so we are intialising the ninetailed object
      window.ninetailed = {};
      expect(nt.isReady()).toBeTruthy();
    });
  });
});
describe('Ninetailed Event Calls Test Cases', () => {
  beforeEach(() => {
    window.ninetailed = {};
  });
  describe('Page Calls', () => {
    let nt;
    beforeEach(() => {
      nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
      window.ninetailed.page = jest.fn();
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('send pageview with properties', () => {
      const properties = {
        category: 'test cat',
        path: '/test',
        url: 'http://localhost:8080',
        referrer: '',
        title: 'test page',
        testDimension: 'abc',
        isRudderEvents: true,
      };

      nt.page({
        message: {
          context: {},
          properties,
        },
      });
      expect(window.ninetailed.page.mock.calls[0][0]).toEqual(properties);
    });
    test('send pageview without properties', () => {
      nt.page({
        message: {
          context: {},
        },
      });
      expect(window.ninetailed.page.mock.calls[0][0]).toEqual(undefined);
    });
  });
  describe('Track Calls', () => {
    let nt;
    beforeEach(() => {
      nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
      window.ninetailed.track = jest.fn();
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('Testing Track Event with event', () => {
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
    test('Testing Track Event without event', () => {
      nt.track({
        message: {
          context: {},
          properties: {},
        },
      });
      expect(window.ninetailed.track).not.toHaveBeenCalledWith();
    });
  });
  describe('Identify calls', () => {
    let nt;
    beforeEach(() => {
      nt = new Ninetailed({}, { loglevel: 'DEBUG' }, destinationInfo);
      window.ninetailed.identify = jest.fn();
    });
    afterAll(() => {
      jest.restoreAllMocks();
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
});
