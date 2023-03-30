import { getSDKUrlInfo } from '@rudderstack/analytics-js/components/configManager/util/commonUtil';

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

describe('Common util: getSDKUrlInfo', () => {
  afterEach(() => {
    removeScriptElement();
  });

  it('should return SDK url that is being used', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics.min.js';
    createScriptElement(dummySdkURL);

    const { isStaging, sdkURL } = getSDKUrlInfo();
    expect(sdkURL).toBe(dummySdkURL);
    expect(isStaging).toBe(false);
  });
  it('should return isStaging as true if staging SDK is being used', () => {
    const dummySdkURL = 'https://www.dummy.url/fromScript/v3/rudder-analytics-staging.min.js';
    createScriptElement(dummySdkURL);

    const { isStaging, sdkURL } = getSDKUrlInfo();
    expect(sdkURL).toBe(dummySdkURL);
    expect(isStaging).toBe(true);
  });
});
