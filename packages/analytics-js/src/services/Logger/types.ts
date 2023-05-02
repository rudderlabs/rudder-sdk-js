import { LogLevel } from '@rudderstack/analytics-js/state/types';

export type LoggerProvider = Record<
  Exclude<Lowercase<LogLevel>, Lowercase<LogLevel.None>>,
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
  setMinLogLevel(logLevel: LogLevel): void;
}
