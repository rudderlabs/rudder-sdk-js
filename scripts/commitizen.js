// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const custom = require('@digitalroute/cz-conventional-changelog-for-jira/configurable');

module.exports = custom({
  jiraMode: false,
  jiraOptional: true,
  skipScope: false,
  defaultType: 'chore',
  defaultScope: 'monorepo',
  jiraPrefix: '',
  jiraAppend: '',
  scopes: [
    'release',
    'monorepo',
    'common',
    'analytics-js',
    'analytics-js-plugins',
    'analytics-js-integrations',
    'analytics-js-service-worker',
    'rudder-sdk-js',
    'analytics-js-sanity-suite',
    'analytics-js-loading-script',
  ],
});
