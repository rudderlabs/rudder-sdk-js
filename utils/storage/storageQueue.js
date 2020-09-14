import { Store } from "./store";
import { replacer } from "../utils";

const defaults = {
    queue : "queue",
    maxPayloadSize: 64 * 1000
}

class StorageQueue {
    constructor() {
        this.storage = Store;
        //this.queue = [];
        this.maxItems = 3;
        //this.storage.set(defaults.queue, []);
        //this.setQueue([]);
    }

    getQueue(){
        return this.storage.get(defaults.queue);
    }

    setQueue(value){
        this.storage.set(defaults.queue, value);
    }

    enqueue(url, headers, message, writekey){
        var queue = this.getQueue() || [];
        /* var item = {
            message: message,
            headers: headers,
            url: url
        } */
        headers.type = 'application/json'
        queue = queue.slice(-(this.maxItems - 1));
        queue.push(message);
        /* queue = queue.sort(function(a,b) {
            return a.time - b.time;
        }); */
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
            
            //const blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
            //const blob = new Blob([JSON.stringify(data, replacer)], headers);
            //const blob = new Blob(batch, headers);
            const blob = new Blob([dataToSend], headers);
            navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
            this.setQueue([]);
        }
        

    }

    sendDataFromQueue(writekey, url){
        var queue = this.getQueue();
        var batch = queue.slice(0, queue.length);
        var data = {batch: batch};
        var dataToSend = JSON.stringify(data, replacer);
        var headers = {};
        headers.type = 'application/json';
        const blob = new Blob([dataToSend], headers);
        navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
        this.setQueue([]);
    }
}

const storageQueue = new StorageQueue();
export default storageQueue;