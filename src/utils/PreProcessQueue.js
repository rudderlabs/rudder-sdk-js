/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import Queue from '@segment/localstorage-retry';
import * as R from 'ramda';
import { EventRepository } from './EventRepository';
import { getMergedClientSuppliedIntegrations } from './IntegrationsData';
import { transformToServerNames } from './utils';
import RudderElement from './RudderElement';

const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

class PreProcessQueue {
  constructor() {
    this.data = undefined;
    this.eventRepository = EventRepository;
  }

  init(options) {
    if (options) {
      // TODO: add checks for value - has to be +ve?
      Object.assign(queueOptions, options);
    }
    this.payloadQueue = new Queue('rudder_events', queueOptions, (item, done) => {
      const { type, rudderElement } = item;
      this.processQueueElement(type, rudderElement, (err, res) => {
        if (err) {
          return done(err);
        }
        done(null, res);
      });
    });
  }

  execute(integrationsData) {
    this.data = integrationsData;
    this.payloadQueue.start();
  }

  processQueueElement(type, rudderElement, queueFn) {
    try {
      // if not specified at event level, All: true is default
      const clientSuppliedIntegrations = rudderElement.message.integrations || { All: true };
      // convert integrations object to server identified names, kind of hack now!
      transformToServerNames(rudderElement.message.integrations);
      rudderElement.message.integrations = getMergedClientSuppliedIntegrations(
        this.data,
        clientSuppliedIntegrations,
      );
      Object.setPrototypeOf(rudderElement, RudderElement.prototype);
      // self analytics process, send to rudder
      this.eventRepository.enqueue(rudderElement, type);
      queueFn(null);
    } catch (error) {
      queueFn(error);
    }
  }

  enqueue(type, rudderElement) {
    // add items to the queue
    const clonedRudderElement = R.clone(rudderElement);
    this.payloadQueue.addItem({ type, rudderElement: clonedRudderElement });
  }
}

export default PreProcessQueue;
