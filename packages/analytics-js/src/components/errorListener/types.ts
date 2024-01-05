export interface IErrorListener {
  attachErrorListeners(): void;
}

export type ErrorState = {
  severity: string;
  unhandled: boolean;
  severityReason: {
    type: string;
  };
  isBluebird?: boolean;
  originalError?: unknown;
};

export type JqueryErrorEvent = {
  type?: string;
  message?: string;
  detail?: string;
};
