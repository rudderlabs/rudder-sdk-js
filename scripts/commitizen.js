// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const custom = require('@digitalroute/cz-conventional-changelog-for-jira/configurable');

module.exports = custom({
  jiraMode: false,
  jiraOptional: true,
  skipScope: false,
  defaultType: 'chore',
  defaultScope: 'monorepo',
  jiraPrefix: 'SDK',
  jiraAppend: '',
  scopes: [
    'release',
    'monorepo',
    'analytics-js',
    'analytics-js-common',
    'analytics-js-plugins',
    'analytics-js-integrations',
    'analytics-js-service-worker',
    'rudder-sdk-js',
    'analytics-js-sanity-suite',
    'analytics-js-loading-scripts',
    'deps',
    'examples',
  ],
});
