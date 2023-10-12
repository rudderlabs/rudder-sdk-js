import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
declare const validateWriteKey: (writeKey?: string) => void;
declare const validateDataPlaneUrl: (dataPlaneUrl?: string) => void;
declare const validateLoadArgs: (writeKey?: string, dataPlaneUrl?: string) => void;
declare const isValidSourceConfig: (res: any) => boolean;
declare const isValidStorageType: (storageType?: StorageType) => boolean;
export {
  validateLoadArgs,
  isValidSourceConfig,
  isValidStorageType,
  validateWriteKey,
  validateDataPlaneUrl,
};
