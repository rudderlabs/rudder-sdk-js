import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk() {
  if (document.location.protocol == 'https:') {
    ScriptLoader('comscore', 'https://sb.scorecardresearch.com/beacon.js');
  } else {
    ScriptLoader('comscore', 'http://b.scorecardresearch.com/beacon.js');
  }
}

export { loadNativeSdk };
