import type { Exception } from '@rudderstack/analytics-js-common/types/Metrics';

export interface IErrorFormat {
  errors: Exception[];
}

export type FrameType = {
  fileName: string;
  functionName: string;
  lineNumber: number;
  columnNumber: number;
};
