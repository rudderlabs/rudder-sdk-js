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
    'integrations',
    '@rudderstack/analytics-js',
    '@rudderstack/analytics-js-plugins',
    'rudder-sdk-js',
    '@rudderstack/analytics-js-sanity-suite',
  ],
});
