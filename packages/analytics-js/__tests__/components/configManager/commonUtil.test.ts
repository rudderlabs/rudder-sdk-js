import { getSDKUrl } from '@rudderstack/analytics-js/components/configManager/util/commonUtil';

const createScriptElement = (url: string) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.id = 'SOME_ID';
  document.head.appendChild(script);
};

const removeScriptElement = () => {
  const scriptElem = document.getElementById('SOME_ID');
  scriptElem.remove();
};

describe('Common util: getSDKUrl', () => {
  afterEach(() => {
    removeScriptElement();
  });

  it('should return SDK url that is being used', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min.js';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(dummySdkURL);
  });

  it('should return sdkURL as undefined when rudder SDK is not used', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/other.min.js';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(undefined);
  });
  it('should return sdkURL when development rudder SDK is used', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.js';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(dummySdkURL);
  });
  it('should return sdkURL as undefined when different SDK is used with similar name', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder.min.js';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(undefined);
  });
  it('should return sdkURL as undefined when different SDK is used with the name analytics', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/analytics.min.js';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(undefined);
  });
  it('should return sdkURL as undefined when rudder SDK is used with incomplete name', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min';
    createScriptElement(dummySdkURL);

    const sdkURL = getSDKUrl();
    expect(sdkURL).toBe(undefined);
  });
});
