import { Store } from "./store";
import { replacer } from "../utils";

const defaults = {
    queue : "queue",
    maxPayloadSize: 64 * 1000
}

class StorageQueue {
    constructor() {
        this.storage = Store;
        this.maxItems = 3;
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
        var maxPayloadSizeReached = false;
        if(dataToSend.length > defaults.maxPayloadSize){
            batch = queue.slice(0, queue.length - 1);
            data = {batch: batch};
            dataToSend = JSON.stringify(data, replacer);
            maxPayloadSizeReached = true;
            this.setQueue([message]);
        } else {
            this.setQueue(queue);
        }
        if(queue.length == this.maxItems || maxPayloadSizeReached){
            this.flushQueue(headers, dataToSend, url, writekey);
        }
        

    }

    sendDataFromQueue(writekey, url){
        var queue = this.getQueue();
        var batch = queue.slice(0, queue.length);
        var data = {batch: batch};
        var dataToSend = JSON.stringify(data, replacer);
        var headers = {};
        this.flushQueue(headers, dataToSend, url, writekey);
        
    }

    flushQueue(headers, payload, url, writekey){
        headers.type = 'application/json';
        const blob = new Blob([payload], headers);
        navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
        this.setQueue([]);
    }
}

const storageQueue = new StorageQueue();
export default storageQueue;