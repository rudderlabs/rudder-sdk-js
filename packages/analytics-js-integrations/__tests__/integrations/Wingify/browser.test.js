import Wingify from '../../../src/integrations/Wingify/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const mockWingify = new Wingify(
  {
    accountId: '654331',
    settingsTolerance: 2000,
    libraryTolerance: 2500,
    isSPA: 1,
    useExistingJquery: false,
    sendExperimentTrack: false,
    sendExperimentIdentify: false,
  },
  { loglevel: 'debug', loadOnlyIntegrations: { Wingify: { loadIntegration: true } } },
  destinationInfo,
);

describe('Wingify init tests', () => {
  let wingify;

  test('Testing init call of Wingify', () => {
    wingify = new Wingify(
      {
        accountId: '654331',
        settingsTolerance: 2000,
        libraryTolerance: 2500,
        isSPA: 1,
        useExistingJquery: false,
        sendExperimentTrack: false,
        sendExperimentIdentify: false,
      },
      { loglevel: 'debug', loadOnlyIntegrations: { Wingify: { loadIntegration: true } } },
      destinationInfo,
    );
    wingify.init();
    const script = window.document.querySelector(
      'script[src="https://edge.wingify.net/tag/654331.js"]',
    );
    expect(script).toBeDefined();
  });
});

describe('Wingify Track Event', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockWingify, 'init').mockImplementation(() => {
      window.WINGIFY = {
        push: jest.fn(),
        event: jest.fn(),
      };
      return Promise.resolve(window.WINGIFY);
    });
  });

  test('Track call without parameters', async () => {
    mockWingify.init();
    mockWingify.track({
      message: {
        context: {},
        event: 'buttonClicked',
      },
    });
    expect(window.WINGIFY.event).toHaveBeenCalled();
    expect(window.WINGIFY.event).toHaveBeenCalledWith(
      'rudder.buttonClicked',
      {},
      {
        ogName: 'buttonClicked',
        source: 'rudderstack',
      },
    );
  });

  test('Track call with parameters', async () => {
    mockWingify.init();
    mockWingify.track({
      message: {
        context: {},
        event: 'checkoutCompleted',
        properties: {
          category: 'Food',
          currency: 'INR',
          total: 123,
        },
      },
    });
    expect(window.WINGIFY.event).toHaveBeenCalled();
    expect(window.WINGIFY.event).toHaveBeenCalledWith(
      'rudder.checkoutCompleted',
      {
        category: 'Food',
        currency: 'INR',
        total: 123,
      },
      {
        ogName: 'checkoutCompleted',
        source: 'rudderstack',
      },
    );
  });
});

describe('Wingify Identify Event', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockWingify, 'init').mockImplementation(() => {
      window.WINGIFY = {
        push: jest.fn(),
        visitor: jest.fn(),
      };
      return Promise.resolve(window.WINGIFY);
    });
  });

  test('Vistor call with attributes', async () => {
    mockWingify.init();
    mockWingify.identify({
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
    expect(window.WINGIFY.visitor).toHaveBeenCalled();
    expect(window.WINGIFY.visitor).toHaveBeenCalledWith(
      {
        'rudder.email': 'abc@ruddertack.com',
        'rudder.isRudderEvents': true,
      },
      {
        source: 'rudderstack',
      },
    );
  });
});
