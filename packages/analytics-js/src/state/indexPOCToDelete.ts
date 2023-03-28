import { signal } from '@preact/signals-core';

const defaultState = {
  counter: 0,
};

const globalLocalState = signal({ ...defaultState });
const remoteState = signal({ ...defaultState });

const successfullyLoadedIntegration = signal([]);
const failedToBeLoadedIntegration = signal([]);
const dynamicallyLoadedIntegrations = signal({} as any);
const config = signal({} as any);

const state = {
  globalLocalState,
  remoteState,
  successfullyLoadedIntegration,
  failedToBeLoadedIntegration,
  dynamicallyLoadedIntegrations,
  config,
};

export { globalLocalState, remoteState, state };
