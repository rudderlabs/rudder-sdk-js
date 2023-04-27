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

export { isBrowser, isNode, hasCrypto, hasUAClientHints, hasBeacon };
