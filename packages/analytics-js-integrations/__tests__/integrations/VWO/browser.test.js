import VWO from '../../../src/integrations/VWO/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const mockVWO = new VWO(
  {
    accountId: '654331',
    settingsTolerance: 2000,
    libraryTolerance: 2500,
    isSPA: 1,
    useExistingJquery: false,
    sendExperimentTrack: false,
    sendExperimentIdentify: false,
  },
  { loglevel: 'debug' },
  destinationInfo,
);

describe('VWO init tests', () => {
  let vwo;

  test('Testing init call of VWO', () => {
    vwo = new VWO(
      {
        accountId: '654331',
        settingsTolerance: 2000,
        libraryTolerance: 2500,
        isSPA: 1,
        useExistingJquery: false,
        sendExperimentTrack: false,
        sendExperimentIdentify: false,
      },
      { loglevel: 'debug' },
      destinationInfo,
    );
    vwo.init();
    const script = window.document.querySelector(
      'script[src~="https://dev.visualwebsiteoptimizer.com/j.php?a=654331]',
    );
    expect(script).toBeDefined();
  });
});

describe('VWO Track Event', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockVWO, 'init').mockImplementation(() => {
      window.VWO = {
        push: jest.fn(),
        event: jest.fn(),
      };
      return Promise.resolve(window.VWO);
    });
  });

  test('Track call without parameters', async () => {
    mockVWO.init();
    mockVWO.track({
      message: {
        context: {},
        event: 'buttonClicked',
      },
    });
    expect(window.VWO.event).toHaveBeenCalled();
    expect(window.VWO.event).toBeCalledWith(
      'rudder.buttonClicked',
      {},
      {
        ogName: 'buttonClicked',
        source: 'rudderstack',
      },
    );
  });

  test('Track call with parameters', async () => {
    mockVWO.init();
    mockVWO.track({
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
    expect(window.VWO.event).toHaveBeenCalled();
    expect(window.VWO.event).toBeCalledWith(
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

describe('VWO Identify Event', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(mockVWO, 'init').mockImplementation(() => {
      window.VWO = {
        push: jest.fn(),
        visitor: jest.fn(),
      };
      return Promise.resolve(window.VWO);
    });
  });

  test('Vistor call with attributes', async () => {
    mockVWO.init();
    mockVWO.identify({
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
    expect(window.VWO.visitor).toHaveBeenCalled();
    expect(window.VWO.visitor).toBeCalledWith(
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
