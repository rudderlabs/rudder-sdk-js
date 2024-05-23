import { signal } from '@preact/signals-core';
import type { ServerCookiesState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const serverSideCookiesState: ServerCookiesState = {
  isEnabledServerSideCookies: signal(false),
  dataServiceUrl: signal(undefined),
};

export { serverSideCookiesState };
