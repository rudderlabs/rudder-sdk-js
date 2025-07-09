import MicrosoftClarity from '../../../src/integrations/MicrosoftClarity/browser';

// Mock the nativeSdkLoader to prevent DOM manipulation during tests
jest.mock('../../../src/integrations/MicrosoftClarity/nativeSdkLoader', () => ({
  __esModule: true,
  default: jest.fn(),
  loadNativeSdk: jest.fn(),
}));

// Mock the constants import
jest.mock('@rudderstack/analytics-js-common/v1.1/utils/constants', () => ({
  LOAD_ORIGIN: 'RS_JS_SDK',
}));

afterAll(() => {
  jest.restoreAllMocks();
});

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('MicrosoftClarity init tests', () => {
  let clarityInstance;

  test('Testing init call of MicrosoftClarity', () => {
    clarityInstance = new MicrosoftClarity(
      { projectId: 'test-project-id', cookieConsent: true },
      { logLevel: 'debug' },
      destinationInfo,
    );
    clarityInstance.init();
    expect(clarityInstance.name).toBe('MICROSOFT_CLARITY');
    expect(clarityInstance.projectId).toBe('test-project-id');
    expect(clarityInstance.cookieConsent).toBe(true);
  });
});

describe('MicrosoftClarity isLoaded tests', () => {
  let clarityInstance;

  beforeEach(() => {
    clarityInstance = new MicrosoftClarity(
      { projectId: 'test-project-id', cookieConsent: true },
      { logLevel: 'debug' },
      destinationInfo,
    );
  });

  test('should return false when window.clarity is undefined', () => {
    delete window.clarity;
    expect(clarityInstance.isLoaded()).toBe(false);
  });

  test('should return false when window.clarity exists but has queue', () => {
    window.clarity = { q: [] };
    expect(clarityInstance.isLoaded()).toBe(false);
  });

  test('should return true when window.clarity exists without queue', () => {
    window.clarity = jest.fn();
    expect(clarityInstance.isLoaded()).toBe(true);
  });
});

describe('MicrosoftClarity identify tests', () => {
  let clarityInstance;

  beforeEach(() => {
    clarityInstance = new MicrosoftClarity(
      { projectId: 'test-project-id', cookieConsent: true },
      { logLevel: 'debug' },
      destinationInfo,
    );
    window.clarity = jest.fn();
  });

  test('should call clarity identify with userId only', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {},
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('identify', 'test-user-123', undefined, undefined);
  });

  test('should call clarity identify with userId and sessionId', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
        },
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith(
      'identify',
      'test-user-123',
      'session-456',
      undefined,
    );
  });

  test('should call clarity identify with userId, sessionId, and customPageId', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          traits: {
            customPageId: 'page-789',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith(
      'identify',
      'test-user-123',
      'session-456',
      'page-789',
    );
    expect(window.clarity).toHaveBeenCalledWith('set', 'customPageId', 'page-789');
    expect(window.clarity).toHaveBeenCalledWith('set', 'name', 'John Doe');
    expect(window.clarity).toHaveBeenCalledWith('set', 'email', 'john@example.com');
  });
});

describe('MicrosoftClarity track tests', () => {
  let clarityInstance;

  beforeEach(() => {
    clarityInstance = new MicrosoftClarity(
      { projectId: 'test-project-id', cookieConsent: true },
      { logLevel: 'debug' },
      destinationInfo,
    );
    window.clarity = jest.fn();
  });

  test('should call clarity event with valid event name', () => {
    const rudderElement = {
      message: {
        event: 'Button Clicked',
        properties: {
          buttonId: 'submit-btn',
          page: 'checkout',
        },
      },
    };

    clarityInstance.track(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('event', 'Button Clicked');
  });

  test('should not call clarity when event name is missing', () => {
    const rudderElement = {
      message: {},
    };

    clarityInstance.track(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
  });

  test('should not call clarity when event name is empty string', () => {
    const rudderElement = {
      message: {
        event: '',
      },
    };

    clarityInstance.track(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
  });

  test('should not call clarity when event name is only whitespace', () => {
    const rudderElement = {
      message: {
        event: '   ',
      },
    };

    clarityInstance.track(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
  });

  test('should not call clarity when event is not a string', () => {
    const rudderElement = {
      message: {
        event: 123,
      },
    };

    clarityInstance.track(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
  });
});
