import { getDestinationEventName } from '../../../src/integrations/PinterestTag/utils';
import { eventMapping } from './__fixtures__/data';

describe('Get destination event name utility tests', () => {
  test('Test for UI mapped event', () => {
    const eventName = getDestinationEventName('ABC Searched', eventMapping, false);
    expect(eventName).toEqual(['WatchVideo', 'ViewCategory']);
  });

  test('Test for unmapped event with sendAsCustomEvent enabled', () => {
    const eventName = getDestinationEventName('Login', eventMapping, true);
    expect(eventName).toEqual(['Custom']);
  });

  test('Test for unmapped event with sendAsCustomEvent disabled', () => {
    const eventName = getDestinationEventName('Login', eventMapping, false);
    expect(eventName).toEqual(['Login']);
  });
});
