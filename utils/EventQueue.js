import Queue from "@segment/localstorage-retry";
import storageQueue from "./storage/storageQueue";

let queue = process.transport.beacon ? storageQueue : Queue;
export default queue ;
