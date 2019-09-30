import { Storage } from "./storage";
import { StorageNode } from "./storage_node";
export default process.browser ? Storage : StorageNode;
