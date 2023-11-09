/* eslint-disable sonarjs/no-duplicate-string */
import { looselyValidateEvent } from '../../src/loosely-validate-event';

describe('Loosely validate event', () => {
  it('should require "anonymousId" to be a string or number', () => {
    expect(() => looselyValidateEvent({ type: 'track', anonymousId: { foo: 'bar' } })).toThrow(
      '"anonymousId" must be a string or number.',
    );
  });

  it('should require "category" to be a string', () => {
    expect(() => looselyValidateEvent({ type: 'track', category: true })).toThrow(
      '"category" must be a string.',
    );
  });

  it('should require "integrations" to be an object', () => {
    expect(() => looselyValidateEvent({ type: 'track', integrations: true })).toThrow(
      '"integrations" must be an object.',
    );
  });

  it('should require an event type', () => {
    expect(() => looselyValidateEvent({})).toThrow('You must pass an event type.');
    expect(() => looselyValidateEvent({ type: '' })).toThrow('You must pass an event type.');
  });

  it('should require a valid event type', () => {
    expect(() => looselyValidateEvent({ type: 'foo' })).toThrow('Invalid event type: "foo"');
  });

  it('should require anonymousId or userId on track events', () => {
    expect(() => looselyValidateEvent({ type: 'track', event: 'Did Something' })).toThrow(
      'You must pass either an "anonymousId" or a "userId".',
    );
    expect(() =>
      looselyValidateEvent({ type: 'track', event: 'Did Something', fooId: 'foo' }),
    ).toThrow();
    expect(() =>
      looselyValidateEvent({ event: 'Did Something', anonymousId: 'foo' }, 'track'),
    ).not.toThrow();
    expect(() =>
      looselyValidateEvent({ type: 'track', event: 'Did Something', anonymousId: 'foo' }),
    ).not.toThrow();
  });

  it('should require event on track events', () => {
    expect(() => looselyValidateEvent({ type: 'track', userId: 'foo' })).toThrow(
      'You must pass an "event".',
    );
    expect(() =>
      looselyValidateEvent({ type: 'track', event: 'Did Something', userId: 'foo' }),
    ).not.toThrow();
  });

  it('should require anonymousId or userId on group events', () => {
    expect(() => looselyValidateEvent({ type: 'group', groupId: 'foo' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'group', groupId: 'foo', fooId: 'bar' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() =>
      looselyValidateEvent({ type: 'group', groupId: 'foo', anonymousId: 'foo' }),
    ).not.toThrow();
    expect(() =>
      looselyValidateEvent({ type: 'group', groupId: 'foo', userId: 'foo' }),
    ).not.toThrow();
  });

  it('should require groupId on group events', () => {
    expect(() => looselyValidateEvent({ type: 'group', userId: 'foo' })).toThrow(
      'You must pass a "groupId".',
    );
    expect(() =>
      looselyValidateEvent({ type: 'group', groupId: 'foo', userId: 'foo' }),
    ).not.toThrow();
  });

  it('should require anonymousId or userId on identify events', () => {
    expect(() => looselyValidateEvent({ type: 'identify' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'identify', fooId: 'bar' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'identify', anonymousId: 'foo' })).not.toThrow();
    expect(() => looselyValidateEvent({ type: 'identify', userId: 'foo' })).not.toThrow();
  });

  it('should require anonymousId or userId on page events', () => {
    expect(() => looselyValidateEvent({ type: 'page' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'page', fooId: 'bar' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'page', anonymousId: 'foo' })).not.toThrow();
    expect(() => looselyValidateEvent({ type: 'page', userId: 'foo' })).not.toThrow();
  });

  it('should require anonymousId or userId on screen events', () => {
    expect(() => looselyValidateEvent({ type: 'screen' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'screen', fooId: 'bar' })).toThrow(
      'You must pass either an "anonymousId" or a "userId"',
    );
    expect(() => looselyValidateEvent({ type: 'screen', anonymousId: 'foo' })).not.toThrow();
    expect(() => looselyValidateEvent({ type: 'screen', userId: 'foo' })).not.toThrow();
  });

  it('should require anonymousId or userId on alias events', () => {
    expect(() => looselyValidateEvent({ type: 'alias' })).toThrow('You must pass a "userId"');
    expect(() => looselyValidateEvent({ type: 'alias', fooId: 'bar' })).toThrow(
      'You must pass a "userId"',
    );
    expect(() =>
      looselyValidateEvent({ type: 'alias', userId: 'foo', previousId: 'bar' }),
    ).not.toThrow();
  });

  it('should require events to be < 32kb', () => {
    const largeEvent = {
      ype: 'track',
      event: 'Did Something',
      userId: 'banana',
      properties: {},
    };

    for (let i = 0; i < 10000; i++) {
      (largeEvent as any).properties[i] = 'a';
    }

    expect(() => looselyValidateEvent(largeEvent)).toThrow('Your message must be < 32kb.');
    expect(() =>
      looselyValidateEvent({ type: 'track', event: 'Did Something', anonymousId: 'foo' }),
    ).not.toThrow();
  });
});
