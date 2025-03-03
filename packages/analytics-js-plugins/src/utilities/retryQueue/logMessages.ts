import { LOG_CONTEXT_SEPARATOR } from '../../shared-chunks/common';

const RETRY_QUEUE_PROCESS_ERROR = (context: string, errMsg: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}An unknown error occurred while processing the queue item. ${errMsg}`;

const RETRY_QUEUE_ENTRY_REMOVE_ERROR = (context: string, entry: string, attempt: number): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to remove local storage entry "${entry}" (attempt: ${attempt}.`;

export { RETRY_QUEUE_PROCESS_ERROR, RETRY_QUEUE_ENTRY_REMOVE_ERROR };
