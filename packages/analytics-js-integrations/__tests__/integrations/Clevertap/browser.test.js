import Clevertap from '../../../src/integrations/Clevertap/browser';

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

afterEach(() => {
  // Reset DOM to original state
  document.getElementById('dummyScript')?.remove();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Clevertap init tests', () => {
  let clevertap;

  test('Testing init call of clevertap without region value', () => {
    clevertap = new Clevertap(
      { accountId: '12567839', passcode: '123456' },
      { loglevel: 'debug', loadOnlyIntegrations: {} },
    );
    clevertap.init();
    expect(typeof window.clevertap).toBe('object');
    expect(window.clevertap.region).toBeUndefined();
  });

  test('Testing init call of clevertap with valid region value', () => {
    clevertap = new Clevertap(
      { accountId: '12567839', passcode: '123456', region: 'in' },
      { loglevel: 'debug', loadOnlyIntegrations: {} },
    );
    clevertap.init();
    expect(typeof window.clevertap).toBe('object');
    expect(window.clevertap.region).toBe('in');
  });
});
