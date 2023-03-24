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

const setExposedGlobal = (keyName: string, value?: any) => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as any;
  }

  (window as any).RudderStackGlobals[keyName] = value;
};

export { globalLocalState, remoteState, setExposedGlobal, state };
