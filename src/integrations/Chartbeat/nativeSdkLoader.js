import ScriptLoader, { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(script) {
  ScriptLoader('chatbeat', `//static.chartbeat.com/js/${script}`);
}

export { loadNativeSdk };
