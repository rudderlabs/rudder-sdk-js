import { LogLevel } from '@rudderstack/common/types/Logger';

export type LoggerProvider = Record<
  Exclude<Lowercase<LogLevel>, Lowercase<LogLevel.None>>,
  (...data: any[]) => void
>;
