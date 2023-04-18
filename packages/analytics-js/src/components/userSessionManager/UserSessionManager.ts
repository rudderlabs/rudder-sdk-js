import { state } from '@rudderstack/analytics-js/state';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import { defaultSessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import { effect } from '@preact/signals-core';
import {
  AnonymousIdOptions,
  ApiObject,
  ApiOptions,
  SessionInfo,
} from '@rudderstack/analytics-js/state/types';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { IUserSessionManager } from './types';
import { getReferrer } from './referrer';
import { persistedSessionStorageKeys } from './sessionStorageKeys';

// TODO: the v1.1 user data storage part joined with the auto session features and addCampaignInfo
class UserSessionManager implements IUserSessionManager {
  storage?: IStore;

  constructor(storage?: IStore) {
    this.storage = storage;
  }

  init(storage: IStore) {
    this.storage = storage;

    this.setUserId(this.getUserId() || '');
    this.setUserTraits(this.getUserTraits() || {});
    this.setGroupId(this.getGroupId() || '');
    this.setGroupTraits(this.getGroupTraits() || {});
    this.setAnonymousId(this.getAnonymousId());

    const initialReferrer = this.getInitialReferrer();
    const initialReferringDomain = this.getInitialReferringDomain();

    state.session.rl_page_init_referrer.value =
      initialReferrer !== null ? initialReferrer : undefined;
    state.session.rl_page_init_referring_domain.value =
      initialReferringDomain !== null ? initialReferringDomain : undefined;

    if (initialReferrer === null && initialReferringDomain === null) {
      const referrer = getReferrer();
      this.setInitialReferrer(referrer);
      this.setInitialReferringDomain(referrer);
    }
    // TODO: remove this when work for this module is done
    // effect(() => {
    //   console.log(persistedSessionStorageKeys.userId, state.session.rl_user_id.value);
    //   console.log(persistedSessionStorageKeys.userAnonymousId, state.session.rl_anonymous_id.value);
    //   console.log(persistedSessionStorageKeys.userTraits, state.session.rl_trait.value);
    //   console.log(persistedSessionStorageKeys.groupId, state.session.rl_group_id.value);
    //   console.log(persistedSessionStorageKeys.groupTraits, state.session.rl_group_trait.value);
    //   console.log(persistedSessionStorageKeys.initialReferrer, state.session.rl_page_init_referrer.value);
    //   console.log(
    //     persistedSessionStorageKeys.initialReferringDomain,
    //     state.session.rl_page_init_referring_domain.value,
    //   );
    // });
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
    let anonymousIdFromLinker;
    if (!anonymousId) {
      anonymousIdFromLinker = defaultPluginManager.invoke<Nullable<string>>(
        'userSession.anonymousIdGoogleLinker',
        rudderAmpLinkerParam,
      );
    }

    state.session.rl_anonymous_id.value =
      anonymousId || (anonymousIdFromLinker && anonymousIdFromLinker[0]) || generateUUID();
    this.storage?.set(
      persistedSessionStorageKeys.userAnonymousId,
      state.session.rl_anonymous_id.value,
    );
    return state.session.rl_anonymous_id.value;
  }

  getAnonymousId(options?: AnonymousIdOptions): string {
    // fetch the rl_anonymous_id from storage
    let persistedAnonymousId = this.storage?.get(persistedSessionStorageKeys.userAnonymousId);

    if (!persistedAnonymousId) {
      // TODO: implement the storage.getAnonymousId autoCapture functionality as plugin that takes options in
      const autoCapturedAnonymousId = defaultPluginManager.invoke<string | undefined>(
        'storage.getAnonymousId',
        options,
      );

      if (autoCapturedAnonymousId[0]) {
        [persistedAnonymousId] = autoCapturedAnonymousId;
      } else {
        return this.setAnonymousId();
      }
    }

    state.session.rl_anonymous_id.value = persistedAnonymousId;
    return persistedAnonymousId;
  }

  // TODO: session tracking
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

  // TODO: session tracking
  // TODO: move to utility method
  // eslint-disable-next-line class-methods-use-this
  isValidSession(sessionExpirationTimestamp?: number, timestamp = Date.now()): boolean {
    return Boolean(sessionExpirationTimestamp && timestamp <= sessionExpirationTimestamp);
  }

  getUserId(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.userId) || null;
  }

  getUserTraits(): Nullable<ApiObject> {
    return this.storage?.get(persistedSessionStorageKeys.userTraits) || null;
  }

  getGroupId(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.groupId) || null;
  }

  getGroupTraits(): Nullable<ApiObject> {
    return this.storage?.get(persistedSessionStorageKeys.groupTraits) || null;
  }

  getInitialReferrer(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.initialReferrer) || null;
  }

  getInitialReferringDomain(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.initialReferringDomain) || null;
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
    this.storage?.set(persistedSessionStorageKeys.userId, userId);
  }

  // TODO: should we reset traits in value is null?
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.rl_trait.value = mergeDeepRight(state.session.rl_trait.value || {}, traits);
      window.setTimeout(() => {
        this.storage?.set(persistedSessionStorageKeys.userTraits, state.session.rl_trait.value);
      }, 1);
    }
  }

  setGroupId(groupId?: Nullable<string>) {
    state.session.rl_group_id.value = groupId;
    this.storage?.set(persistedSessionStorageKeys.groupId, groupId);
  }

  // TODO: should we reset traits in value is null?
  setGroupTraits(traits?: Nullable<ApiOptions>) {
    if (traits) {
      state.session.rl_group_trait.value = mergeDeepRight(
        state.session.rl_group_trait.value || {},
        traits,
      );
      window.setTimeout(() => {
        this.storage?.set(
          persistedSessionStorageKeys.groupTraits,
          state.session.rl_group_trait.value,
        );
      }, 1);
    }
  }

  setInitialReferrer(referrer?: string) {
    state.session.rl_page_init_referrer.value = referrer;
    this.storage?.set(persistedSessionStorageKeys.initialReferrer, referrer);
  }

  setInitialReferringDomain(referrer?: string) {
    state.session.rl_page_init_referring_domain.value = referrer;
    this.storage?.set(persistedSessionStorageKeys.initialReferringDomain, referrer);
  }

  // TODO: session tracking
  startAutoTracking() {}

  // TODO: session tracking
  start(sessionId?: number) {}

  // TODO: session tracking
  end() {
    this.reset(false, true);
    this.clearUserSessionStorage();
  }

  clearUserSessionStorage(resetAnonymousId?: boolean) {
    this.storage?.remove(persistedSessionStorageKeys.userId);
    this.storage?.remove(persistedSessionStorageKeys.userTraits);
    this.storage?.remove(persistedSessionStorageKeys.groupId);
    this.storage?.remove(persistedSessionStorageKeys.groupTraits);

    if (resetAnonymousId) {
      this.storage?.remove(persistedSessionStorageKeys.userAnonymousId);
    }
  }
}

const defaultUserSessionManager = new UserSessionManager();

export { UserSessionManager, defaultUserSessionManager };
