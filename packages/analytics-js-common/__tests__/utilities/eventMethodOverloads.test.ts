import {
  aliasArgumentsToCallOptions,
  groupArgumentsToCallOptions,
  identifyArgumentsToCallOptions,
  pageArgumentsToCallOptions,
  trackArgumentsToCallOptions,
} from '../../src/utilities/eventMethodOverloads';

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
      pageArgumentsToCallOptions('category', 'name', { props: {} }, { options: {} }),
    ).toStrictEqual({
      category: 'category',
      name: 'name',
      properties: { props: {}, category: 'category', name: 'name' },
      options: { options: {} },
      callback: undefined,
    });
    expect(pageArgumentsToCallOptions('category', 'name', { props: {} })).toStrictEqual({
      category: 'category',
      name: 'name',
      options: undefined,
      properties: { props: {}, category: 'category', name: 'name' },
      callback: undefined,
    });
    expect(pageArgumentsToCallOptions('category', 'name')).toStrictEqual({
      category: 'category',
      name: 'name',
      options: undefined,
      properties: { category: 'category', name: 'name' },
      callback: undefined,
    });

    expect(
      pageArgumentsToCallOptions('category', 'name', { props: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      category: 'category',
      name: 'name',
      properties: { props: {}, category: 'category', name: 'name' },
      options: undefined,
    });
    expect(pageArgumentsToCallOptions('category', 'name', { props: {} })).toStrictEqual({
      category: 'category',
      name: 'name',
      properties: { props: {}, category: 'category', name: 'name' },
      options: undefined,
      callback: undefined,
    });

    expect(
      pageArgumentsToCallOptions('name', { props: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      name: 'name',
      options: {
        options: {},
      },
      properties: { name: 'name', props: {} },
      category: undefined,
    });
    expect(pageArgumentsToCallOptions('name', { props: {} }, { options: {} })).toStrictEqual({
      name: 'name',
      options: {
        options: {},
      },
      properties: { name: 'name', props: {} },
      category: undefined,
      callback: undefined,
    });

    expect(pageArgumentsToCallOptions('name', { props: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'name',
      properties: { name: 'name', props: {} },
      category: undefined,
      options: undefined,
    });
    expect(pageArgumentsToCallOptions('name', { props: {} })).toStrictEqual({
      name: 'name',
      properties: { name: 'name', props: {} },
      category: undefined,
      options: undefined,
      callback: undefined,
    });

    expect(pageArgumentsToCallOptions('name', callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'name',
      properties: { name: 'name' },
      category: undefined,
      options: undefined,
    });
    expect(pageArgumentsToCallOptions('name')).toStrictEqual({
      name: 'name',
      properties: { name: 'name' },
      category: undefined,
      options: undefined,
      callback: undefined,
    });

    expect(pageArgumentsToCallOptions({ props: {} }, { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      properties: { props: {} },
      options: { options: {} },
      name: undefined,
      category: undefined,
    });
    expect(pageArgumentsToCallOptions({ props: {} }, { options: {} })).toStrictEqual({
      properties: { props: {} },
      options: { options: {} },
      name: undefined,
      category: undefined,
      callback: undefined,
    });

    expect(pageArgumentsToCallOptions({ props: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      properties: { props: {} },
      name: undefined,
      category: undefined,
      options: undefined,
    });
    expect(pageArgumentsToCallOptions({ props: {} })).toStrictEqual({
      properties: { props: {} },
      name: undefined,
      category: undefined,
      options: undefined,
      callback: undefined,
    });

    expect(pageArgumentsToCallOptions(callbackMock)).toStrictEqual({
      callback: callbackMock,
      properties: {},
      name: undefined,
      category: undefined,
      options: undefined,
    });
    expect(pageArgumentsToCallOptions()).toStrictEqual({
      properties: {},
      name: undefined,
      category: undefined,
      options: undefined,
      callback: undefined,
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
    expect(trackArgumentsToCallOptions('event', { props: {} }, { options: {} })).toStrictEqual({
      name: 'event',
      properties: { props: {} },
      options: { options: {} },
      callback: undefined,
    });
    expect(trackArgumentsToCallOptions('event', { props: {} })).toStrictEqual({
      name: 'event',
      properties: { props: {} },
      options: undefined,
      callback: undefined,
    });
    expect(trackArgumentsToCallOptions('event')).toStrictEqual({
      name: 'event',
      properties: {},
      options: undefined,
      callback: undefined,
    });

    expect(trackArgumentsToCallOptions('event', { props: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'event',
      properties: { props: {} },
      options: undefined,
    });
    expect(trackArgumentsToCallOptions('event', { props: {} })).toStrictEqual({
      name: 'event',
      properties: { props: {} },
      options: undefined,
      callback: undefined,
    });

    expect(trackArgumentsToCallOptions('event', callbackMock)).toStrictEqual({
      callback: callbackMock,
      name: 'event',
      properties: {},
      options: undefined,
    });
    expect(trackArgumentsToCallOptions('event', { properties: {} }, { options: {} })).toStrictEqual(
      {
        properties: { properties: {} },
        options: { options: {} },
        name: 'event',
        callback: undefined,
      },
    );
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
    expect(identifyArgumentsToCallOptions(1234, { traits: {} }, { options: {} })).toStrictEqual({
      userId: '1234',
      traits: { traits: {} },
      options: { options: {} },
      callback: undefined,
    });

    expect(identifyArgumentsToCallOptions('userId', { traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      userId: 'userId',
      traits: { traits: {} },
      options: undefined,
    });
    expect(identifyArgumentsToCallOptions('userId', { traits: {} })).toStrictEqual({
      userId: 'userId',
      traits: { traits: {} },
      options: undefined,
      callback: undefined,
    });

    expect(identifyArgumentsToCallOptions('userId', callbackMock)).toStrictEqual({
      callback: callbackMock,
      userId: 'userId',
      traits: undefined,
      options: undefined,
    });
    expect(identifyArgumentsToCallOptions('userId')).toStrictEqual({
      userId: 'userId',
      traits: undefined,
      options: undefined,
      callback: undefined,
    });

    expect(
      identifyArgumentsToCallOptions({ traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      callback: callbackMock,
      userId: null,
      traits: { traits: {} },
      options: { options: {} },
    });
    expect(identifyArgumentsToCallOptions({ traits: {} }, { options: {} })).toStrictEqual({
      userId: null,
      traits: { traits: {} },
      options: { options: {} },
      callback: undefined,
    });

    expect(identifyArgumentsToCallOptions({ traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      userId: null,
      traits: { traits: {} },
      options: undefined,
    });
    expect(identifyArgumentsToCallOptions({ traits: {} })).toStrictEqual({
      userId: null,
      traits: { traits: {} },
      options: undefined,
      callback: undefined,
    });
  });

  it('should convert facade alias method arguments to analytics alias call options', () => {
    expect(aliasArgumentsToCallOptions('to', 'from', { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      from: 'from',
      options: { options: {} },
    });
    expect(aliasArgumentsToCallOptions('to', 'from', { options: {} })).toStrictEqual({
      to: 'to',
      from: 'from',
      options: { options: {} },
      callback: undefined,
    });

    expect(aliasArgumentsToCallOptions('to', 'from', callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      from: 'from',
      options: undefined,
    });
    expect(aliasArgumentsToCallOptions('to', 'from')).toStrictEqual({
      to: 'to',
      from: 'from',
      options: undefined,
      callback: undefined,
    });

    expect(aliasArgumentsToCallOptions('to', { options: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      options: { options: {} },
      from: undefined,
    });
    expect(aliasArgumentsToCallOptions('to', { options: {} })).toStrictEqual({
      to: 'to',
      options: { options: {} },
      from: undefined,
      callback: undefined,
    });

    expect(aliasArgumentsToCallOptions('to', callbackMock)).toStrictEqual({
      callback: callbackMock,
      to: 'to',
      from: undefined,
      options: undefined,
    });
    expect(aliasArgumentsToCallOptions('to')).toStrictEqual({
      to: 'to',
      from: undefined,
      options: undefined,
      callback: undefined,
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
    expect(groupArgumentsToCallOptions(1234, { traits: {} }, { options: {} })).toStrictEqual({
      groupId: '1234',
      traits: { traits: {} },
      options: { options: {} },
      callback: undefined,
    });

    expect(groupArgumentsToCallOptions('groupId', { traits: {} }, callbackMock)).toStrictEqual({
      callback: callbackMock,
      groupId: 'groupId',
      traits: { traits: {} },
      options: undefined,
    });
    expect(groupArgumentsToCallOptions('groupId', { traits: {} })).toStrictEqual({
      groupId: 'groupId',
      traits: { traits: {} },
      options: undefined,
      callback: undefined,
    });

    expect(groupArgumentsToCallOptions('groupId', callbackMock)).toStrictEqual({
      callback: callbackMock,
      groupId: 'groupId',
      traits: undefined,
      options: undefined,
    });
    expect(groupArgumentsToCallOptions('groupId')).toStrictEqual({
      groupId: 'groupId',
      traits: undefined,
      options: undefined,
      callback: undefined,
    });

    expect(
      groupArgumentsToCallOptions({ traits: {} }, { options: {} }, callbackMock),
    ).toStrictEqual({
      groupId: null,
      callback: callbackMock,
      traits: { traits: {} },
      options: { options: {} },
    });
    expect(groupArgumentsToCallOptions({ traits: {} }, { options: {} })).toStrictEqual({
      groupId: null,
      traits: { traits: {} },
      options: { options: {} },
      callback: undefined,
    });

    expect(groupArgumentsToCallOptions({ traits: {} }, callbackMock)).toStrictEqual({
      groupId: null,
      callback: callbackMock,
      traits: { traits: {} },
      options: undefined,
    });
    expect(groupArgumentsToCallOptions({ traits: {} })).toStrictEqual({
      groupId: null,
      traits: { traits: {} },
      options: undefined,
      callback: undefined,
    });
  });
});
