const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const hasCrypto = window.crypto && typeof window.crypto.getRandomValues === 'function';

export { isBrowser, isNode, hasCrypto };
