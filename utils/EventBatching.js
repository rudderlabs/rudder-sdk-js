import { Store } from "./storage/store";
// Event Batching class
class EventBatching {

    constructor(batchFactor,keysPrefix){
        this.batchFactor = batchFactor
        this.keysPrefix = keysPrefix
    }

    isEqualToBatchFactor() {
        return this.getAllbatchKeys().length >= this.batchFactor
    }

    getAllbatchKeys() {
        var storeRegex = RegExp("^" + this.keysPrefix);

        var batchKeys = Store.getAllKeys().map(function (element, _) {
            if (storeRegex.exec(element) !== null) return element;
        }).filter(function (element) {
            return element;
        })
        return batchKeys
    }

    storeNewEvent(message) {
        var key = this.keysPrefix + message.originalTimestamp;
        Store.set(key, JSON.stringify(message));
    }

    createBatchPayload() {
        var batchKeys = this.getAllbatchKeys()
        var batchPayload = [];

        for (var i = batchKeys.length - 1; i >= 0; i--) {
            batchPayload.push(JSON.parse(Store.get(batchKeys[i])));
            Store.remove(batchKeys[i]);
        }
        return batchPayload
    }
}

export default EventBatching;
