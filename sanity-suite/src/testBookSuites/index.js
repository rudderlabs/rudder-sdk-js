import { identifyMethodSuite } from './identify';
import { trackMethodSuite } from './track';

// TODO: add all standard events https://www.rudderstack.com/docs/event-spec/standard-events/
// then all features from https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/
const sanityTestBookData = [
  {
    groupName: 'Methods',
    suites: [identifyMethodSuite, trackMethodSuite],
  },
  {
    groupName: 'Features',
    suites: [],
  },
];

export { sanityTestBookData };
