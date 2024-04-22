import md5 from 'md5';
import { handleCommonFields } from '../../../src/integrations/Criteo/utils'

describe('handleCommonFields', () => {
  const inputEvent = {
    message: {
      userId: 'u1',
      anonymousId: 'a1',
      properties: {
        email: 'abc@gmail.com'
      }
    }
  }
  const defaultExpected = [
    { event: 'setCustomerId', id: md5('u1').toString() },
    { event: 'setRetailerVisitorId', id: md5('a1').toString() },
  ]
  const tcs = [
    {
      description: 'when properties.email is present, for md5 hashmethod the relevant mapping should be included',
      inputEvent,
      hashMethod: 'md5',
      expected: [{
        email: '70b03db954aa45fc2559e85f5d5bd13e',
        hash_method: 'md5',
        event: 'setEmail'
      }]
    },
    {
      description: 'when properties.email is present, for sha256 hashmethod the relevant mapping should be included',
      inputEvent,
      hashMethod: 'sha256',
      expected: [{
        email: '75f4499b59200d38f057e967e297590ab2ebaad09283ddcb3e66ffb1f1a9f395',
        hash_method: 'sha256',
        event: 'setEmail'
      }]
    },
    {
      description: 'when properties.email is present, for random hashmethod the relevant mapping should be included',
      inputEvent,
      hashMethod: 'random',
      expected: [{
        email: 'a@gmail.com',
        hash_method: 'random',
        event: 'setEmail'
      }]
    },
  ]
  test.each(tcs)('$description', ({inputEvent, hashMethod, expected}) => {
    const out = handleCommonFields(inputEvent, hashMethod)
    expect(out).toEqual([...defaultExpected, ...expected])
  })
})