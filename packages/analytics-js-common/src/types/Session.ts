export type SessionInfo = {
  autoTrack?: boolean;
  manualTrack?: boolean;
  timeout?: number;
  expiresAt?: number;
  id?: number;
  sessionStart?: boolean;
  cutOff?: {
    enabled?: boolean;
    duration?: number;
    expiresAt?: number;
  };
};
