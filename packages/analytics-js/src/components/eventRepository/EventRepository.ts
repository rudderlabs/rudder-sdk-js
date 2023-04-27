import { QueueOptions , Queue } from "@rudderstack/analytics-js/npmPackages/localstorage-retry";
import { IEventRepository } from "./types";
import { IPluginsManager } from "../pluginsManager/types";

class EventRepository implements IEventRepository {
  dataPlaneEventsQueue: Queue;

  constructor(queueOptions: QueueOptions, pluginsManager: IPluginsManager) {
    this.dataPlaneEventsQueue = new Queue('rudder', queueOptions, ((item, done) => {
      // TODO: send this event to XHR queue plugin
      pluginsManager.invoke('queue.process', item, done)
    }));
  }

  init(): void {
    this.dataPlaneEventsQueue.start();
  }
};

export { EventRepository };
