import { Signal, signal } from '@preact/signals-core';
import { getDefaultPageProperties } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';

export type PagePropertiesState = {
  path: Signal<string>;
  referrer: Signal<string>;
  referring_domain: Signal<string>;
  search: Signal<string>;
  title: Signal<string>;
  url: Signal<string>;
  tab_url: Signal<string>;
};

const defPageProperties = getDefaultPageProperties();
const pageParametersState: PagePropertiesState = {
  path: signal(defPageProperties.path),
  referrer: signal(defPageProperties.referrer),
  referring_domain: signal(defPageProperties.referring_domain),
  search: signal(defPageProperties.search),
  title: signal(defPageProperties.title),
  url: signal(defPageProperties.url),
  tab_url: signal(defPageProperties.tab_url),
};

export { pageParametersState };
