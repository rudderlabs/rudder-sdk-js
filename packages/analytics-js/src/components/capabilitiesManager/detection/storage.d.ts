import { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
declare const isStorageQuotaExceeded: (e: DOMException | any) => boolean;
declare const isStorageAvailable: (
  type?: StorageType,
  storageInstance?: IStorage,
  logger?: ILogger,
) => boolean;
export { isStorageQuotaExceeded, isStorageAvailable };
