export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isNode = (): boolean =>
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export const hasCrypto = (): boolean =>
  Boolean(window.crypto && typeof window.crypto.getRandomValues === 'function');

// eslint-disable-next-line compat/compat
export const hasUAClientHints = (): boolean => Boolean(window.navigator.userAgentData);

// eslint-disable-next-line compat/compat
export const hasBeacon = (): boolean => Boolean(window.navigator.sendBeacon);
