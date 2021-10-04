declare module "rudder-sdk-js" {
  interface integrationOptions {
    All?: boolean; // default true
    [index: string]: boolean | undefined;
  }

  interface queueOptions {
    maxRetryDelay?: number; // Upper cap on maximum delay for an event
    minRetryDelay?: number; // minimum delay before sending an event
    backoffFactor?: number; // exponential base
    maxAttempts?: number; // max attempts
    maxItems?: number; // max number of events in storage
  }

  interface loadOptions {
    integrations?: integrationOptions;
    configUrl?: string; // defaults to https://api.rudderlabs.com
    queueOptions?: queueOptions;
    loadIntegration?: boolean; // defaults to true.
  }

  interface apiOptions {
    integrations?: integrationOptions;
    anonymousId?: string;
    originalTimestamp?: string;
    [index: string]:
      | string
      | number
      | apiObject
      | integrationOptions
      | undefined;
  }

  interface apiObject {
    [index: string]: string | number | apiObject;
  }

  function load(
    writeKey: string,
    dataPlaneUrl: string,
    options?: loadOptions
  ): void;

  type apiCallback = () => void;

  function ready(callback: apiCallback): void;

  function page(
    category?: string,
    name?: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function page(
    category: string,
    name: string,
    properties: apiObject,
    callback: apiCallback
  ): void;

  function page(category: string, name: string, callback: apiCallback): void;

  function page(
    name: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function page(
    name: string,
    properties: apiObject,
    callback: apiCallback
  ): void;

  function page(name: string, callback: apiCallback): void;

  function page(
    properties: apiObject,
    options: apiOptions,
    callback?: apiCallback
  ): void;

  function page(properties: apiObject, callback?: apiCallback): void;

  function track(
    event: string,
    properties?: apiObject,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function track(
    event: string,
    properties: apiObject,
    callback: apiCallback
  ): void;

  function track(event: string, callback: apiCallback): void;

  function identify(
    userId?: string,
    traits?: apiObject,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function identify(
    userId: string,
    traits: apiObject,
    callback: apiCallback
  ): void;

  function identify(userId: string, callback: apiCallback): void;

  function identify(
    traits: apiObject,
    options: apiOptions,
    callback?: apiCallback
  ): void;

  function identify(traits: apiObject, callback?: apiCallback): void;

  function alias(
    to: string,
    from?: string,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function alias(to: string, from: string, callback: apiCallback): void;

  function alias(to: string, callback: apiCallback): void;

  function alias(to: string, options: apiOptions, callback?: apiCallback): void;

  function group(
    groupId: string,
    traits?: apiObject,
    options?: apiOptions,
    callback?: apiCallback
  ): void;

  function group(
    groupId: string,
    traits: apiObject,
    callback: apiCallback
  ): void;

  function group(groupId: string, callback: apiCallback): void;

  function group(
    traits: apiObject,
    options: apiOptions,
    callback?: apiCallback
  ): void;

  function group(traits: apiObject, callback?: apiCallback): void;

  function getAnonymousId(): string;

  function setAnonymousId(id?: string): void;

  function reset(flag?: boolean): void;

  export {
    integrationOptions,
    loadOptions,
    apiOptions,
    queueOptions,
    apiObject,
    apiCallback,
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
  };
}
