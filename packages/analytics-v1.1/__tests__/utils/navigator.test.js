import { getUserAgent, getLanguage } from '../../src/utils/navigator';
import BraveBrowser from '../../__mocks__/BraveBrowser';

describe('Navigator Utilities', () => {
  const mockLanguage = 'en-US';
  const chromeUserAgentString =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.3';
  const chromeVersion = '108.0.0.0';

  afterEach(() => {
    // Reset global.window.navigator mocks
    global.navigator.userAgent = undefined;
    global.navigator.brave = undefined;
    global.navigator.language = undefined;
  });

  it('should get User Agent when navigator is defined', () => {
    global.navigator.userAgent = chromeUserAgentString;
    const userAgent = getUserAgent();

    expect(userAgent).toBe(chromeUserAgentString);
  });

  it('should get User Agent with Braze info for braze browsers', () => {
    global.navigator.userAgent = chromeUserAgentString;
    global.navigator.brave = new BraveBrowser();
    const userAgent = getUserAgent();

    expect(userAgent).toBe(`${chromeUserAgentString} Brave/${chromeVersion}`);
  });

  it('should get language when navigator is defined', () => {
    global.navigator.language = mockLanguage;
    const language = getLanguage();

    expect(language).toBe(mockLanguage);
  });
});
