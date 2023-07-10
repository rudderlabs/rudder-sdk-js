import { Signal, signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';

export type StorageState = {
  encryptionPluginName: Signal<PluginName | undefined>;
  migrate: Signal<boolean>;
};

const storageState: StorageState = {
  encryptionPluginName: signal(undefined),
  migrate: signal(false),
};

export { storageState };
