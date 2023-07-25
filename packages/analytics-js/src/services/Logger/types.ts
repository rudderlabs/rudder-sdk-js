import { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';

export type LoggerProvider = Record<
  Exclude<Lowercase<LogLevel>, Lowercase<LogLevel.None>>,
  (...data: any[]) => void
>;
