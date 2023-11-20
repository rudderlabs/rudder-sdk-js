import eventFiltering1ExpectedData from '../../__fixtures__/eventFiltering1.json';
import eventFiltering2ExpectedData from '../../__fixtures__/eventFiltering2.json';
import eventFiltering3ExpectedData from '../../__fixtures__/eventFiltering3.json';

const eventFilteringSuite = {
  id: 'eventFilteringFeature',
  name: 'Event Filtering',
  description:
    'Allow/block event submission in destinations based on blacklistedEvents/whitelisted event name values',
  testCases: [
    {
      id: 'eventFiltering',
      description:
        'Event name exists in allowlist and not in denylist are sent to both destinations',
      inputData: [
        [true],
        [
          'AllowListed_Event_Name',
          {},
          {
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
          },
        ],
      ],
      expectedResult: eventFiltering1ExpectedData,
      triggerHandler: ['reset', 'track'],
    },
    {
      id: 'eventFiltering1',
      description:
        'Event name exists in allowlist and in denylist are sent only to allow-listed destination',
      inputData: [
        [true],
        [
          'AllowListed_DenyListed_Event_Name',
          {},
          {
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
          },
        ],
      ],
      expectedResult: eventFiltering2ExpectedData,
      triggerHandler: ['reset', 'track'],
    },
    {
      id: 'eventFiltering2',
      description:
        'Event name does not exist in allowlist and exists in denylist are not send to any destination',
      inputData: [
        [true],
        [
          'DenyListed_Event_Name',
          {},
          {
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
          },
        ],
      ],
      expectedResult: eventFiltering3ExpectedData,
      triggerHandler: ['reset', 'track'],
    },
  ],
};

export { eventFilteringSuite };
