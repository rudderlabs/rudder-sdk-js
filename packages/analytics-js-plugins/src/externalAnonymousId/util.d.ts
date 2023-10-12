import { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
declare const getSegmentAnonymousId: (
  getStorageEngine: (type?: StorageType) => IStorage,
) => string | null | undefined;
export { getSegmentAnonymousId };
