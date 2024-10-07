import type {
  HttpClientErrorProperties,
  IHttpClientError,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { isTypeOfError } from '@rudderstack/analytics-js-common/utilities/checks';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';

class HttpClientError extends Error implements IHttpClientError {
  public status?: number;
  public statusText?: string;
  public responseBody?: string | null;

  constructor(message: string, properties?: HttpClientErrorProperties) {
    super(message);

    const { status, statusText, responseBody, originalError } = properties || {};

    if (originalError) {
      let originalMsg;
      if (isTypeOfError(originalError)) {
        Object.assign(this, originalError);
        originalMsg = originalError.message;
      } else {
        originalMsg = stringifyWithoutCircular(originalError as Record<string, any>);
      }
      this.message = `${message}: ${originalMsg}`;
    }

    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export { HttpClientError };
