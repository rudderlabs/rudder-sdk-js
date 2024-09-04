import type { IStorage, IStore, IStoreManager } from '../../types/Store';
import type { QueueItem, QueueItemData } from './types';
import { RETRY_QUEUE_ENTRY_REMOVE_ERROR } from './logMessages';
import {
  ACK,
  MAX_ATTEMPTS_ENTRY_DELETION,
  QueueStatuses,
  RETRY_DELAY_ENTRY_DELETION,
} from './constants';
import type { ILogger } from '../../types/Logger';
import { isDefined } from '../checks';
import { LOCAL_STORAGE } from '../../constants/storages';
import { isNumber } from '../number';

const sortByTime = (a: QueueItem<QueueItemData>, b: QueueItem<QueueItemData>) => a.time - b.time;

const deleteStorageEntriesRecursively = (
  store: IStore,
  entryIdx: number,
  backoff: number,
  logger?: ILogger,
  attempt = 1,
) => {
  const entry = QueueStatuses[entryIdx] as string;
  const nextEntryIdx = entryIdx + 1;

  (globalThis as typeof window).setTimeout(() => {
    try {
      store.remove(entry);
    } catch (err) {
      const storageBusyErr = 'NS_ERROR_STORAGE_BUSY';
      const isLocalStorageBusy =
        (err as any).name === storageBusyErr ||
        (err as any).code === storageBusyErr ||
        (err as any).code === 0x80630001;

      if (isLocalStorageBusy && attempt < MAX_ATTEMPTS_ENTRY_DELETION) {
        // Try clearing the same entry again with some extra delay
        deleteStorageEntriesRecursively(
          store,
          entryIdx,
          backoff + RETRY_DELAY_ENTRY_DELETION,
          logger,
          attempt + 1,
        );
        return;
      }
      logger?.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(entry, attempt), err);
    } finally {
      // clear the next entry
      if (nextEntryIdx < QueueStatuses.length) {
        deleteStorageEntriesRecursively(store, nextEntryIdx, backoff, logger);
      }
    }
  }, backoff);
};

/**
 * Clears the queue entries
 * @param store Store to clear the queue entries
 * @param backoff Backoff time. Default is 1 to avoid NS_ERROR_STORAGE_BUSY error
 */
const clearQueueEntries = (store: IStore, logger?: ILogger, backoff: number = 1) =>
  deleteStorageEntriesRecursively(store, 0, backoff, logger);

const findOtherQueues = (
  storageEngine: IStorage,
  storeManager: IStoreManager,
  curName: string,
  curId: string,
): IStore[] =>
  storageEngine
    .keys()
    .filter((key: string) => {
      const keyParts: string[] = key ? key.split('.') : [];
      // Format of the ACK entry is: queueName.queueId.ack
      return (
        keyParts.length >= 3 &&
        keyParts[0] === curName && // match the current queue name
        keyParts[1] !== curId && // not the current queue
        keyParts[2] === ACK // find only the ACK key
      );
    })
    .map((key: string) => {
      const keyParts: string[] = key ? key.split('.') : [];
      return storeManager.setStore({
        id: keyParts[1] as string,
        name: curName,
        validKeys: QueueStatuses,
        type: LOCAL_STORAGE,
      });
    });

const getNumberOptionVal = (
  option: any,
  defaultVal: number,
  minVal?: number,
  maxVal?: number,
): number => {
  if (isNumber(option)) {
    const val = isDefined(minVal) ? Math.max(option, minVal as number) : option;
    return isDefined(maxVal) ? Math.min(val, maxVal as number) : val;
  }
  return defaultVal;
};

export { sortByTime, clearQueueEntries, findOtherQueues, getNumberOptionVal };
