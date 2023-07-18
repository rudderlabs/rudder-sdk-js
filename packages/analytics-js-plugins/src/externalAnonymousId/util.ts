import { StorageType, IStorage } from '../types/common';
import { COOKIE_STORAGE, LOCAL_STORAGE } from '../utilities/common';
import { externallyLoadedSessionStorageKeys } from './constants';

const getSegmentAnonymousId = (getStorageEngine: (type?: StorageType) => IStorage) => {
  let anonymousId;
  /**
   * First check the local storage for anonymousId
   * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
   */
  const lsEngine = getStorageEngine(LOCAL_STORAGE);
  if (lsEngine?.isEnabled) {
    anonymousId = lsEngine.getItem(externallyLoadedSessionStorageKeys.segment);
  }

  // If anonymousId is not present in local storage and find it in cookies
  const csEngine = getStorageEngine(COOKIE_STORAGE);
  if (!anonymousId && csEngine?.isEnabled) {
    anonymousId = csEngine.getItem(externallyLoadedSessionStorageKeys.segment);
  }
  return anonymousId;
};

export { getSegmentAnonymousId };