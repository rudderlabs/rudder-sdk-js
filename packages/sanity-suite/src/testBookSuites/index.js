import { sourceConfigAPISuite } from './sourceConfig';
import { identifyMethodSuite } from './identify';
import { trackMethodSuite } from './track';
import { pageMethodSuite } from './page';
import { groupMethodSuite } from './group';
import { aliasMethodSuite } from './alias';
import { eventFilteringSuite } from './eventFiltering';

// All standard events https://www.rudderstack.com/docs/event-spec/standard-events/
// then all features from https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/
const sanityTestBookData = [
  {
    groupName: 'Methods',
    suites: [
      identifyMethodSuite,
      trackMethodSuite,
      pageMethodSuite,
      groupMethodSuite,
      aliasMethodSuite,
    ],
  },
  {
    groupName: 'Features',
    suites: [eventFilteringSuite],
  },
  {
    groupName: 'API Endpoints',
    suites: [sourceConfigAPISuite],
  },
];

export { sanityTestBookData };
