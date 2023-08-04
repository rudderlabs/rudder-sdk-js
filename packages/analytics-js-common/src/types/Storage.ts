export enum StorageEncryptionVersion {
  Legacy = 'legacy',
  V3 = 'v3', // default
}

export type StorageType =
  | 'localStorage'
  | 'memoryStorage'
  | 'cookieStorage'
  | 'sessionStorage'
  | 'none';

export const SUPPORTED_STORAGE_TYPES = [
  'localStorage',
  'memoryStorage',
  'cookieStorage',
  'sessionStorage',
  'none',
];

export const DEFAULT_STORAGE_TYPE = 'cookieStorage';

export type StorageEncryption = {
  version: StorageEncryptionVersion;
};

export type StorageOpts = {
  encryption?: StorageEncryption;
  migrate?: boolean;
  type?: StorageType;
};
