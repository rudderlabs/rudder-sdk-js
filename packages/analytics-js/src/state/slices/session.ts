import { signal, Signal } from '@preact/signals-core';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { ApiObject, SessionInfo } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';

export type SessionState = {
  readonly userId: Signal<Nullable<string> | undefined>;
  readonly userTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly anonymousUserId: Signal<string | undefined>;
  readonly groupId: Signal<Nullable<string> | undefined>;
  readonly groupTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly initialReferrer: Signal<string | undefined>;
  readonly initialReferringDomain: Signal<string | undefined>;
  readonly sessionInfo: Signal<SessionInfo>;
};

const defaultSessionInfo = {
  autoTrack: true,
  timeout: DEFAULT_SESSION_TIMEOUT,
};

const sessionState: SessionState = {
  userId: signal(undefined),
  userTraits: signal(undefined),
  anonymousUserId: signal(undefined),
  groupId: signal(undefined),
  groupTraits: signal(undefined),
  initialReferrer: signal(undefined),
  initialReferringDomain: signal(undefined),
  sessionInfo: signal({ ...defaultSessionInfo }),
};

export { sessionState, defaultSessionInfo };
