/**
 * Represents the status of the application lifecycle
 */
export type LifecycleStatus =
  | 'mounted'
  | 'browserCapabilitiesReady'
  | 'configured'
  | 'pluginsLoading'
  | 'pluginsReady'
  | 'initialized'
  | 'loaded'
  | 'destinationsLoading'
  | 'destinationsReady'
  | 'ready'
  | 'readyExecuted';
