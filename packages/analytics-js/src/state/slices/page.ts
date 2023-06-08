import { Signal, signal } from '@preact/signals-core';

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
