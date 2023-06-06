import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '@rudderstack/analytics-js/components/core/eventMethodOverloads';

describe('Core - Event Method Overloads', () => {
  const callbackMock = jest.fn();

  it('should convert facade page method arguments to analytics page call options', () => {
    expect(
      pageArgumentsToCallOptions('category', 'name', { props: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      category: 'category',
      name: 'name',
      properties: { props: {}, category: 'category', name: 'name' },
      options: { options: {} },
    });
    expect(
      pageArgumentsToCallOptions('category', 'name', { props: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      category: 'category',
      name: 'name',
      properties: { props: {}, category: 'category', name: 'name' },
    });
    expect(pageArgumentsToCallOptions('category', 'name', callbackMock)).toStrictEqual({
      callback: callbackMock,
      category: 'category',
      name: 'name',
      properties: { category: 'category', name: 'name' },
    });
    expect(pageArgumentsToCallOptions('category', callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'category',
      properties: { category: null, name: 'category' },
    });
    expect(pageArgumentsToCallOptions(undefined, 'name', callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'name',
      properties: { category: null, name: 'name' },
    });
    expect(pageArgumentsToCallOptions(callbackMock)).toStrictEqual({
      callback: callbackMock,
      properties: { category: null, name: null },
    });
    expect(pageArgumentsToCallOptions({ props: {} }, { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      properties: { props: {}, category: null, name: null },
      options: { options: {} },
    });
    expect(
      pageArgumentsToCallOptions('category', { props: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      name: 'category',
      properties: { props: {}, category: null, name: 'category' },
      options: { options: {} },
    });
  });

  it('should convert facade track method arguments to analytics track call options', () => {
    expect(
      trackArgumentsToCallOptions('event', { props: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      name: 'event',
      properties: { props: {} },
      options: { options: {} },
    });
    expect(trackArgumentsToCallOptions('event', { props: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'event',
      properties: { props: {} },
    });
    expect(trackArgumentsToCallOptions('event', callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'event',
      properties: {},
    });
    expect(trackArgumentsToCallOptions('event', { properties: {} }, { options: {} })).toStrictEqual(
      {
        properties: { properties: {} },
        options: { options: {} },
        name: 'event',
      },
    );
    expect(trackArgumentsToCallOptions('event', { properties: {} })).toStrictEqual({
      properties: { properties: {} },
      name: 'event',
    });
  });

  it('should convert facade identify method arguments to analytics identify call options', () => {
    expect(
      identifyArgumentsToCallOptions(1234, { traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      userId: '1234',
      traits: { traits: {} },
      options: { options: {} },
    });
    expect(identifyArgumentsToCallOptions('userId', { traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      userId: 'userId',
      traits: { traits: {} },
    });
    expect(identifyArgumentsToCallOptions('userId', callbackMock)).toStrictEqual({
      callback: callbackMock,
      userId: 'userId',
    });
    expect(
      identifyArgumentsToCallOptions({ traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      traits: { traits: {} },
      options: { options: {} },
    });
  });

  it('should convert facade alias method arguments to analytics alias call options', () => {
    expect(aliasArgumentsToCallOptions('to', 'from', { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      from: 'from',
      options: { options: {} },
    });
    expect(aliasArgumentsToCallOptions('to', 'from', callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      from: 'from',
    });
    expect(aliasArgumentsToCallOptions('to', callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
    });
    expect(aliasArgumentsToCallOptions('to', { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      options: { options: {} },
    });
    expect(aliasArgumentsToCallOptions(callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: null,
      from: undefined,
    });
    expect(aliasArgumentsToCallOptions({ options: {} })).toStrictEqual({
      options: { options: {} },
      to: null,
      from: undefined,
    });
  });

  it('should convert facade group method arguments to analytics group call options', () => {
    expect(
      groupArgumentsToCallOptions(1234, { traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      groupId: '1234',
      traits: { traits: {} },
      options: { options: {} },
    });
    expect(groupArgumentsToCallOptions('groupId', { traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      groupId: 'groupId',
      traits: { traits: {} },
    });
    expect(groupArgumentsToCallOptions('groupId', callbackMock)).toStrictEqual({
      callback: callbackMock,
      groupId: 'groupId',
    });
    expect(groupArgumentsToCallOptions(callbackMock)).toStrictEqual({
      callback: callbackMock,
    });
    expect(
      groupArgumentsToCallOptions({ traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      traits: { traits: {} },
      options: { options: {} },
    });
    expect(groupArgumentsToCallOptions({ traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      traits: { traits: {} },
    });
  });
});
