const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode = (): boolean =>
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const hasCrypto = (): boolean =>
  Boolean(window.crypto && typeof window.crypto.getRandomValues === 'function');

const hasUAClientHints = (): boolean => Boolean(window.navigator.userAgentData);

const hasBeacon = (): boolean => Boolean(window.navigator.sendBeacon);

export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon };
