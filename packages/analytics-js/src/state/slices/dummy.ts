import { signal } from '@preact/signals-core';

const dummyState = {
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

export { dummyState };
