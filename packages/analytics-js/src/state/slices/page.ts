import { Signal, signal } from '@preact/signals-core';
import { getDefaultPageProperties } from '@rudderstack/analytics-js/components/utilities/page';
import { sessionState } from './session';

export type PagePropertiesState = {
  readonly path: Signal<string>;
  readonly referrer: Signal<string>;
  readonly referring_domain: Signal<string>;
  readonly search: Signal<string>;
  readonly title: Signal<string>;
  readonly url: Signal<string>;
  readonly tab_url: Signal<string>;
  readonly [index: string]: Signal<string | undefined>;
};

const defPageProperties = getDefaultPageProperties();
const pagePropertiesState: PagePropertiesState = {
  path: signal(defPageProperties.path),
  referrer: signal(defPageProperties.referrer),
  referring_domain: signal(defPageProperties.referring_domain),
  search: signal(defPageProperties.search),
  title: signal(defPageProperties.title),
  url: signal(defPageProperties.url),
  tab_url: signal(defPageProperties.tab_url),
};

export { pagePropertiesState };
