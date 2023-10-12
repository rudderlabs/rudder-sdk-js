declare const setDefaultInstanceKey: (writeKey: string) => void,
  getAnalyticsInstance: (
    writeKey?: string | undefined,
  ) => import('./components/core/IAnalytics').IAnalytics,
  load: (
    writeKey: string,
    dataPlaneUrl: string,
    loadOptions?:
      | Partial<import('@rudderstack/analytics-js-common/types/LoadOptions').LoadOptions>
      | undefined,
  ) => void,
  ready: (callback: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback) => void,
  page: (
    category?:
      | string
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
        >
      | undefined,
    name?:
      | string
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
      | null
      | undefined,
    properties?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
      | null
      | undefined,
    options?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    callback?: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback | undefined,
  ) => void,
  track: (
    event: string,
    properties?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
        >
      | undefined,
    options?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    callback?: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback | undefined,
  ) => void,
  identify: (
    userId?:
      | string
      | number
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/traits').IdentifyTraits
        >
      | undefined,
    traits?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
      | import('@rudderstack/analytics-js-common/types/traits').IdentifyTraits
      | null
      | undefined,
    options?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    callback?: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback | undefined,
  ) => void,
  alias: (
    to?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<string>
      | undefined,
    from?:
      | string
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    options?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    callback?: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback | undefined,
  ) => void,
  group: (
    groupId:
      | string
      | number
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
        >,
    traits?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
      | null
      | undefined,
    options?:
      | import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback
      | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
          import('@rudderstack/analytics-js-common/types/EventApi').ApiOptions
        >
      | undefined,
    callback?: import('@rudderstack/analytics-js-common/types/EventApi').ApiCallback | undefined,
  ) => void,
  reset: (resetAnonymousId?: boolean | undefined) => void,
  getAnonymousId: (
    options?:
      | import('@rudderstack/analytics-js-common/types/LoadOptions').AnonymousIdOptions
      | undefined,
  ) => string | undefined,
  setAnonymousId: (
    anonymousId?: string | undefined,
    rudderAmpLinkerParam?: string | undefined,
  ) => void,
  getUserId: () =>
    | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<string>
    | undefined,
  getUserTraits: () =>
    | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
        import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
      >
    | undefined,
  getGroupId: () =>
    | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<string>
    | undefined,
  getGroupTraits: () =>
    | import('@rudderstack/analytics-js-common/types/Nullable').Nullable<
        import('@rudderstack/analytics-js-common/types/ApiObject').ApiObject
      >
    | undefined,
  startSession: (sessionId?: number | undefined) => void,
  endSession: () => void,
  getSessionId: () => import('@rudderstack/analytics-js-common/types/Nullable').Nullable<number>;
export {
  setDefaultInstanceKey,
  getAnalyticsInstance,
  load,
  ready,
  page,
  track,
  identify,
  alias,
  group,
  reset,
  getAnonymousId,
  setAnonymousId,
  getUserId,
  getUserTraits,
  getGroupId,
  getGroupTraits,
  startSession,
  endSession,
  getSessionId,
};
