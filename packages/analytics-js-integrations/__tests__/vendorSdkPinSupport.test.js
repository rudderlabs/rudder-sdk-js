import Bugsnag from '../src/integrations/Bugsnag/browser';
import Iterable from '../src/integrations/Iterable/browser';
import Keen from '../src/integrations/Keen/browser';
import LaunchDarkly from '../src/integrations/LaunchDarkly/browser';
import Amplitude from '../src/integrations/Amplitude/browser';
import Sentry from '../src/integrations/Sentry/browser';
import Lotame from '../src/integrations/Lotame/browser';
import Ninetailed from '../src/integrations/Ninetailed/browser';
import Optimizely from '../src/integrations/Optimizely/browser';
import Shynet from '../src/integrations/Shynet/browser';
import GA4 from '../src/integrations/GA4/browser';
import GA4_V2 from '../src/integrations/GA4_V2/browser';
import GoogleAds from '../src/integrations/GoogleAds/browser';
import Appcues from '../src/integrations/Appcues/browser';
import Rockerbox from '../src/integrations/Rockerbox/browser';
import Mixpanel from '../src/integrations/Mixpanel/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import { isCustomerVendorSdkUrl } from '../src/utils/customerVendorSdkUrl';

jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));

let inserted;
beforeEach(() => {
  jest.clearAllMocks();
  document.head.innerHTML = '<script></script>';
  inserted = [];
  jest.spyOn(Node.prototype, 'insertBefore').mockImplementation(node => {
    inserted.push(node);
    return node;
  });
  jest.spyOn(document.head, 'appendChild').mockImplementation(node => {
    inserted.push(node);
    return node;
  });
});
afterEach(() => {
  jest.restoreAllMocks();
  for (const key of ['MIXPANEL_CUSTOM_LIB_URL', 'mixpanel', 'RB', 'gtag', 'dataLayer']) {
    delete window[key];
  }
  document.head.innerHTML = '';
});

test.each([Bugsnag, Iterable, Keen, LaunchDarkly, Amplitude, Sentry])(
  '%p declares full support on its instance',
  Integration => {
    expect(new Integration({}, {}).getVendorSdkPinSupport()).toBe('full');
  },
);
test.each([Lotame, Ninetailed, Optimizely, Shynet])(
  '%p declares no-script support on its instance',
  Integration => {
    expect(new Integration({}, {}).getVendorSdkPinSupport()).toBe('no-script');
  },
);

describe.each([GA4, GA4_V2, GoogleAds])('%p customer URL support', Integration => {
  test.each([
    undefined,
    null,
    '',
    'https://www.googletagmanager.com',
    'https://www.googletagmanager.com/',
    'https://www.googletagmanager.com/gtag/js',
    'https://WWW.GOOGLETAGMANAGER.COM/gtag/js///',
    'https://www.googletagmanager.com:8443/gtag/js',
  ])('default hostname never counts as customer: %s', sdkBaseUrl => {
    const integration = new Integration(
      { sdkBaseUrl, measurementId: 'G-123' },
      { getUserId: () => undefined },
    );
    expect(integration.getVendorSdkPinSupport()).toBe('none');
    integration.init();
    const url = Integration === GoogleAds ? inserted[0].src : ScriptLoader.mock.calls[0][1];
    expect(new URL(url).hostname).toBe('www.googletagmanager.com');
  });
  test.each(['https://customer.example', 'https://customer.example/custom///'])(
    'customer support agrees with loaded URL: %s',
    sdkBaseUrl => {
      const integration = new Integration(
        { sdkBaseUrl, measurementId: 'G-123' },
        { getUserId: () => undefined },
      );
      expect(integration.getVendorSdkPinSupport()).toBe('customer');
      integration.init();
      const url = Integration === GoogleAds ? inserted[0].src : ScriptLoader.mock.calls[0][1];
      expect(new URL(url).hostname).toBe('customer.example');
      expect(url).toContain('https://customer.example/');
    },
  );
});

test('invalid URLs fail closed and relative URLs use the page hostname', () => {
  expect(isCustomerVendorSdkUrl('https://[', 'https://www.googletagmanager.com')).toBe(false);
  expect(isCustomerVendorSdkUrl('/sdk', 'https://www.googletagmanager.com')).toBe(true);
});

test.each([
  [undefined, 'none', 'https://fast.appcues.com/account.js'],
  [null, 'none', 'https://fast.appcues.com/account.js'],
  ['', 'none', 'https://fast.appcues.com/account.js'],
  [42, 'none', 'https://fast.appcues.com/account.js'],
  ['https://fast.appcues.com', 'none', 'https://fast.appcues.com/account.js'],
  ['https://FAST.APPCUES.COM:8443/sdk.js', 'none', 'https://FAST.APPCUES.COM:8443/sdk.js'],
  ['//fast.appcues.com/sdk.js', 'none', '//fast.appcues.com/sdk.js'],
  ['https://[', 'none', 'https://[/account.js'],
  ['/sdk.js', 'customer', '/sdk.js'],
  ['https://customer.example/sdk.js', 'customer', 'https://customer.example/sdk.js'],
  ['https://customer.example/', 'customer', 'https://customer.example/account.js'],
  ['https://customer.example', 'customer', 'https://customer.example/account.js'],
])('Appcues support mirrors nativeSdkUrl %s', (nativeSdkUrl, support, url) => {
  const integration = new Appcues({ nativeSdkUrl, accountId: 'account' }, {});
  expect(integration.getVendorSdkPinSupport()).toBe(support);
  integration.init();
  expect(ScriptLoader).toHaveBeenCalledWith('appcues-id', url);
});

test.each([
  [undefined, 'none'],
  [null, 'none'],
  ['', 'none'],
  [false, 'none'],
  ['customer.example', 'customer'],
  ['getrockerbox.com', 'none'],
  ['GETROCKERBOX.COM:8443', 'none'],
  ['[', 'none'],
  ['/relative', 'customer'],
])('Rockerbox support mirrors customDomain %s', (customDomain, support) => {
  for (const enableCookieSync of [false, true]) {
    delete window.RB;
    const integration = new Rockerbox({ customDomain, enableCookieSync }, {});
    expect(integration.getVendorSdkPinSupport()).toBe(support);
    integration.init();
    const library = customDomain && enableCookieSync ? 'wxyz.rb' : 'wxyz.v2';
    expect(inserted.at(-1).getAttribute('src')).toBe(
      `https://${customDomain || 'getrockerbox.com'}/assets/${library}.js`,
    );
  }
});

test.each([
  [undefined, 'none'],
  [null, 'customer'],
  ['', 'customer'],
  [false, 'customer'],
  ['https://customer.example/sdk.js', 'customer'],
  ['https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js', 'none'],
  ['//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js', 'none'],
  ['https://CDN.MXPNL.COM:8443/custom.js', 'none'],
  ['https://[', 'none'],
  ['/sdk.js', 'customer'],
])('Mixpanel support mirrors effective global URL %s', (customUrl, support) => {
  window.MIXPANEL_CUSTOM_LIB_URL = customUrl;
  const integration = new Mixpanel({}, {});
  expect(integration.getVendorSdkPinSupport()).toBe(support);
  integration.init();
  const rawUrl = inserted[0].getAttribute('src');
  expect(rawUrl).toBe(
    customUrl === undefined ? '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js' : String(customUrl),
  );
});

test('Mixpanel checks the global at load time, including an absent global', () => {
  delete window.MIXPANEL_CUSTOM_LIB_URL;
  const integration = new Mixpanel({}, {});
  expect(integration.getVendorSdkPinSupport()).toBe('none');
  window.MIXPANEL_CUSTOM_LIB_URL = 'https://customer.example/sdk.js';
  expect(integration.getVendorSdkPinSupport()).toBe('customer');
  integration.init();
  expect(inserted[0].src).toBe('https://customer.example/sdk.js');
});
