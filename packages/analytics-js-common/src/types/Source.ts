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
  workspaceId: string;
};
