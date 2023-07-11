import { signal } from '@preact/signals-core';
import { PagePropertiesState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const pagePropertiesState: PagePropertiesState = {
  path: signal(''),
  referrer: signal(''),
  referring_domain: signal(''),
  search: signal(''),
  title: signal(''),
  url: signal(''),
  tab_url: signal(''),
};

export { pagePropertiesState };
