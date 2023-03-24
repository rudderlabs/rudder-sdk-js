import { signal, Signal } from '@preact/signals-core';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';

export type SessionInfo = {
  autoTrack?: boolean;
  manualTrack?: boolean;
  timeout: number;
  expiresAt?: number;
  id?: number;
  sessionStart?: boolean;
};

// TODO: fix types and default values
export type SessionState = {
  sessionId: Signal<string | undefined>;
  rl_user_id: Signal<string | undefined>;
  rl_trait: Signal<string | undefined>;
  user_storage_anonymousId: Signal<string | undefined>;
  group_storage_key: Signal<string | undefined>;
  group_storage_trait: Signal<string | undefined>;
  page_storage_init_referrer: Signal<string | undefined>;
  page_storage_init_referring_domain: Signal<string | undefined>;
  sessionInfo: Signal<SessionInfo>;
};

const sessionState: SessionState = {
  sessionId: signal(undefined),
  rl_user_id: signal(undefined),
  rl_trait: signal(undefined),
  user_storage_anonymousId: signal(undefined),
  group_storage_key: signal(undefined),
  group_storage_trait: signal(undefined),
  page_storage_init_referrer: signal(undefined),
  page_storage_init_referring_domain: signal(undefined),
  sessionInfo: signal({
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT,
  }),
};

export { sessionState };
