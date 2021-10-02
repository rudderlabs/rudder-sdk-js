declare module "rudder-sdk-js" {
  function load(writeKey: string, dataPlaneUrl: string, options?: object): void;

  function ready(callback: () => void): void;

  function page(
    category?: string,
    name?: string,
    properties?: object,
    options?: object,
    callback?: () => void
  ): void;

  function page(
    category: string,
    name: string,
    properties: object,
    callback: () => void
  ): void;

  function page(category: string, name: string, callback: () => void): void;

  function page(
    name: string,
    properties?: object,
    options?: object,
    callback?: () => void
  ): void;

  function page(name: string, properties: object, callback: () => void): void;

  function page(name: string, callback: () => void): void;

  function page(
    properties: object,
    options: object,
    callback?: () => void
  ): void;

  function page(properties: object, callback?: () => void): void;

  function track(
    event: string,
    properties?: object,
    options?: object,
    callback?: () => void
  ): void;

  function track(event: string, properties: object, callback: () => void): void;

  function track(event: string, callback: () => void): void;

  function identify(
    userId?: string,
    traits?: object,
    options?: object,
    callback?: () => void
  ): void;

  function identify(userId: string, traits: object, callback: () => void): void;

  function identify(userId: string, callback: () => void): void;

  function identify(
    traits: object,
    options: object,
    callback?: () => void
  ): void;

  function identify(traits: object, callback?: () => void): void;

  function alias(
    to: string,
    from?: string,
    options?: object,
    callback?: () => void
  ): void;

  function alias(to: string, from: string, callback: () => void): void;

  function alias(to: string, callback: () => void): void;

  function alias(to: string, options: object, callback?: () => void): void;

  function group(
    groupId: string,
    traits?: object,
    options?: object,
    callback?: () => void
  ): void;

  function group(groupId: string, traits: object, callback: () => void): void;

  function group(groupId: string, callback: () => void): void;

  function group(traits: object, options: object, callback?: () => void): void;

  function group(traits: object, callback?: () => void): void;

  function getAnonymousId(): any;

  function setAnonymousId(id?: string): void;

  function reset(): void;

  export {
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
