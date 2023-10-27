import type { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';

export type LoggerProvider = Record<
  Exclude<Lowercase<LogLevel>, Lowercase<'NONE'>>,
  (...data: any[]) => void
>;
