import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import { AnonymousIdOptions, ApiObject } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

export interface IUserSessionManager {
  storage?: IStore;
  init(storage: IStore): void;
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;
  getAnonymousId(options?: AnonymousIdOptions): string;
  refreshSession(): void;
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
  clearUserSessionStorage(resetAnonymousId?: boolean): void;
}
