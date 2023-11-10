import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Amplitude/constants';
import {
  getTraitsToSetOnce,
  getTraitsToIncrement,
  getDestinationOptions,
} from '../../../src/integrations/Amplitude/utils';

describe('getTraitsToSetOnce', () => {
  // Returns an empty array when no traitsToSetOnce are provided in the config object
  it('should return an empty array when no traitsToSetOnce are provided in the config object', () => {
    const config = {};
    const result = getTraitsToSetOnce(config);
    expect(result).toEqual([]);
  });

  // Returns an array of traits when traitsToSetOnce are provided in the config object
  it('should return an array of traits when traitsToSetOnce are provided in the config object', () => {
    const config = {
      traitsToSetOnce: [{ traits: { name: 'John' } }, { traits: { age: 25 } }],
    };
    const result = getTraitsToSetOnce(config);
    expect(result).toEqual([{ name: 'John' }, { age: 25 }]);
  });

  // Filters out elements with empty traits and returns an array of non-empty traits
  it('should not filter out elements with empty traits', () => {
    const config = {
      traitsToSetOnce: [
        { traits: { name: 'John' } },
        { traits: {} },
        { traits: { age: 25 } },
        { traits: {} },
      ],
    };
    const result = getTraitsToSetOnce(config);
    expect(result).toEqual([{ name: 'John' }, {}, { age: 25 }, {}]);
  });

  // Returns an empty array when config object is not provided
  it('should return an empty array when config object is not provided', () => {
    try {
      getTraitsToSetOnce();
    } catch (err) {
      expect(err).toEqual(
        new TypeError("Cannot read properties of undefined (reading 'traitsToSetOnce')"),
      );
    }
  });

  // Returns an empty array when traitsToSetOnce is not an array in the config object
  it('should return an empty array when traitsToSetOnce is not an array in the config object', () => {
    const config = {
      traitsToSetOnce: 'not an array',
    };
    try {
      getTraitsToSetOnce(config);
    } catch (err) {
      expect(err).toEqual(new TypeError('config.traitsToSetOnce.forEach is not a function'));
    }
  });

  // Returns an empty array when all elements in traitsToSetOnce have empty traits
  it('should return an empty array when all elements in traitsToSetOnce have empty traits', () => {
    const config = {
      traitsToSetOnce: [{ traits: {} }, { traits: {} }, { traits: {} }],
    };
    const result = getTraitsToSetOnce(config);
    expect(result).toEqual([{}, {}, {}]);
  });
});

describe('getTraitsToIncrement', () => {
  it('should return an empty array when config.traitsToIncrement is undefined', () => {
    const config = {};
    const result = getTraitsToIncrement(config);
    expect(result).toEqual([]);
  });
  it('should return an array of traits when config.traitsToIncrement is defined and contains at least one element with a non-empty traits property', () => {
    const config = {
      traitsToIncrement: [{ traits: 'trait1' }, { traits: 'trait2' }],
    };
    const result = getTraitsToIncrement(config);
    expect(result).toEqual(['trait1', 'trait2']);
  });

  it('should return an empty array when config.traitsToIncrement is defined but contains no elements with a non-empty traits property', () => {
    const config = {
      traitsToIncrement: [{ traits: '' }, { traits: null }, { traits: undefined }],
    };
    const result = getTraitsToIncrement(config);
    expect(result).toEqual([]);
  });
});

describe('getDestinationOptions', () => {
  // Returns destination specific options for the given integrations options object using its display name
  it('should return destination specific options for the given integrations options object using its display name', () => {
    const integrationsOptions = {
      [DISPLAY_NAME]: { option1: 'value1', option2: 'value2' },
      [NAME]: { option3: 'value3', option4: 'value4' },
    };

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toEqual({ option1: 'value1', option2: 'value2' });
  });

  // Returns destination specific options for the given integrations options object using its name if display name is not present
  it('should return destination specific options for the given integrations options object using its name if display name is not present', () => {
    const integrationsOptions = {
      [NAME]: { option3: 'value3', option4: 'value4' },
    };

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toEqual({ option3: 'value3', option4: 'value4' });
  });

  // Returns null if integrations options object is null or undefined
  it('should return null if integrations options object is null', () => {
    const integrationsOptions = null;

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toBeNull();
  });

  // Returns null if integrations options object is an empty object
  it('should return null if integrations options object is an empty object', () => {
    const integrationsOptions = {};

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toEqual(undefined);
  });

  // Returns null if integrations options object does not have options for the given destination
  it('should return null if integrations options object does not have options for the given destination', () => {
    const integrationsOptions = {
      [DISPLAY_NAME]: { option1: 'value1', option2: 'value2' },
    };

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toEqual({ option1: 'value1', option2: 'value2' });
  });

  // Returns options for the destination using its name if display name is not present and name is not 'AM'
  it("should return options for the destination using its name if display name is not present and name is not 'AM'", () => {
    const integrationsOptions = {
      [NAME]: { option3: 'value3', option4: 'value4' },
    };

    const result = getDestinationOptions(integrationsOptions);

    expect(result).toEqual({ option3: 'value3', option4: 'value4' });
  });
});
