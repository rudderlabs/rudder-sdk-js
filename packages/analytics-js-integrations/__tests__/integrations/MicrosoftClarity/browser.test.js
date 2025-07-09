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

describe('MicrosoftClarity isReady tests', () => {
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
    expect(clarityInstance.isReady()).toBe(false);
  });

  test('should return false when window.clarity exists but has queue', () => {
    window.clarity = { q: [] };
    expect(clarityInstance.isReady()).toBe(false);
  });

  test('should return true when window.clarity exists without queue', () => {
    window.clarity = jest.fn();
    expect(clarityInstance.isReady()).toBe(true);
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

  test('should not call clarity when userId is missing', () => {
    const rudderElement = {
      message: {
        context: {
          sessionId: 'session-456',
        },
      },
    };

    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();
    clarityInstance.identify(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });

  test('should not call clarity when userId is undefined', () => {
    const rudderElement = {
      message: {
        userId: undefined,
        context: {
          sessionId: 'session-456',
        },
      },
    };

    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();
    clarityInstance.identify(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });

  test('should not call clarity when userId is null', () => {
    const rudderElement = {
      message: {
        userId: null,
        context: {
          sessionId: 'session-456',
        },
      },
    };

    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();
    clarityInstance.identify(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });

  test('should not call clarity when userId is empty string', () => {
    const rudderElement = {
      message: {
        userId: '',
        context: {
          sessionId: 'session-456',
        },
      },
    };

    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();
    clarityInstance.identify(rudderElement);
    expect(window.clarity).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });

  test('should call clarity identify without sessionId when context.sessionId is not provided', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          // no sessionId
          traits: {
            name: 'John Doe',
          },
        },
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('identify', 'test-user-123', undefined, undefined);
    expect(window.clarity).toHaveBeenCalledWith('set', 'name', 'John Doe');
  });

  test('should call clarity identify without sessionId when context.sessionId is null', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: null,
          traits: {
            name: 'John Doe',
          },
        },
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('identify', 'test-user-123', undefined, undefined);
    expect(window.clarity).toHaveBeenCalledWith('set', 'name', 'John Doe');
  });

  test('should call clarity identify without customPageId when context.traits.customPageId is not provided', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          traits: {
            // no customPageId
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
      undefined,
    );
    expect(window.clarity).toHaveBeenCalledWith('set', 'name', 'John Doe');
    expect(window.clarity).toHaveBeenCalledWith('set', 'email', 'john@example.com');
  });

  test('should call clarity identify without customPageId when context.traits.customPageId is null', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          traits: {
            customPageId: null,
            name: 'John Doe',
          },
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
    expect(window.clarity).toHaveBeenCalledWith('set', 'customPageId', null);
    expect(window.clarity).toHaveBeenCalledWith('set', 'name', 'John Doe');
  });

  test('should call clarity identify without traits when context.traits is not provided', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          // no traits
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
    expect(window.clarity).toHaveBeenCalledTimes(1); // Only called once for identify, no set calls
  });

  test('should call clarity identify without traits when context.traits is null', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          traits: null,
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
    expect(window.clarity).toHaveBeenCalledTimes(1); // Only called once for identify, no set calls
  });

  test('should call clarity identify without traits when context.traits is empty object', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: {
          sessionId: 'session-456',
          traits: {},
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
    expect(window.clarity).toHaveBeenCalledTimes(1); // Only called once for identify, no set calls
  });

  test('should call clarity identify without context when context is not provided', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        // no context
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('identify', 'test-user-123', undefined, undefined);
    expect(window.clarity).toHaveBeenCalledTimes(1); // Only called once for identify, no set calls
  });

  test('should call clarity identify without context when context is null', () => {
    const rudderElement = {
      message: {
        userId: 'test-user-123',
        context: null,
      },
    };

    clarityInstance.identify(rudderElement);
    expect(window.clarity).toHaveBeenCalledWith('identify', 'test-user-123', undefined, undefined);
    expect(window.clarity).toHaveBeenCalledTimes(1); // Only called once for identify, no set calls
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
