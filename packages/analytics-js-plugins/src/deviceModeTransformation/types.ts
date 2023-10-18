import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

export type BatchPayloadData = {
  orderNo: number;
  destinationIds: string[];
  event: RudderEvent;
};

export type TransformationRequestPayload = {
  metadata: {
    'Custom-Authorization': Nullable<string>;
  };
  batch: BatchPayloadData[];
};

export type TransformationQueueItemData = {
  event: RudderEvent;
  destinationIds: string[];
  token: Nullable<string>;
};

export type TransformedEvent = RudderEvent | null | Record<string, never> | unknown;

export type TransformedPayload = {
  orderNo: number;
  status: string;
  event?: TransformedEvent;
};

export type TransformedBatch = {
  id: string;
  payload: TransformedPayload[] | [];
};

export type TransformationResponsePayload = {
  transformedBatch: TransformedBatch[];
};
