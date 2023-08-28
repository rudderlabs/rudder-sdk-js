import { ScriptLoader } from '@rudderstack/analytics-js-common/utilsV1/ScriptLoader';

function loadNativeSdk(script) {
  ScriptLoader('chatbeat', `//static.chartbeat.com/js/${script}`);
}

export { loadNativeSdk };
