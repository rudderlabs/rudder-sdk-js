declare const RETRY_QUEUE_PROCESS_ERROR: (context: string) => string;
declare const RETRY_QUEUE_ENTRY_REMOVE_ERROR: (
  context: string,
  entry: string,
  attempt: number,
) => string;
export { RETRY_QUEUE_PROCESS_ERROR, RETRY_QUEUE_ENTRY_REMOVE_ERROR };
