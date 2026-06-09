import Wingify from '../../../src/integrations/Wingify/browser';
import { integrations } from '../../../src/integrations/index';

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

describe('Wingify registry', () => {
  test('should be registered in integrations map', () => {
    expect(integrations.WINGIFY).toBeDefined();
    expect(typeof integrations.WINGIFY).toBe('function');
  });
});

describe('Wingify init tests', () => {
  let wingify;

  test('Testing init call of Wingify', () => {
    const appendedNodes = [];
    const appendChildSpy = jest
      .spyOn(document.head, 'appendChild')
      .mockImplementation(node => {
        appendedNodes.push(node);
        return node;
      });

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

    const script = appendedNodes.find(
      node => node.tagName === 'SCRIPT' && node.src === 'https://edge.wingify.net/tag/654331.js',
    );
    expect(script).toBeDefined();

    appendChildSpy.mockRestore();
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

  test('Visitor call with attributes', async () => {
    mockWingify.init();
    mockWingify.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@rudderstack.com',
            isRudderEvents: true,
          },
        },
      },
    });
    expect(window.WINGIFY.visitor).toHaveBeenCalled();
    expect(window.WINGIFY.visitor).toHaveBeenCalledWith(
      {
        'rudder.email': 'abc@rudderstack.com',
        'rudder.isRudderEvents': true,
      },
      {
        source: 'rudderstack',
      },
    );
  });

  test('Visitor call with top-level traits when context has no traits', async () => {
    mockWingify.init();
    mockWingify.identify({
      message: {
        userId: 'rudder01',
        context: {},
        traits: {
          plan: 'enterprise',
        },
      },
    });
    expect(window.WINGIFY.visitor).toHaveBeenCalledWith(
      {
        'rudder.plan': 'enterprise',
      },
      {
        source: 'rudderstack',
      },
    );
  });
});

describe('Wingify Track Event validation', () => {
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

  test('Track call with whitespace-only event name is rejected', () => {
    mockWingify.init();
    mockWingify.track({
      message: {
        context: {},
        event: '   ',
      },
    });
    expect(window.WINGIFY.event).not.toHaveBeenCalled();
  });
});
