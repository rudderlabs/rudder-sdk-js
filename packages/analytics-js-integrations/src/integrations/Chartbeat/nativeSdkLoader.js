import ScriptLoader from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';

function loadNativeSdk(script) {
  ScriptLoader('chatbeat', `//static.chartbeat.com/js/${script}`);
}

export { loadNativeSdk };
