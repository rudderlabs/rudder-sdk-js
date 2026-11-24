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
    delete window.Wingify;
    delete window.WINGIFY;
    wingify.init();

    expect(window.Wingify).toBeDefined();
    expect(typeof window.Wingify.event).toBe('function');
    expect(typeof window.Wingify.visitor).toBe('function');
    expect(window.WINGIFY).toBeUndefined();

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
      window.Wingify = {
        push: jest.fn(),
        event: jest.fn(),
      };
      return Promise.resolve(window.Wingify);
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
    expect(window.Wingify.event).toHaveBeenCalled();
    expect(window.Wingify.event).toHaveBeenCalledWith(
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
    expect(window.Wingify.event).toHaveBeenCalled();
    expect(window.Wingify.event).toHaveBeenCalledWith(
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
      window.Wingify = {
        push: jest.fn(),
        visitor: jest.fn(),
      };
      return Promise.resolve(window.Wingify);
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
    expect(window.Wingify.visitor).toHaveBeenCalled();
    expect(window.Wingify.visitor).toHaveBeenCalledWith(
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
    expect(window.Wingify.visitor).toHaveBeenCalledWith(
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
      window.Wingify = {
        push: jest.fn(),
        event: jest.fn(),
      };
      return Promise.resolve(window.Wingify);
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
    expect(window.Wingify.event).not.toHaveBeenCalled();
  });
});

describe('Wingify experiment callback', () => {
  const experimentConfig = {
    accountId: '654331',
    settingsTolerance: 2000,
    libraryTolerance: 2500,
    isSPA: 1,
    useExistingJquery: false,
    sendExperimentTrack: true,
    sendExperimentIdentify: false,
  };

  const createWingify = (analyticsOverrides = {}) =>
    new Wingify(
      experimentConfig,
      {
        loglevel: 'debug',
        loadOnlyIntegrations: { Wingify: { loadIntegration: false } },
        ...analyticsOverrides,
      },
      destinationInfo,
    );

  beforeEach(() => {
    delete window.Wingify;
    delete window.WINGIFY;
  });

  test('sends Experiment Viewed from window.Wingify.campaigns', () => {
    const track = jest.fn();
    const wingify = createWingify({ track });
    wingify.init();

    const callback = window.Wingify.find(entry => entry[0] === 'onVariationApplied')?.[1];
    expect(typeof callback).toBe('function');

    window.Wingify.campaigns = {
      12: {
        name: 'Hero test',
        type: 'VISUAL_AB',
        comb_n: { 2: 'Variation 1' },
      },
    };

    callback(['vS', 12, 2]);

    expect(track).toHaveBeenCalledWith('Experiment Viewed', {
      experimentId: 12,
      variationName: 'Variation 1',
      CampaignName: 'Hero test',
      VariationId: 2,
    });
  });

  test('does not throw when campaign metadata is missing', () => {
    const track = jest.fn();
    const wingify = createWingify({ track });
    wingify.init();

    const callback = window.Wingify.find(entry => entry[0] === 'onVariationApplied')[1];
    expect(() => callback(['vS', 99, 1])).not.toThrow();
    expect(track).not.toHaveBeenCalled();
  });

  test('registers the callback when only sendExperimentIdentify is enabled', () => {
    const identify = jest.fn();
    const wingify = new Wingify(
      {
        ...experimentConfig,
        sendExperimentTrack: false,
        sendExperimentIdentify: true,
      },
      {
        loglevel: 'debug',
        loadOnlyIntegrations: { Wingify: { loadIntegration: false } },
        identify,
      },
      destinationInfo,
    );

    wingify.init();

    const callback = window.Wingify.find(entry => entry[0] === 'onVariationApplied')?.[1];
    expect(typeof callback).toBe('function');

    window.Wingify.campaigns = {
      12: {
        name: 'Hero test',
        type: 'VISUAL_AB',
        comb_n: { 2: 'Variation 1' },
      },
    };

    callback(['vS', 12, 2]);

    expect(identify).toHaveBeenCalledWith({
      'Experiment: 12': 'Variation 1',
    });
  });
});
