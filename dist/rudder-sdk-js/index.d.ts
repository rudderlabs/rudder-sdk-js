declare module "rudder-sdk-js" {
  function load(writeKey: string, dataPlaneUrl: string, options?: any): any;

  function ready(callback: any): any;

  function page(
    category?: string,
    name?: string,
    properties?: any,
    options?: any,
    callback?: any
  ): any;

  function page(
    category: string,
    name: string,
    properties: any,
    callback: any
  ): any;

  function page(category: string, name: string, callback: any): any;

  function page(
    name: string,
    properties?: any,
    options?: any,
    callback?: any
  ): any;

  function page(name: string, properties: any, callback: any): any;

  function page(name: string, callback: any): any;

  function page(properties: any, options: any, callback?: any): any;

  function page(properties: any, callback?: any): any;

  function track(
    event: string,
    properties?: any,
    options?: any,
    callback?: any
  ): any;

  function track(event: string, properties: any, callback: any): any;

  function track(event: string, callback: any): any;

  function identify(
    id?: string,
    traits?: any,
    options?: any,
    callback?: any
  ): any;

  function identify(id: string, traits: any, callback: any): any;

  function identify(id: string, callback: any): any;

  function identify(traits: any, options: any, callback?: any): any;

  function identify(traits: any, callback?: any): any;

  function alias(to: string, from?: string, options?: any, callback?: any): any;

  function alias(to: string, from: string, callback: any): any;

  function alias(to: string, callback: any): any;

  function alias(to: string, options: any, callback?: any): any;

  function group(
    group: string,
    traits?: any,
    options?: any,
    callback?: any
  ): any;

  function group(group: string, traits: any, callback: any): any;

  function group(group: string, callback: any): any;

  function group(traits: any, options: any, callback?: any): any;

  function group(traits: any, callback?: any): any;

  function getAnonymousId(): any;

  function setAnonymousId(id?: string): any;

  function reset(): any;

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
