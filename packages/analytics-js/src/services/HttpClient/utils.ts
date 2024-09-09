import type {
  HttpClientErrorProperties,
  IHttpClientError,
} from '@rudderstack/analytics-js-common/types/HttpClient';

class HttpClientError extends Error implements IHttpClientError {
  public status?: number;
  public statusText?: string;
  public responseBody?: string | null;

  constructor(message: string, properties?: HttpClientErrorProperties) {
    super(message);

    const { status, statusText, responseBody, originalError } = properties || {};

    if (originalError) {
      Object.assign(this, originalError);
      this.message = message;
    }

    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export { HttpClientError };
