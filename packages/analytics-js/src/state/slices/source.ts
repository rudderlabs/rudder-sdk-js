import { signal, Signal } from '@preact/signals-core';
import { ResidencyServerRegion } from '@rudderstack/analytics-js/components/core/IAnalytics';

export type Source = {
  id: string;
  name: string;
  writeKey: string;
  workspaceId: string;
  enabled: boolean;
  updatedAt: string; // TODO: do we use it at all?
  dataplanes: Record<ResidencyServerRegion, RegionDetails>;
};

export type RegionDetails = {
  url: string;
  default: boolean;
};

export type SourceConfigState = Signal<Source | undefined>;

const sourceConfigState: SourceConfigState = signal(undefined);

export { sourceConfigState };
