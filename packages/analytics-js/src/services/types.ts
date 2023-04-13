import { IErrorHandler } from './ErrorHandler/types';
import { ILogger } from './Logger/types';

export interface IService {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  onError: (error: Error | unknown, context?: string) => void;
}
