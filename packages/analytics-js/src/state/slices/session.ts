import { signal, Signal } from '@preact/signals-core';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';

export type ApiObject = {
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | (string | number | boolean | ApiObject)[]
    | undefined;
};

export type SessionInfo = {
  autoTrack?: boolean;
  manualTrack?: boolean;
  timeout: number;
  expiresAt?: number;
  id?: number;
  sessionStart?: boolean;
};

export type SessionState = {
  rl_user_id: Signal<string | undefined>;
  rl_trait: Signal<ApiObject | undefined>;
  rl_anonymous_id: Signal<string | undefined>;
  rl_group_id: Signal<string | undefined>;
  rl_group_trait: Signal<ApiObject | undefined>;
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
