import { LOG_CONTEXT_SEPARATOR } from '../../constants/logMessages';
import { RETRY_QUEUE } from './constants';

const RETRY_QUEUE_PROCESS_ERROR = `${RETRY_QUEUE}${LOG_CONTEXT_SEPARATOR}Process function threw an error.`;

const RETRY_QUEUE_ENTRY_REMOVE_ERROR = (entry: string, attempt: number = 1): string =>
  `${RETRY_QUEUE}${LOG_CONTEXT_SEPARATOR}Failed to remove local storage entry "${entry}" (attempt: ${attempt}).`;

export { RETRY_QUEUE_PROCESS_ERROR, RETRY_QUEUE_ENTRY_REMOVE_ERROR };
