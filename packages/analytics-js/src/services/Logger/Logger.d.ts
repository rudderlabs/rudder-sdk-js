import { ILogger, LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import { LoggerProvider } from './types';
declare const LOG_LEVEL_MAP: Record<LogLevel, number>;
declare const DEFAULT_LOG_LEVEL = 'ERROR';
declare const LOG_MSG_PREFIX = 'RS SDK';
declare const LOG_MSG_PREFIX_STYLE = 'font-weight: bold; background: black; color: white;';
declare const LOG_MSG_STYLE = 'font-weight: normal;';
/**
 * Service to log messages/data to output provider, default is console
 */
declare class Logger implements ILogger {
  minLogLevel: number;
  scope?: string;
  logProvider: LoggerProvider;
  constructor(minLogLevel?: LogLevel, scope?: string, logProvider?: Console);
  log(...data: any[]): void;
  info(...data: any[]): void;
  debug(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  outputLog(logMethod: LogLevel, data: any[]): void;
  setScope(scopeVal: string): void;
  setMinLogLevel(logLevel: LogLevel): void;
  /**
   * Formats the console message using `scope` and styles
   */
  formatLogData(data: any[]): any[];
}
declare const defaultLogger: Logger;
export {
  Logger,
  DEFAULT_LOG_LEVEL,
  LOG_LEVEL_MAP,
  LOG_MSG_PREFIX,
  LOG_MSG_PREFIX_STYLE,
  LOG_MSG_STYLE,
  defaultLogger,
};
