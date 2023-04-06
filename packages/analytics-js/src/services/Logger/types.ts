export type LoggerLevel = 'log' | 'info' | 'debug' | 'warn' | 'error' | 'none';
export type LoggerProvider = Record<
  'log' | 'info' | 'debug' | 'warn' | 'error',
  (...data: any[]) => void
>;

export interface ILogger {
  minLogLevel: number;
  scope?: string;
  logProvider: LoggerProvider;
  log(...data: any[]): void;
  info(...data: any[]): void;
  debug(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  setScope(scopeVal: string): void;
  setMinLogLevel(logLevel: LoggerLevel): void;
}
