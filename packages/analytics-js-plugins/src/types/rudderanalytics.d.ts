import type { RudderEventType } from './plugins';

declare global {
  interface Window {
    RudderSnippetVersion?: string;
  }
}
