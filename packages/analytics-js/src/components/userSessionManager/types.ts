import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import { AnonymousIdOptions, ApiObject, ApiOptions, SessionInfo } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

export interface IUserSessionManager {
  storage?: IStore;
  setStorage(storage: IStore): void;
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): string;
  getAnonymousId(options?: AnonymousIdOptions): string;
  getSessionInfo(): Nullable<SessionInfo>;
  getGroupId(): Nullable<string>;
  getUserId(): Nullable<string>;
  setUserId(userId?: null | string): void;
  setUserTraits(traits?: Nullable<ApiObject>): void;
  getGroupTraits(): Nullable<ApiObject>;
  setGroupId(groupId?: Nullable<string>): void;
  setGroupTraits(traits?: Nullable<ApiOptions>): void;
  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean): void;
  start(sessionId?: number): void;
  end(): void;
  clearUserSessionStorage(resetAnonymousId?: boolean): void;
}
