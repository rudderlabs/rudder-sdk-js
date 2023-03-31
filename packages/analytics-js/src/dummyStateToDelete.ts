import { signal } from '@preact/signals-core';

export const dummyState = {
  globalLocalState: signal({
    counter: 0,
  }),
  remoteState: signal({
    counter: 0,
  }),
  successfullyLoadedIntegration: signal([]),
  failedToBeLoadedIntegration: signal([]),
  dynamicallyLoadedIntegrations: signal({}),
  config: signal({}),
};
