import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { AnonymousIdOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { USER_SESSION_STORAGE_KEYS } from './constants';

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
  setAuthToken(token: Nullable<string>): void;
}

export type UserSessionStorageKeysType = keyof typeof USER_SESSION_STORAGE_KEYS;

export type CookieData = {
  name: string;
  value: ApiObject | string;
};

export type EncryptedCookieData = {
  name: string;
  value?: string;
};

export type CallbackFunction = (name: string, value: string | ApiObject) => void;
