import { RegionDetails, ResidencyServerRegion } from '@rudderstack/common/types/DataResidency';

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
};
