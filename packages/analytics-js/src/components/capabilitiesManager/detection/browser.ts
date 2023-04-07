import { Nullable } from '@rudderstack/analytics-js/types';

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode = (): boolean =>
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const hasCrypto = (): boolean =>
  Boolean(window.crypto && typeof window.crypto.getRandomValues === 'function');

// eslint-disable-next-line compat/compat
const hasUAClientHints = (): boolean => Boolean(window.navigator.userAgentData);

// eslint-disable-next-line compat/compat
const hasBeacon = (): boolean => Boolean(window.navigator.sendBeacon);

const getUserAgent = (): Nullable<string> => {
  if (typeof window.navigator === 'undefined') {
    return null;
  }

  let { userAgent } = window.navigator;
  const { brave } = window.navigator as any;

  // For supporting Brave browser detection,
  // add "Brave/<version>" to the user agent with the version value from the Chrome component
  if (brave && Object.getPrototypeOf(brave).isBrave) {
    // Example:
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
    const matchedArr = userAgent.match(/(chrome)\/([\w.]+)/i);

    if (matchedArr) {
      userAgent = `${userAgent} Brave/${matchedArr[2]}`;
    }
  }

  return userAgent;
};

const getLanguage = (): Nullable<string> => {
  if (typeof window.navigator === 'undefined') {
    return null;
  }

  return window.navigator.language || (window.navigator as any).browserLanguage;
};

export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon, getUserAgent, getLanguage };
