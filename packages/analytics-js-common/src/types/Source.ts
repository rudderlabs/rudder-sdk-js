import type { RegionDetails, ResidencyServerRegion } from './DataResidency';

export type StatsCollection = {
  errors: {
    enabled: boolean;
    provider?: string;
  };
  metrics: {
    enabled: boolean;
  };
};

export type SourceConfig = {
  statsCollection?: StatsCollection;
};

export type Source = {
  id: string;
  config?: SourceConfig;
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>;
  workspaceId: string;
};
