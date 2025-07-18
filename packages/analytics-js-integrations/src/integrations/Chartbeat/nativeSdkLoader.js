import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';

function loadNativeSdk(script) {
  ScriptLoader('chatbeat', `//static.chartbeat.com/js/${script}`);
}

export { loadNativeSdk };
