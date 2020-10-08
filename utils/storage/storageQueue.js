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
        this.maxItems = 5;
        this.flushQueueTimeOut = undefined;
        this.timeOutActive = false;
        this.flushQueueTimeOutInterval = 1000 * 60 * 1; // 1 min
        this.url = "";
        this.writekey = "";
        this.queueName = `${defaults.queue}.${Date.now()}`
    }

    getQueue(){
        return this.storage.get(this.queueName);
    }

    setQueue(value){
        this.storage.set(this.queueName, value);
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
            this.flushQueue(headers, batch, url, writekey);
            queue = this.getQueue();
            queue.push(message);
        }
        this.setQueue(queue);
        this.setTimer();
        
        if(queue.length == this.maxItems){
            this.flushQueue(headers, batch, url, writekey);
        }
        

    }

    sendDataFromQueueAndDestroyQueue(){
        this.sendDataFromQueue();
        this.storage.remove(this.queueName);
    }

    sendDataFromQueue(){
        var queue = this.getQueue();
        if(queue && queue.length > 0){
            var batch = queue.slice(0, queue.length);
            var headers = {};
            this.flushQueue(headers, batch, this.url, this.writekey);
        }
        
    }

    flushQueue(headers, batch, url, writekey){
        try{
            headers = {}
            headers.type = 'text/plain';
            batch.map((event) => {
                event.sentAt = getCurrentTimeFormatted();
            })
            if(batch && batch.length > 0) {
                var data = {batch: batch};
                var payload = JSON.stringify(data, replacer);
                console.log("batch payload size=======", payload.length)
                const blob = new Blob([payload], headers);
                 var isPushed = navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
                if (!isPushed) {
                    logger.debug("Unable to send data");   
                }
            }
        } catch (error) {
            logger.error("error while sending data: ", error.message);
        } finally {
            this.setQueue([]);
            this.clearTimer();
        }
       
    }

    setTimer(){
        if(!this.timeOutActive){
            this.flushQueueTimeOut = setTimeout(this.sendDataFromQueue.bind(this), this.flushQueueTimeOutInterval);
            this.timeOutActive = true;
        }
    }
    clearTimer(){
        if(this.timeOutActive){
            clearTimeout(this.flushQueueTimeOut);
            this.timeOutActive = false;
        }
    }
}

const storageQueue = new StorageQueue();
export default storageQueue;