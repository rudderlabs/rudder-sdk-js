import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { userSessionStorageKeys } from './userSessionStorageKeys';

export interface IUserSessionManager {
  storeManager?: IStoreManager;
  init(): void;
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;
  getAnonymousId(options?: AnonymousIdOptions): string;
  refreshSession(): void;
  getSessionId(): Nullable<number>;
  getGroupId(): Nullable<string>;
  getUserId(): Nullable<string>;
  setUserId(userId?: null | string): void;
  setUserTraits(traits?: Nullable<ApiObject>): void;
  getUserTraits(): Nullable<ApiObject>;
  getGroupTraits(): Nullable<ApiObject>;
  setGroupId(groupId?: Nullable<string>): void;
  setGroupTraits(traits?: Nullable<ApiObject>): void;
  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean): void;
  start(sessionId?: number): void;
  end(): void;
  syncStorageDataToState(): void;
}

export type UserSessionStorageKeysType = keyof typeof userSessionStorageKeys;
