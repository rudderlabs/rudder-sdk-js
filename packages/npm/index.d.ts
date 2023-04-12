declare module 'rudder-sdk-js' {
  /**
   * Represents the integration options object
   * Example usages:
   * integrationOptions { All: false, "Google Analytics": true, "Braze": true}
   * integrationOptions { All: true, "Chartbeat": false, "Customer.io": false}
   */
  interface integrationOptions {
    // Defaults to true
    // If set to false, specific integration should be set to true to send the event
    All?: boolean;
    // Destination name: true/false/integration specific information
    [index: string]: boolean | undefined | apiObject;
  }

  /**
   * Represents the queue options parameter in loadOptions type
   */
  interface queueOptions {
    // Upper cap on maximum delay for an event
    maxRetryDelay?: number;
    // Minimum delay before sending an event
    minRetryDelay?: number;
    // Exponential base
    backoffFactor?: number;
    // Maximum number of attempts
    maxAttempts?: number;
    // Maximum number of events in storage
    maxItems?: number;
  }

  /**
   * Represents the beacon queue options parameter in loadOptions type
   */
  interface beaconQueueOptions {
    // Maximum number of events in storage
    maxItems?: number;
    // Time in milliseconds to flush the queue autometically
    flushQueueInterval?: number;
  }

  /**
   * Represents the beacon queue options parameter in loadOptions type
   */
  interface cookieConsentManager {
    // OneTrust
    oneTrust?: {
      enabled: boolean;
    };
  }

  /**
   * Represents the options parameter for anonymousId
   */
  interface anonymousIdOptions {
    autoCapture?: {
      enabled?: boolean;
      source?: string;
    };
  }

  /**
   * Represents residency server input the options
   */
  enum RESIDENCY_SERVER {
    US = 'US',
    EU = 'EU',
  }

  /**
   * Represents the options parameter in the load API
   */
  interface loadOptions {
    integrations?: integrationOptions;
    // defaults to https://api.rudderlabs.com
    configUrl?: string;
    queueOptions?: queueOptions;
    // Defaults to true
    loadIntegration?: boolean;
    lockIntegrationsVersion?: boolean;
    // Defaults to false
    secureCookie?: boolean;
    // Defaults to "Lax" (see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
    sameSiteCookie?: string;
    logLevel?: string;
    getSourceConfig?: () => string | apiObject | Promise<apiObject> | Promise<string>;
    setCookieDomain?: string;
    sendAdblockPage?: boolean;
    sendAdblockPageOptions?: apiOptions;
    clientSuppliedCallbacks?: { string: () => void };
    useBeacon?: boolean; // Defaults to false
    beaconQueueOptions?: beaconQueueOptions;
    cookieConsentManager?: cookieConsentManager;
    anonymousIdOptions?: anonymousIdOptions;
    // defaults to https://cdn.rudderlabs.com/v1.1/js-integrations
    destSDKBaseURL?: string;
    sessions?: {
      autoTrack?: boolean; // Defaults to true
      timeout?: number; // Defaults to 30 mins
    };
    residencyServer?: RESIDENCY_SERVER;
    // Controls whether the SDK should polyfill unsupported browser API's if they are detected as missing
    // Defaults to true
    polyfillIfRequired?: boolean;
    uaChTrackLevel?: 'none' | 'default' | 'full';
    onLoaded?: (analytics: any) => void;
  }

  /**
   * Represents the options parameter in the APIs
   */
  interface apiOptions {
    integrations?: integrationOptions;
    anonymousId?: string;
    // ISO 8601 date string
    originalTimestamp?: string;
    // Merged with event's contextual information
    [index: string]:
      | string
      | number
      | boolean
      | apiObject
      | (string | number | boolean | apiObject)[]
      | integrationOptions
      | undefined;
  }

  /**
   * Represents a generic object in the APIs
   * Use for parameters like properties, traits etc.
   */
  interface apiObject {
    [index: string]:
      | string
      | number
      | boolean
      | apiObject
      | (string | number | boolean | apiObject)[]
      | undefined;
  }

  /**
   * Represents the callback in the APIs
   */
  type apiCallback = () => void;

  /**
   * Call control pane to get client configs
   * @param writeKey
   * @param dataPlaneUrl
   * @param options
   */
  function load(writeKey: string, dataPlaneUrl: string, options?: loadOptions): void;

  /**
   * To register a callback for SDK ready state
   * @param callback
   */
  function ready(callback: apiCallback): void;

  /**
   * To record a page view event
   * @param category
   * @param name
   * @param properties
   * @param options
   * @param callback
   */
  function page(
    category?: string,
    name?: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback,
  ): void;

  /**
   * To record a page view event
   * @param category
   * @param name
   * @param properties
   * @param callback
   */
  function page(category: string, name: string, properties: apiObject, callback: apiCallback): void;

  /**
   * To record a page view event
   * @param category
   * @param name
   * @param callback
   */
  function page(category: string, name: string, callback: apiCallback): void;

  /**
   * To record a page view event
   * @param name
   * @param properties
   * @param options
   * @param callback
   */
  function page(
    name: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback,
  ): void;

  /**
   * To record a page view event
   * @param name
   * @param properties
   * @param callback
   */
  function page(name: string, properties: apiObject, callback: apiCallback): void;

  /**
   *
   * @param name
   * @param callback
   */
  function page(name: string, callback: apiCallback): void;

  /**
   *
   * @param properties
   * @param options
   * @param callback
   */
  function page(properties: apiObject, options: apiOptions, callback?: apiCallback): void;

  /**
   * To record a page view event
   * @param properties
   * @param callback
   */
  function page(properties: apiObject, callback?: apiCallback): void;

  /**
   * To record a user track event
   * @param event
   * @param properties
   * @param options
   * @param callback
   */
  function track(
    event: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback,
  ): void;

  /**
   * To record a user track event
   * @param event
   * @param properties
   * @param callback
   */
  function track(event: string, properties: apiObject, callback: apiCallback): void;

  /**
   * To record a user track event
   * @param event
   * @param callback
   */
  function track(event: string, callback: apiCallback): void;

  /**
   * To record a user identification event
   * @param userId
   * @param traits
   * @param options
   * @param callback
   */
  function identify(
    userId?: string,
    traits?: apiObject,
    options?: apiOptions,
    callback?: apiCallback,
  ): void;

  /**
   * To record a user identification event
   * @param userId
   * @param traits
   * @param callback
   */
  function identify(userId: string, traits: apiObject, callback: apiCallback): void;

  /**
   * To record a user identification event
   * @param userId
   * @param callback
   */
  function identify(userId: string, callback: apiCallback): void;

  /**
   *
   * @param traits
   * @param options
   * @param callback
   */
  function identify(traits: apiObject, options: apiOptions, callback?: apiCallback): void;

  /**
   *
   * @param traits
   * @param callback
   */
  function identify(traits: apiObject, callback?: apiCallback): void;

  /**
   * To record a user alias event
   * @param to
   * @param from
   * @param options
   * @param callback
   */
  function alias(to: string, from?: string, options?: apiOptions, callback?: apiCallback): void;

  /**
   * To record a user alias event
   * @param to
   * @param from
   * @param callback
   */
  function alias(to: string, from: string, callback: apiCallback): void;

  /**
   * To record a user alias event
   * @param to
   * @param callback
   */
  function alias(to: string, callback: apiCallback): void;

  /**
   * To record a user alias event
   * @param to
   * @param options
   * @param callback
   */
  function alias(to: string, options: apiOptions, callback?: apiCallback): void;

  /**
   * To record a user group event
   * @param groupId
   * @param traits
   * @param options
   * @param callback
   */
  function group(
    groupId: string,
    traits?: apiObject,
    options?: apiOptions,
    callback?: apiCallback,
  ): void;

  /**
   * To record a user group event
   * @param groupId
   * @param traits
   * @param callback
   */
  function group(groupId: string, traits: apiObject, callback: apiCallback): void;

  /**
   * To record a user group event
   * @param groupId
   * @param callback
   */
  function group(groupId: string, callback: apiCallback): void;

  /**
   * To record a user group event
   * @param traits
   * @param options
   * @param callback
   */
  function group(traits: apiObject, options: apiOptions, callback?: apiCallback): void;

  /**
   * To record a user group event
   * @param traits
   * @param callback
   */
  function group(traits: apiObject, callback?: apiCallback): void;

  /**
   * To get anonymousId set in the SDK
   */
  function getAnonymousId(options?: anonymousIdOptions): string;

  /**
   * To set anonymousId
   * @param anonymousId
   * @param rudderAmpLinkerParm AMP Linker ID string
   */
  function setAnonymousId(anonymousId?: string, rudderAmpLinkerParm?: string): void;

  /**
   * Clear user information
   * @param flag If true, clears anonymousId as well
   */
  function reset(flag?: boolean): void;

  /**
   * To get userId set in the SDK
   */
  function getUserId(): string;

  /**
   * To get user traits set in the SDK
   */
  function getUserTraits(): apiObject;

  /**
   * To get groupId set in the SDK
   */
  function getGroupId(): string;

  /**
   * To get group traits set in the SDK
   */
  function getGroupTraits(): apiObject;

  /**
   * To manually start user session in the SDK
   */
  function startSession(sessionId?: number): void;

  /**
   * To manually end user session in the SDK
   */
  function endSession(): void;

  /**
   * To fetch the current sessionId
   */
  function getSessionId(): number | null;

  export {
    integrationOptions,
    loadOptions,
    apiOptions,
    queueOptions,
    apiObject,
    apiCallback,
    anonymousIdOptions,
    load,
    ready,
    reset,
    page,
    track,
    identify,
    alias,
    group,
    setAnonymousId,
    getAnonymousId,
    getUserId,
    getUserTraits,
    getGroupId,
    getGroupTraits,
    startSession,
    endSession,
    RESIDENCY_SERVER,
    getSessionId,
  };
}
