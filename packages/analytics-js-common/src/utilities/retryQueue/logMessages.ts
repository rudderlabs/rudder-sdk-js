import { LOG_CONTEXT_SEPARATOR } from '../../constants/logMessages';

const RETRY_QUEUE_PROCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Process function threw an error.`;

const RETRY_QUEUE_ENTRY_REMOVE_ERROR = (
  context: string,
  entry: string,
  attempt: number = 1,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to remove local storage entry "${entry}" (attempt: ${attempt}.`;

export { RETRY_QUEUE_PROCESS_ERROR, RETRY_QUEUE_ENTRY_REMOVE_ERROR };
