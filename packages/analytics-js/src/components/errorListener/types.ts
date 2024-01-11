export interface IErrorListener {
  attachErrorListeners(): void;
}

export type ErrorMetaData = {
  isBluebird?: boolean;
  originalError?: unknown;
  url?: string;
  lineNo?: number;
  charNo?: number;
};

export type JqueryErrorEvent = {
  type?: string;
  message?: string;
  detail?: string;
};
