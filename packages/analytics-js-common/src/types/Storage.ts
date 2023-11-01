import type { UserSessionKeys } from './userSessionStorageKeys';

export type StorageEncryptionVersion = 'legacy' | 'v3'; // default is v3

export type StorageType =
  | 'cookieStorage'
  | 'localStorage'
  | 'memoryStorage'
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

export type CookieOptions = {
  maxage?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  samesite?: string;
  secure?: boolean;
};

export type CookieSameSite = 'Strict' | 'Lax' | 'None';
