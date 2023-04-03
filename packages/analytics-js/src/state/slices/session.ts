import { signal, Signal } from '@preact/signals-core';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { ApiObject, SessionInfo } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

export type SessionState = {
  rl_user_id: Signal<Nullable<string> | undefined>;
  rl_trait: Signal<Nullable<ApiObject> | undefined>;
  rl_anonymous_id: Signal<string | undefined>;
  rl_group_id: Signal<Nullable<string> | undefined>;
  rl_group_trait: Signal<Nullable<ApiObject> | undefined>;
  rl_page_init_referrer: Signal<string | undefined>;
  rl_page_init_referring_domain: Signal<string | undefined>;
  rl_session: Signal<SessionInfo>;
};

const defaultSessionInfo = {
  autoTrack: true,
  timeout: DEFAULT_SESSION_TIMEOUT,
};

const sessionState: SessionState = {
  rl_user_id: signal(undefined),
  rl_trait: signal(undefined),
  rl_anonymous_id: signal(undefined),
  rl_group_id: signal(undefined),
  rl_group_trait: signal(undefined),
  rl_page_init_referrer: signal(undefined),
  rl_page_init_referring_domain: signal(undefined),
  rl_session: signal({ ...defaultSessionInfo }),
};

export { sessionState, defaultSessionInfo };
