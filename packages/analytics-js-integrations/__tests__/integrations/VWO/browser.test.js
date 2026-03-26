import VWO from '../../../src/integrations/VWO/browser';
import { loadNativeSdk } from '../../../src/integrations/VWO/nativeSdkLoader';

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
    expect(window.VWO.event).toHaveBeenCalledWith(
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
    expect(window.VWO.event).toHaveBeenCalledWith(
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
    expect(window.VWO.visitor).toHaveBeenCalledWith(
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

describe('VWO SmartCode v3 loader sanity', () => {
  const ACCOUNT_ID_THRESHOLD = 1200000;

  beforeEach(() => {
    jest.useFakeTimers();
    delete window._vwo_code;
    // SmartCode v3 assigns `code` without declaration; declare it for strict-mode Jest runtime
    globalThis.eval('var code;');
    if (typeof performance.getEntriesByName !== 'function') {
      performance.getEntriesByName = () => [];
    }
    window.document.head.querySelectorAll('script,style').forEach(el => el.remove());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    delete globalThis.code;
    jest.useRealTimers();
  });

  test('uses SmartCode v3.0 when accountId is greater than threshold', () => {
    const accountId = ACCOUNT_ID_THRESHOLD + 1;

    loadNativeSdk(accountId, 2000, 2500, false, 1);

    const code = window._vwo_code;
    expect(code).toBeDefined();
    expect(code.getVersion()).toBe(3);
  });

  test('v3.0 sanity: injects hide style and tag script', () => {
    const accountId = ACCOUNT_ID_THRESHOLD + 42;

    loadNativeSdk(accountId, 2000, 2500, false, 1);

    const style = window.document.head.querySelector('#_vis_opt_path_hides');
    expect(style).not.toBeNull();
    expect(style.textContent).toContain('opacity:0');

    const script = window.document.head.querySelector(
      'script[src*="visualwebsiteoptimizer.com/tag/"]',
    );
    expect(script).not.toBeNull();
  });
});
