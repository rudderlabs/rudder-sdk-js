import group1ExpectedData from '../../__fixtures__/group1.json';
import group2ExpectedData from '../../__fixtures__/group2.json';
import group3ExpectedData from '../../__fixtures__/group3.json';
import group4ExpectedData from '../../__fixtures__/group4.json';
import group5ExpectedData from '../../__fixtures__/group5.json';
import group6ExpectedData from '../../__fixtures__/group6.json';

const groupMethodSuite = {
  id: 'groupMethod',
  name: 'Group',
  description: 'Group Method: rudderanalytics.group(groupId, [traits], [apiOptions], [callback]);',
  testCases: [
    {
      id: 'group1',
      description: 'Call with all arguments and all primitives in traits and apiOptions',
      inputData: [
        [true],
        [
          'customGroupID',
          {
            groupName: 'Anime fan club',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            city: 'San Antonio',
            postalCode: 890465,
            country: 'US',
            street: 'Sample Address',
            state: 'TX',
            label: 'club office',
            defaultAddress: true,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
          {
            key1: [1, 2, 3, 4],
            key2: 'sample text',
            key3: false,
            key4: 9087654,
            key5: {
              key6: 'sample text 2',
              key7: [
                {
                  color: '#3456789',
                  name: null,
                },
                {
                  color: '#3456767',
                  name: 'Red',
                },
              ],
            },
            key8: null,
            key9: undefined,
            externalIds: [
              {
                id: 'some_external_id_1',
                type: 'brazeExternalId',
              },
            ],
            device: {
              id: 'sdfghj567-cghj5678-fghjvbn888',
            },
            library: {
              name: 'Random JavaScript SDK',
              version: '2.22.0',
            },
            context: {
              metaData: {
                appVersion: '2.8.0',
                appId: '1hKOmRA4GRlm',
                release_stage: 'Production',
              },
            },
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
            anonymousId: 'sample anonymousId',
            originalTimestamp: '2023-01-13T08:13:58.548Z',
            channel: 'random',
          },
        ],
      ],
      expectedResult: group1ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
    {
      id: 'group2',
      description: 'Call with groupId, groupTraits as arguments',
      inputData: [
        [true],
        [
          'customGroupID',
          {
            groupName: 'Anime fan club',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            city: 'San Antonio',
            postalCode: 890465,
            country: 'US',
            street: 'Sample Address',
            state: 'TX',
            label: 'club office',
            defaultAddress: true,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
        ],
      ],
      expectedResult: group2ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
    {
      id: 'group3',
      description: 'Call with groupId, groupTraits and null apiOptions as arguments',
      inputData: [
        [true],
        [
          'customGroupID',
          {
            groupName: 'Anime fan club',
            email: 'name.surname@domain.com',
            company: 'Company123',
            phone: '123-456-7890',
            rating: 'Hot',
            city: 'San Antonio',
            postalCode: 890465,
            country: 'US',
            street: 'Sample Address',
            state: 'TX',
            label: 'club office',
            defaultAddress: true,
            temp1: null,
            temp2: undefined,
            temp3: [1, 2, 3],
            temp4: {
              selectedType: 'hard copy',
              typesAvailable: ['kindle edition', 'audio book', 'hard copy', null],
            },
          },
          null,
        ],
      ],
      expectedResult: group3ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
    {
      id: 'group4',
      description: 'Call with groupId, null groupTraits and apiOptions as arguments',
      inputData: [
        [true],
        [
          'customGroupID',
          null,
          {
            key1: [1, 2, 3, 4],
            key2: 'sample text',
            key3: false,
            key4: 9087654,
            key5: {
              key6: 'sample text 2',
              key7: [
                {
                  color: '#3456789',
                  name: null,
                },
                {
                  color: '#3456767',
                  name: 'Red',
                },
              ],
            },
            key8: null,
            key9: undefined,
            externalIds: [
              {
                id: 'some_external_id_1',
                type: 'brazeExternalId',
              },
            ],
            device: {
              id: 'sdfghj567-cghj5678-fghjvbn888',
            },
            library: {
              name: 'Random JavaScript SDK',
              version: '2.22.0',
            },
            context: {
              metaData: {
                appVersion: '2.8.0',
                appId: '1hKOmRA4GRlm',
                release_stage: 'Production',
              },
            },
            integrations: {
              All: false,
              'Google Analytics': true,
              Amplitude: true,
            },
            anonymousId: 'sample anonymousId',
            originalTimestamp: '2023-01-13T08:13:58.548Z',
            channel: 'random',
          },
        ],
      ],
      expectedResult: group4ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
    {
      id: 'group5',
      description: 'Call with groupId as argument',
      inputData: [[true], ['customGroupID']],
      expectedResult: group5ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
    {
      id: 'group6',
      description: 'Call with only callback as argument',
      inputData: [[true], []],
      expectedResult: group6ExpectedData,
      triggerHandler: ['reset', 'group'],
    },
  ],
};

export { groupMethodSuite };
