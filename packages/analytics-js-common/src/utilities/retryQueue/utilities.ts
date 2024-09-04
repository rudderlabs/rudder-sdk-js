import type { IStorage, IStore, IStoreManager } from '../../types/Store';
import type { QueueItem, QueueItemData } from './types';
import { RETRY_QUEUE_ENTRY_REMOVE_ERROR } from './logMessages';
import { ACK, QueueStatuses } from './constants';
import type { ILogger } from '../../types/Logger';
import { isDefined, isFunction } from '../checks';
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
  const maxAttempts = 2;
  const entry = QueueStatuses[entryIdx] as string;

  (globalThis as typeof window).setTimeout(() => {
    try {
      store.remove(entry);

      // clear the next entry
      if (entryIdx + 1 < QueueStatuses.length) {
        deleteStorageEntriesRecursively(store, entryIdx + 1, backoff, logger);
      }
    } catch (err) {
      const storageBusyErr = 'NS_ERROR_STORAGE_BUSY';
      const isLocalStorageBusy =
        (err as any).name === storageBusyErr ||
        (err as any).code === storageBusyErr ||
        (err as any).code === 0x80630001;

      if (isLocalStorageBusy && attempt < maxAttempts) {
        // Try clearing the same entry again with some extra delay
        deleteStorageEntriesRecursively(store, entryIdx, backoff + 40, logger, attempt + 1);
      } else {
        logger?.error(RETRY_QUEUE_ENTRY_REMOVE_ERROR(entry, attempt), err);
      }

      // clear the next entry after we've exhausted our attempts
      if (attempt === maxAttempts && entryIdx + 1 < QueueStatuses.length) {
        deleteStorageEntriesRecursively(store, entryIdx + 1, backoff, logger);
      }
    }
  }, backoff);
};

/**
 * Clears the queue entries
 * @param store Store to clear the queue entries
 * @param backoff Backoff time. Default is 1 to avoid NS_ERROR_STORAGE_BUSY error
 */
const clearQueueEntries = (store: IStore, logger?: ILogger, backoff: number = 1) => {
  // Start with the first entry
  deleteStorageEntriesRecursively(store, 0, backoff, logger);
};

const findOtherQueues = (
  storageEngine: IStorage,
  storeManager: IStoreManager,
  curName: string,
  curId: string,
): IStore[] => {
  const otherStores: IStore[] = [];
  let storageKeys = [];
  // 'keys' API is not supported by all the core SDK versions
  // Hence, we need this backward compatibility check
  if (isFunction(storageEngine.keys)) {
    storageKeys = storageEngine.keys();
  } else {
    for (let i = 0; i < storageEngine.length; i++) {
      const key = storageEngine.key(i);
      if (key) {
        storageKeys.push(key);
      }
    }
  }

  storageKeys.forEach((key: string) => {
    const keyParts: string[] = key ? key.split('.') : [];
    if (
      keyParts.length >= 3 &&
      keyParts[0] === curName && // match the current queue name
      keyParts[1] !== curId && // not the current queue
      keyParts[2] === ACK // find only the ACK key
    ) {
      otherStores.push(
        storeManager.setStore({
          id: keyParts[1] as string,
          name: curName,
          validKeys: QueueStatuses,
          type: LOCAL_STORAGE,
        }),
      );
    }
  });

  return otherStores;
};

const getOptionVal = (option: number | undefined, defaultVal: number, maxVal?: number): number => {
  if (isNumber(option)) {
    return isDefined(maxVal) ? Math.min(option, maxVal as number) : option;
  }
  return defaultVal;
};

export { sortByTime, clearQueueEntries, findOtherQueues, getOptionVal };
