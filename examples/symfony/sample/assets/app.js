/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// Import RudderStack Analytics SDK
import { RudderAnalytics } from '@rudderstack/analytics-js';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// Get environment variables from Symfony (passed via Twig)
const writeKey = window.RUDDERSTACK_WRITE_KEY || '';
const dataplaneUrl = window.RUDDERSTACK_DATAPLANE_URL || '';

// Only initialize RudderStack if we have the required configuration
if (writeKey && dataplaneUrl) {
  console.log('Initializing RudderStack with:', { writeKey, dataplaneUrl });
  
  // Initialize RudderStack
  const analytics = new RudderAnalytics();
  const loadOptions = {};
  
  // Load and configure RudderStack
  analytics.load(writeKey, dataplaneUrl, loadOptions);
  
  // Track a page view event
  analytics.page('Sample Page');
  
  console.log('RudderStack initialized successfully!');
} else {
  console.warn('RudderStack not initialized: Missing writeKey or dataplaneUrl');
}
