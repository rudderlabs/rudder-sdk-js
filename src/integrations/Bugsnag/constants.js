const NAME = 'BUGSNAG';
const CNameMapping = {
  [NAME]: NAME,
  bugsnag: NAME,
  Bugsnag: NAME,
};
const requiredConfigsList = ['apiKey', 'releaseStage'];

export { NAME, CNameMapping, requiredConfigsList };
