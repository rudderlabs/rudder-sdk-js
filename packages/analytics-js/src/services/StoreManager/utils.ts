import { NO_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { StorageType, DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';

const getStorageTypeFromPreConsentIfApplicable = (state: ApplicationState, sessionKey: string) => {
  let overriddenStorageType: StorageType | undefined;
  if (state.consents.preConsent.value.enabled) {
    switch (state.consents.preConsent.value.storage?.strategy) {
      case 'none':
        overriddenStorageType = NO_STORAGE;
        break;
      case 'session':
        if (sessionKey !== 'sessionInfo') {
          overriddenStorageType = NO_STORAGE;
        } else {
          overriddenStorageType = DEFAULT_STORAGE_TYPE;
        }
        break;
      case 'anonymousId':
        if (sessionKey !== 'anonymousId') {
          overriddenStorageType = NO_STORAGE;
        } else {
          overriddenStorageType = DEFAULT_STORAGE_TYPE;
        }
        break;
      default:
        break;
    }
  }
  return overriddenStorageType;
};

export { getStorageTypeFromPreConsentIfApplicable };
