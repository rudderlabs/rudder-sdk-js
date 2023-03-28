import { signal, Signal } from '@preact/signals-core';
import {
  RegionDetails,
  ResidencyServerRegion,
} from '@rudderstack/analytics-js/components/configManager/types';

export type Source = {
  id: string;
  name: string;
  writeKey: string;
  workspaceId: string;
  enabled: boolean;
  dataplanes: Record<ResidencyServerRegion, RegionDetails>;
};

export type SourceConfigState = Signal<Source | undefined>;

const sourceConfigState: SourceConfigState = signal(undefined);

export { sourceConfigState };
