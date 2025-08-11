export type LoggerProvider = Record<
  Exclude<Lowercase<LogLevel>, Lowercase<'NONE'>>,
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

export type LogLevel = 'LOG' | 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'NONE';

export type RSALogger = Pick<
  ILogger,
  'log' | 'info' | 'debug' | 'warn' | 'error' | 'setMinLogLevel'
>;
