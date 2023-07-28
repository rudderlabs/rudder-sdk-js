import { StorageType } from './Store';

export enum StorageEncryptionVersion {
  Legacy = 'legacy',
  V3 = 'v3', // default
}

export type StorageEncryption = {
  version: StorageEncryptionVersion;
};

export type StorageOpts = {
  encryption?: StorageEncryption;
  migrate?: boolean;
  type?: StorageType;
};
