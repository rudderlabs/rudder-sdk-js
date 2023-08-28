import { Storage } from '@rudderstack/analytics-js-common/utilsV1/storage';

const defaults = {
  lotame_synch_time_key: 'lt_synch_timestamp',
};

class LotameStorage {
  constructor() {
    this.storage = Storage;
  }

  setLotameSynchTime(value) {
    this.storage.setItem(defaults.lotame_synch_time_key, value);
  }

  getLotameSynchTime() {
    return this.storage.getItem(defaults.lotame_synch_time_key);
  }
}
const lotameStorage = new LotameStorage();
export { lotameStorage as LotameStorage };
