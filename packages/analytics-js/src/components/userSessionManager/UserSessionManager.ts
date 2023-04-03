import { state } from '@rudderstack/analytics-js/state';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import { defaultSessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import {
  AnonymousIdOptions,
  ApiObject,
  ApiOptions,
  SessionInfo,
} from '@rudderstack/analytics-js/state/types';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import * as R from 'ramda';
import { IUserSessionManager } from './types';

// TODO: the v1.1 user data storage part joined with the auto session features and addCampaignInfo
class UserSessionManager implements IUserSessionManager {
  storage?: IStore;

  constructor(storage?: IStore) {
    this.storage = storage;
  }

  setStorage(storage: IStore) {
    this.storage = storage;
  }

  /**
   * Sets anonymous id in the following precedence:
   *
   * 1. anonymousId: Id directly provided to the function.
   * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
   *    using parseLinker util.
   * 3. generateUUID: A new unique id is generated and assigned.
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): string {
    const anonymousIdFromLinker = defaultPluginManager.invoke<Nullable<string>>(
      'userSession.anonymousIdGoogleLinker',
      rudderAmpLinkerParam,
    );

    state.session.rl_anonymous_id.value = anonymousId || anonymousIdFromLinker[0] || generateUUID();
    this.storage?.set('rl_anonymous_id', state.session.rl_anonymous_id.value);
    return state.session.rl_anonymous_id.value;
  }

  getAnonymousId(options?: AnonymousIdOptions): string {
    // fetch the rl_anonymous_id from storage
    let persistedAnonymousId = this.storage?.get('rl_anonymous_id');

    if (!persistedAnonymousId) {
      // TODO: implement the storage.getAnonymousId autoCapture functionality as plugin that takes options in
      const autoCapturedAnonymousId = [undefined];

      if (autoCapturedAnonymousId[0]) {
        persistedAnonymousId = autoCapturedAnonymousId[0];
      } else {
        return this.setAnonymousId();
      }
    }

    state.session.rl_anonymous_id.value = persistedAnonymousId;
    return persistedAnonymousId;
  }

  /**
   * A function to return current session info
   */
  getSessionInfo(): Nullable<SessionInfo> {
    const shouldReturnInfo = Boolean(
      state.session.rl_session.value.manualTrack ||
        (state.session.rl_session.value.autoTrack &&
          this.isValidSession(state.session.rl_session.value.expiresAt)),
    );

    if (shouldReturnInfo) {
      return state.session.rl_session.value || null;
    }

    return null;
  }

  // TODO: move to utility method
  // eslint-disable-next-line class-methods-use-this
  isValidSession(sessionExpirationTimestamp?: number, timestamp = Date.now()): boolean {
    return Boolean(sessionExpirationTimestamp && timestamp <= sessionExpirationTimestamp);
  }

  getGroupId(): Nullable<string> {
    return this.storage?.get('rl_group_id') || null;
  }

  getGroupTraits(): Nullable<ApiObject> {
    return this.storage?.get('rl_group_trait') || null;
  }

  reset(resetAnonymousId?: boolean, noNewSessionStart?: boolean) {
    const { manualTrack, autoTrack } = state.session.rl_session.value;

    state.session.rl_user_id.value = '';
    state.session.rl_trait.value = {};
    state.session.rl_group_id.value = '';
    state.session.rl_group_trait.value = {};

    if (resetAnonymousId) {
      state.session.rl_anonymous_id.value = '';
    }

    if (noNewSessionStart) {
      return;
    }

    if (autoTrack) {
      state.session.rl_session.value = { ...defaultSessionInfo };
      this.startAutoTracking();
    } else if (manualTrack) {
      this.start();
    }
  }

  setUserId(userId?: Nullable<string>) {
    state.session.rl_user_id.value = userId;
    this.storage?.set('rl_user_id', userId);
  }

  // TODO: should we reset traits in value is null?
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.rl_trait.value = mergeDeepRight(state.session.rl_trait.value || {}, traits);
      window.setTimeout(() => {
        this.storage?.set('rl_trait', state.session.rl_trait.value);
      }, 1);
    }
  }

  setGroupId(groupId?: Nullable<string>) {
    state.session.rl_group_id.value = groupId;
    this.storage?.set('rl_group_id', groupId);
  }

  // TODO: should we reset traits in value is null?
  setGroupTraits(traits?: Nullable<ApiOptions>) {
    if (traits) {
      state.session.rl_group_trait.value = mergeDeepRight(
        state.session.rl_group_trait.value || {},
        traits,
      );
      window.setTimeout(() => {
        this.storage?.set('rl_group_trait', state.session.rl_group_trait.value);
      }, 1);
    }
  }

  startAutoTracking() {}

  start(sessionId?: number) {}

  end() {
    this.reset(false, true);
    this.clearUserSessionStorage();
  }

  clearUserSessionStorage(resetAnonymousId?: boolean) {
    this.storage?.remove('rl_user_id');
    this.storage?.remove('rl_trait');
    this.storage?.remove('rl_group_id');
    this.storage?.remove('rl_group_trait');

    if (resetAnonymousId) {
      this.storage?.remove('rl_anonymous_id');
    }
  }
}

const defaultUserSessionManager = new UserSessionManager();

export { UserSessionManager, defaultUserSessionManager };
