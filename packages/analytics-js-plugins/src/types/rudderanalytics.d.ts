// Apparently, this import is needed to satisfy the TypeScript compiler
// Not sure why it's needed, but it is.
// This is just a sample import.
import type { RudderEventType } from './plugins';

declare global {
  interface Window {
    /**
     * Version identifier used in Bugsnag error reports.
     * This property is attached to the window object by the SDK.
     */
    RudderSnippetVersion?: string;
  }
}
