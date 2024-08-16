import type { IHttpClientError } from '@rudderstack/analytics-js-common/types/HttpClient';

class HttpClientError extends Error implements IHttpClientError {
  public status?: number;
  public statusText?: string;
  public responseBody?: string | null;

  constructor(message: string, status?: number, statusText?: string, responseBody?: string | null) {
    super(message);
    this.name = 'HttpClientError';
    this.status = status;
    this.statusText = statusText;
    this.responseBody = responseBody;
  }
}

export { HttpClientError };
