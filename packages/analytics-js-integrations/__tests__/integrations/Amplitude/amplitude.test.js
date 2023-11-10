/* eslint-disable no-underscore-dangle */
import Amplitude from '../../../src/integrations/Amplitude/browser';

const amplitudeConfig = {
  apiKey: 'abcde',
  groupTypeTrait: 'email',
  groupValueTrait: 'age',
  traitsToIncrement: [
    {
      traits: 'age',
    },
    {
      traits: 'friends',
    },
  ],
  traitsToSetOnce: [
    {
      traits: 'subjects',
    },
    {
      traits: '',
    },
  ],
  traitsToAppend: [
    {
      traits: 'name',
    },
    {
      traits: '',
    },
  ],
  traitsToPrepend: [
    {
      traits: 'experience',
    },
    {
      traits: '',
    },
  ],
};
const amplitudeEUConfig = {
  apiKey: 'abcde',
  residencyServer: 'EU',
  groupTypeTrait: 'email',
  groupValueTrait: 'age',
  traitsToIncrement: [
    {
      traits: 'age',
    },
    {
      traits: 'friends',
    },
  ],
};
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window._paq;
});
describe('Amplitude init tests', () => {
  test('Testing init call of Amplitude', () => {
    const amplitude = new Amplitude(
      amplitudeConfig,
      { loglevel: 'debug', loadIntegration: true },
      destinationInfo,
    );
    amplitude.init();
    // eslint-disable-next-line no-underscore-dangle
    expect(typeof window.amplitude).toBe('object');
  });
  test('Testing init call of Amplitude with EU residency set', () => {
    const amplitude = new Amplitude(
      amplitudeEUConfig,
      { loglevel: 'debug', loadIntegration: true },
      destinationInfo,
    );
    amplitude.init();
    // eslint-disable-next-line no-underscore-dangle
    expect(typeof window.amplitude).toBe('object');
    // eslint-disable-next-line no-underscore-dangle
    expect(amplitudeEUConfig.residencyServer).toBe('EU');
  });
});
