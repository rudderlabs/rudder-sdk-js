/* eslint-disable class-methods-use-this */
import { state } from '@rudderstack/analytics-js/state';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { defaultPluginManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { Nullable } from '@rudderstack/analytics-js/types';
import { defaultSessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { IStore } from '@rudderstack/analytics-js/services/StoreManager/types';
import { effect } from '@preact/signals-core';
import { AnonymousIdOptions, ApiObject, SessionInfo } from '@rudderstack/analytics-js/state/types';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { IUserSessionManager } from './types';
import { persistedSessionStorageKeys } from './sessionStorageKeys';
import { getReferrer } from '../utilities/page';
import { getReferringDomain } from '../utilities/url';

// TODO: the v1.1 user data storage part joined with the auto session features and addCampaignInfo
class UserSessionManager implements IUserSessionManager {
  storage?: IStore;

  constructor(storage?: IStore) {
    this.storage = storage;
  }

  /**
   * Initialize User session with values from storage
   * @param storage Selected storage
   */
  init(storage: IStore) {
    this.storage = storage;

    // get the values from storage and set it again
    this.setUserId(this.getUserId() || '');
    this.setUserTraits(this.getUserTraits() || {});
    this.setGroupId(this.getGroupId() || '');
    this.setGroupTraits(this.getGroupTraits() || {});
    this.setAnonymousId(this.getAnonymousId());

    const initialReferrer = this.getInitialReferrer();
    const initialReferringDomain = this.getInitialReferringDomain();

    if (initialReferrer && initialReferringDomain) {
      this.setInitialReferrer(initialReferrer);
      this.setInitialReferringDomain(initialReferringDomain);
    } else {
      if (initialReferrer) {
        this.setInitialReferrer(initialReferrer);
        this.setInitialReferringDomain(getReferringDomain(initialReferrer));
      }
      const referrer = getReferrer();
      this.setInitialReferrer(referrer);
      this.setInitialReferringDomain(getReferringDomain(referrer));
    }
    // Register the effect to sync with storage
    this.syncSessionWithStorage();
  }

  /**
   * Function to update storage whenever state value changes
   */
  syncSessionWithStorage() {
    /**
     * Update userId in storage automatically when userId is updated in state
     */
    effect(() => {
      this.storage?.set(persistedSessionStorageKeys.userId, state.session.rl_user_id.value);
    });
    /**
     * Update user traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(persistedSessionStorageKeys.userTraits, state.session.rl_trait.value);
    });
    /**
     * Update group id in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(persistedSessionStorageKeys.groupId, state.session.rl_group_id.value);
    });
    /**
     * Update group traits in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(
        persistedSessionStorageKeys.groupTraits,
        state.session.rl_group_trait.value,
      );
    });
    /**
     * Update anonymous user id in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(
        persistedSessionStorageKeys.anonymousUserId,
        state.session.rl_anonymous_id.value,
      );
    });
    /**
     * Update initial referrer in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(
        persistedSessionStorageKeys.initialReferrer,
        state.session.rl_page_init_referrer.value,
      );
    });
    /**
     * Update initial referring domain in storage automatically when it is updated in state
     */
    effect(() => {
      this.storage?.set(
        persistedSessionStorageKeys.initialReferringDomain,
        state.session.rl_page_init_referring_domain.value,
      );
    });
  }

  /**
   * Sets anonymous id in the following precedence:
   *
   * 1. anonymousId: Id directly provided to the function.
   * 2. rudderAmpLinkerParam: value generated from linker query parm (rudderstack)
   *    using parseLinker util.
   * 3. generateUUID: A new unique id is generated and assigned.
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string) {
    let finalAnonymousId: string | undefined = anonymousId;
    if (!finalAnonymousId) {
      const linkerPluginsResult = defaultPluginManager.invoke<Nullable<string>>(
        'userSession.anonymousIdGoogleLinker',
        rudderAmpLinkerParam,
      );
      finalAnonymousId = linkerPluginsResult?.[0] || generateUUID();
    }

    state.session.rl_anonymous_id.value = finalAnonymousId;
  }

  /**
   * Fetches anonymousId
   * @param options option to fetch it from external source
   * @returns anonymousId
   */
  getAnonymousId(options?: AnonymousIdOptions): string {
    // fetch the rl_anonymous_id from storage
    let persistedAnonymousId = this.storage?.get(persistedSessionStorageKeys.anonymousUserId);

    if (!persistedAnonymousId) {
      // fetch anonymousId from external source
      const autoCapturedAnonymousId = defaultPluginManager.invoke<string | undefined>(
        'storage.getAnonymousId',
        options,
      );
      if (autoCapturedAnonymousId?.[0]) {
        [persistedAnonymousId] = autoCapturedAnonymousId;
      } else {
        // set a new anonymousId if not available from previous step
        this.setAnonymousId();
      }
    }
    state.session.rl_anonymous_id.value =
      persistedAnonymousId || state.session.rl_anonymous_id.value;
    return state.session.rl_anonymous_id.value as string;
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

  /**
   * Fetches User Id
   * @returns
   */
  getUserId(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.userId) || null;
  }

  /**
   * Fetches User Traits
   * @returns
   */
  getUserTraits(): Nullable<ApiObject> {
    return this.storage?.get(persistedSessionStorageKeys.userTraits) || null;
  }

  /**
   * Fetches Group Id
   * @returns
   */
  getGroupId(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.groupId) || null;
  }

  /**
   * Fetches Group Traits
   * @returns
   */
  getGroupTraits(): Nullable<ApiObject> {
    return this.storage?.get(persistedSessionStorageKeys.groupTraits) || null;
  }

  /**
   * Fetches Initial Referrer
   * @returns
   */
  getInitialReferrer(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.initialReferrer) || null;
  }

  /**
   * Fetches Initial Referring domain
   * @returns
   */
  getInitialReferringDomain(): Nullable<string> {
    return this.storage?.get(persistedSessionStorageKeys.initialReferringDomain) || null;
  }

  /**
   * Reset state values
   * @param resetAnonymousId
   * @param noNewSessionStart
   * @returns
   */
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

  /**
   * Set user Id
   * @param userId
   */
  setUserId(userId?: Nullable<string>) {
    state.session.rl_user_id.value = userId;
  }

  /**
   * Set user traits
   * @param userId
   */
  setUserTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.rl_trait.value = mergeDeepRight(state.session.rl_trait.value || {}, traits);
    }
  }

  /**
   * Set group Id
   * @param userId
   */
  setGroupId(groupId?: Nullable<string>) {
    state.session.rl_group_id.value = groupId;
  }

  /**
   * Set group traits
   * @param userId
   */
  setGroupTraits(traits?: Nullable<ApiObject>) {
    if (traits) {
      state.session.rl_group_trait.value = mergeDeepRight(
        state.session.rl_group_trait.value || {},
        traits,
      );
    }
  }

  /**
   * Set initial referrer
   * @param userId
   */
  setInitialReferrer(referrer?: string) {
    state.session.rl_page_init_referrer.value = referrer;
  }

  /**
   * Set initial referring domain
   * @param userId
   */
  setInitialReferringDomain(referrer?: string) {
    state.session.rl_page_init_referring_domain.value = referrer;
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

  /**
   * Clear storage
   * @param resetAnonymousId
   */
  clearUserSessionStorage(resetAnonymousId?: boolean) {
    this.storage?.remove(persistedSessionStorageKeys.userId);
    this.storage?.remove(persistedSessionStorageKeys.userTraits);
    this.storage?.remove(persistedSessionStorageKeys.groupId);
    this.storage?.remove(persistedSessionStorageKeys.groupTraits);

    if (resetAnonymousId) {
      this.storage?.remove(persistedSessionStorageKeys.anonymousUserId);
    }
  }
}

const defaultUserSessionManager = new UserSessionManager();

export { UserSessionManager, defaultUserSessionManager };
