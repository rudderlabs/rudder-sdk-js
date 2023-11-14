/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import { RudderAnalytics } from '@rudderstack/analytics-js';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

const analytics = new RudderAnalytics();
analytics.load('<writeKey>', '<dataplaneUrl');
window.rudderanalytics = analytics;

window.rudderanalytics.page();
