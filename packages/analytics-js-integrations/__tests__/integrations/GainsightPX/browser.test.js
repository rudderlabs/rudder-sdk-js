import { GainsightPX } from '../../../src/integrations/GainsightPX';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
};

const basicConfig = {
  productKey: 'AP-XXXXXXXXXXX-2',
};

describe('GainsightPX init tests', () => {
  beforeAll(() => {
    // Add a dummy script as it is required by the init script
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.id = 'dummyScript';
    const headElements = document.getElementsByTagName('head');
    headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  });

  let gainsightPX;

  test('Testing init call of GainsightPX', () => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => ({
        firstName: 'rudder',
        lastName: 'stack',
        email: 'abce@rudderstack.com',
      })),
      getAnonymousId: jest.fn(() => 'testAnonymousID'),
      getUserId: jest.fn(() => 'testUserID'),
      getGroupId: jest.fn(() => 'testAccountID'),
      getGroupTraits: jest.fn(() => ({
        name: 'Test Account Name',
      })),
      logLevel: 'debug'
    };
    gainsightPX = new GainsightPX(basicConfig, mockAnalytics, destinationInfo);
    gainsightPX.init();
    expect(typeof window.aptrinsic).toBe('function');
  });
});

describe('GainsightPX Track event', () => {
  let gainsightPX;
  beforeEach(() => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => ({
        firstName: 'rudder',
        lastName: 'stack',
        email: 'abce@rudderstack.com',
      })),
      getAnonymousId: jest.fn(() => 'testAnonymousID'),
      getUserId: jest.fn(() => 'testUserID'),
      getGroupId: jest.fn(() => 'testAccountID'),
      getGroupTraits: jest.fn(() => ({
        name: 'Test Account Name',
      })),
      logLevel: 'debug'
    };
    gainsightPX = new GainsightPX(basicConfig, mockAnalytics, destinationInfo);
    gainsightPX.init();
    window.aptrinsic = jest.fn();
  });

  test('Testing Track Simple Event with contents build properties.products', () => {
    // call RudderStack function
    gainsightPX.track({
      message: {
        context: {},
        event: 'event-name',
        properties: {
          customProp: 'testProp',
          order_id: 'transactionId',
          value: 35.0,
          coupon: 'APPARELSALE',
          currency: 'GBP',
        },
      },
    });

    // Confirm that it was translated to the appropriate PX call
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'track',
      'event-name',
      {
        customProp: 'testProp',
        order_id: 'transactionId',
        value: 35.0,
        coupon: 'APPARELSALE',
        currency: 'GBP',
      },
    ]);
  });


  test('Test for empty properties', () => {
    // call RudderStack function
    gainsightPX.track({
      message: {
        context: {},
        event: 'event-name',
        properties: {}
      }
    });

    // Confirm that it was translated to the appropriate PX call
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'track',
      'event-name',
      {}
    ]);
  });

  test('Test for no Event name', () => {
    // call RudderStack function
    gainsightPX.track({
      message: {
        type: 'track',
        context: {},
        properties: {},
      },
    });

    expect(window.aptrinsic).not.toHaveBeenCalledWith();
  });

});


describe('GainsightPX Identify event', () => {
  let gainsightPX;
  beforeEach(() => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => ({
        firstName: 'rudder',
        lastName: 'stack',
        email: 'abce@rudderstack.com',
      })),
      getAnonymousId: jest.fn(() => 'testAnonymousID'),
      getUserId: jest.fn(() => 'testUserID'),
      getGroupId: jest.fn(() => 'testAccountID'),
      getGroupTraits: jest.fn(() => ({
        name: 'Test Account Name',
      })),
      logLevel: 'debug'
    };
    gainsightPX = new GainsightPX(basicConfig, mockAnalytics, destinationInfo);
    gainsightPX.init();
    window.aptrinsic = jest.fn();
  });

  test('Testing identify call with ID only', () => {
    // call RudderStack function
    gainsightPX.identify({
      message: {
        userId: 'rudder01',
        context: {}
      }
    });

    // Confirm that it was translated to the appropriate PX call
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'identify',
      {
        id: 'rudder01'
      },
      {}
    ]);
  });

  test('Testing identify call with ID and attributes', () => {
    const traits = {
      email: 'abc@ruddertack.com',
      testBool: true,
    };
    // call RudderStack function
    gainsightPX.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits
        }
      }
    });

    // Confirm that it was translated to the appropriate PX call
    const mergedProperties = { ...{id: 'rudder01'}, ...traits};
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'identify',
      mergedProperties,
      {}
    ]);
  });

  test('Testing identify call with missing user ID', () => {
    const traits = {
      email: 'abc@ruddertack.com',
      testBool: true,
    };
    // call RudderStack function
    gainsightPX.identify({
      message: {
        context: {
          traits
        }
      }
    });

    expect(window.aptrinsic).not.toHaveBeenCalledWith();
  });
});

describe('GainsightPX Group event', () => {
  let gainsightPX;
  beforeEach(() => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => ({
        firstName: 'rudder',
        lastName: 'stack',
        email: 'abce@rudderstack.com',
      })),
      getAnonymousId: jest.fn(() => 'testAnonymousID'),
      getUserId: jest.fn(() => 'testUserID'),
      getGroupId: jest.fn(() => 'testAccountID'),
      getGroupTraits: jest.fn(() => ({
        name: 'Test Account Name',
      })),
      logLevel: 'debug'
    };
    gainsightPX = new GainsightPX(basicConfig, mockAnalytics, destinationInfo);
    gainsightPX.init();
    window.aptrinsic = jest.fn();
  });

  test('Testing group call', () => {
    // call RudderStack function
    gainsightPX.group({
      message: {
        traits: {
          groupType: 'organization',
          name: 'ACME Corp',
          industry: 'Technology',
        },
        groupId: '1234567890',
      },
    });

    // Confirm that it was translated to the appropriate PX call
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'identify',
      {
      },
      {
        id: '1234567890',
        groupType: 'organization',
        name: 'ACME Corp',
        industry: 'Technology',
      }
    ]);
  });

  test('Testing group call with user ID', () => {
    // call RudderStack function
    gainsightPX.group({
      message: {
        traits: {
          groupType: 'organization',
          name: 'ACME Corp',
          industry: 'Technology',
        },
        groupId: '1234567890',
        userId: 'abc123'
      },
    });

    // Confirm that it was translated to the appropriate PX call
    expect(window.aptrinsic.mock.calls[0]).toEqual([
      'identify',
      {
        id: 'abc123'
      },
      {
        id: '1234567890',
        groupType: 'organization',
        name: 'ACME Corp',
        industry: 'Technology',
      }
    ]);
  });

  test('Testing group call with missing account ID', () => {
    // call RudderStack function
    gainsightPX.group({
      message: {
        traits: {
          groupType: 'organization',
          name: 'ACME Corp',
          industry: 'Technology',
        },
      },
    });

    expect(window.aptrinsic).not.toHaveBeenCalledWith();
  });
});
