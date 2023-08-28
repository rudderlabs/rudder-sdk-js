import { UserSessionKeys } from './userSessionStorageKeys';

export enum StorageEncryptionVersion {
  Legacy = 'legacy',
  V3 = 'v3', // default
}

export type StorageType = MigrationStorageType | 'memoryStorage' | 'sessionStorage' | 'none';

export const SUPPORTED_STORAGE_TYPES = [
  'localStorage',
  'memoryStorage',
  'cookieStorage',
  'sessionStorage',
  'none',
];

export const DEFAULT_STORAGE_TYPE = 'cookieStorage';
export type MigrationStorageType = 'cookieStorage' | 'localStorage';

export type StorageEncryption = {
  version: StorageEncryptionVersion;
};

export type LoadOptionStorageEntry = {
  type: StorageType;
};

export type StorageOpts = {
  encryption?: StorageEncryption;
  migrate?: boolean;
  type?: StorageType;
  cookie?: CookieOptions;
  entries?: {
    [key in UserSessionKeys]?: LoadOptionStorageEntry;
  };
};

export type UserSessionKeysType = keyof typeof UserSessionKeys;

export type CookieOptions = {
  maxage?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  samesite?: string;
  secure?: boolean;
};

export enum CookieSameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}
