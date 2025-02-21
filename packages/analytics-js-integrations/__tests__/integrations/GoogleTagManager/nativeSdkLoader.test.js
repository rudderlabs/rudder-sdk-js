import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { loadNativeSdk } from '../../../src/integrations/GoogleTagManager/nativeSdkLoader';

describe('loadNativeSdk', () => {
  // Setup a dummy script element so that getElementsByTagName('script')[0] returns something.
  beforeEach(() => {
    // Clear any previous finalUrl and dataLayer
    delete window.finalUrl;
    window.dataLayer = [];
    document.body.innerHTML = '<script id="dummy-script"></script>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.finalUrl;
    window.dataLayer = undefined;
  });

  test('should set window.finalUrl to provided serverUrl', () => {
    loadNativeSdk('GTM-TEST', 'https://custom-server.com', null, null);
    expect(window.finalUrl).toBe('https://custom-server.com');
  });

  test('should set window.finalUrl to default when serverUrl is not provided', () => {
    loadNativeSdk('GTM-TEST', null, null, null);
    expect(window.finalUrl).toBe('https://www.googletagmanager.com');
  });

  test('should push a gtm.js event into dataLayer', () => {
    loadNativeSdk('GTM-TEST', null, null, null);
    expect(window.dataLayer.length).toBeGreaterThan(0);
    const eventObj = window.dataLayer[0];
    expect(eventObj.event).toBe('gtm.js');
    expect(typeof eventObj['gtm.start']).toBe('number');
  });

  test('should insert a script element with correct attributes and src (without environment or auth)', () => {
    loadNativeSdk('GTM-TEST', 'https://custom-server.com', null, null);

    const scripts = document.getElementsByTagName('script');
    // The function inserts the new script before the first existing script element.
    // So the new script should be at index 0.
    const insertedScript = scripts[0];

    expect(insertedScript.getAttribute('data-loader')).toBe(LOAD_ORIGIN);
    expect(insertedScript.async).toBe(true);
    // Since l is "dataLayer", dl is an empty string.
    // Expected src: serverUrl/gtm.js?id=containerID + (no env/auth) + '&gtm_cookies_win=x'
    const expectedSrc = `https://custom-server.com/gtm.js?id=GTM-TEST&gtm_cookies_win=x`;
    expect(insertedScript.src).toBe(expectedSrc);
  });

  test('should insert a script element with correct query parameters including environmentID and authorizationToken', () => {
    const containerID = 'GTM-TEST';
    const serverUrl = 'https://custom-server.com';
    const environmentID = 'env123';
    const authorizationToken = 'auth456';

    loadNativeSdk(containerID, serverUrl, environmentID, authorizationToken);

    const scripts = document.getElementsByTagName('script');
    const insertedScript = scripts[0];

    // Expected src: serverUrl/gtm.js?id=containerID
    // + '&gtm_auth=' + encodeURIComponent(authorizationToken)
    // + '&gtm_preview=' + encodeURIComponent(environmentID)
    // + '&gtm_cookies_win=x'
    const expectedSrc =
      `${serverUrl}/gtm.js?id=${containerID}` +
      '&gtm_cookies_win=x' +
      `&gtm_preview=${encodeURIComponent(environmentID)}` +
      `&gtm_auth=${encodeURIComponent(authorizationToken)}`;

    expect(insertedScript.src).toBe(expectedSrc);
  });
});
