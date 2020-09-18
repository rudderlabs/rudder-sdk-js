import { Store } from "./store";
import { replacer, getCurrentTimeFormatted } from "../utils";
import logger from "../logUtil";

const defaults = {
    queue : "queue",
    maxPayloadSize: 64 * 1000
}

class StorageQueue {
    constructor() {
        this.storage = Store;
        this.maxItems = 10;
    }

    getQueue(){
        return this.storage.get(defaults.queue);
    }

    setQueue(value){
        this.storage.set(defaults.queue, value);
    }

    enqueue(url, headers, message, writekey){
        var queue = this.getQueue() || [];
        queue = queue.slice(-(this.maxItems - 1));
        queue.push(message);
        var batch = queue.slice(0);
        var data = {batch: batch};
        var dataToSend = JSON.stringify(data, replacer);
        if(dataToSend.length > defaults.maxPayloadSize){
            batch = queue.slice(0, queue.length - 1);
            maxPayloadSizeReached = true;
            this.flushQueue(headers, batch, url, writekey);
            queue = this.getQueue();
            queue.push(message);
            this.setQueue(queue);
        } else {
            this.setQueue(queue);
        }
        if(queue.length == this.maxItems){
            this.flushQueue(headers, batch, url, writekey);
        }
        

    }

    sendDataFromQueue(writekey, url){
        var queue = this.getQueue();
        if(queue && queue.length > 0){
            var batch = queue.slice(0, queue.length);
            var headers = {};
            this.flushQueue(headers, batch, url, writekey);
        }
        
    }

    flushQueue(headers, batch, url, writekey){
        headers.type = 'application/json';
        batch.map((event) => {
            event.sentAt = getCurrentTimeFormatted();
        })
        var data = {batch: batch};
        var payload = JSON.stringify(data, replacer);
        const blob = new Blob([payload], headers);
        var isPushed = navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
        if (!isPushed) {
         logger.debug("Unable to send data");   
        }
        this.setQueue([]);
    }
}

const storageQueue = new StorageQueue();
export default storageQueue;