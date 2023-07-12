import { Signal, signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { ConsentInfo } from '../types';

export type ConsentsState = {
  data: Signal<ConsentInfo>;
  activeConsentManagerPluginName: Signal<PluginName | undefined>;
};

const consentsState: ConsentsState = {
  data: signal({ initialized: false }),
  activeConsentManagerPluginName: signal(undefined),
};

export { consentsState };
