// eslint-disable-next-line import/no-cycle
import { CookieOptions } from './Store';
import { UserSessionKeys } from './userSessionStorageKeys';

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
  cookie?: CookieOptions;
  entries?: {
    [UserSessionKeys.userId]?: {
      type: StorageType;
    };
    [UserSessionKeys.userTraits]?: {
      type: StorageType;
    };
    [UserSessionKeys.anonymousUserId]?: {
      type: StorageType;
    };
    [UserSessionKeys.groupId]?: {
      type: StorageType;
    };
    [UserSessionKeys.groupTraits]?: {
      type: StorageType;
    };
    [UserSessionKeys.initialReferrer]?: {
      type: StorageType;
    };
    [UserSessionKeys.initialReferringDomain]?: {
      type: StorageType;
    };
    [UserSessionKeys.sessionInfo]?: {
      type: StorageType;
    };
  };
};
