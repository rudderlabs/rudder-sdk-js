import { convertSignalsToJSON } from '@rudderstack/analytics-js/components/utilities/signal';
import { Signal, signal } from '@preact/signals-core';

describe('convertSignalsToJSON', () => {
  // Here we are just exploring different combinations of data where
  // the signals could be buried inside objects, arrays, nested objects, etc.
  const tcData = [
    [
      {
        name: 'test',
        value: 123,
        someKey1: [1, 2, 3],
        someKey2: {
          key1: 'value1',
          key2: 'value2',
        },
        someKey3: 2.5,
        testSignal: signal('test'),
      },
      {
        name: 'test',
        value: 123,
        someKey1: [1, 2, 3],
        someKey2: {
          key1: 'value1',
          key2: 'value2',
        },
        someKey3: 2.5,
        testSignal: 'test',
      },
      undefined
    ],
    [
      {
        name: 'test',
        someKey: {
          key1: 'value1',
          key2: signal('value2'),
        },
        someKey2: {
          key1: 'value1',
          key2: {
            key3: signal('value3'),
          },
        },
        someKey3: [signal('value1'), signal('value2'), 1, 3],
        someKey4: [
          {
            key1: signal('value1'),
            key2: signal('value2'),
          },
          'asdf',
          1,
          {
            key3: 'value3',
            key4: 'value4',
          },
        ],
      },
      {
        name: 'test',
        someKey: {
          key1: 'value1',
          key2: 'value2',
        },
        someKey2: {
          key1: 'value1',
          key2: {
            key3: 'value3',
          },
        },
        someKey3: ['value1', 'value2', 1, 3],
        someKey4: [
          {
            key1: 'value1',
            key2: 'value2',
          },
          'asdf',
          1,
          {
            key3: 'value3',
            key4: 'value4',
          },
        ],
      },
      [],
    ],
    [
      {
        someKey: signal({
          key1: 'value1',
          key2: signal('value2'),
          key3: [signal('value1'), signal('value2'), undefined, null],
          key4: true,
          key7: {
            key1: signal('value1'),
            key2: signal('value2'),
            key3: 'asdf',
            key4: signal('value4'),
          },
          key5: signal([signal('value1'), signal('value2'), 1, 3]),
          KEY6: 123,
        }),
      },
      {
        someKey: {
          key1: 'value1',
          key2: 'value2',
          key3: ['value1', 'value2', undefined, null],
          key7: {
            key1: 'value1',
            key2: 'value2',
            key3: 'asdf',
          },
          key5: ['value1', 'value2', 1, 3],
          KEY6: 123,
        },
      },
      ['key4', 'key6'], // excluded keys
    ],
  ];

  it.each(tcData)('should convert signals to JSON %#', (input, expected, excludes) => {
    expect(convertSignalsToJSON(input, excludes)).toMatchObject(expected);
  });
});
