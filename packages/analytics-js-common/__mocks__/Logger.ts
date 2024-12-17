import type { ILogger } from '../src/types/Logger';

class Logger implements ILogger {
  warn = jest.fn();
  log = jest.fn();
  error = jest.fn();
  info = jest.fn();
  debug = jest.fn();
  minLogLevel = 0;
  scope = 'test scope';
  setMinLogLevel = jest.fn();
  setScope = jest.fn();
  logProvider = console;
}

const defaultLogger = new Logger();

export { Logger, defaultLogger };
