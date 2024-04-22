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
        email: '3f009d72559f51e7e454b16e5d0687a1',
        hash_method: 'md5',
        event: 'setEmail'
      }]
    },
    {
      description: 'when properties.email is present, for sha256 hashmethod the relevant mapping should be included',
      inputEvent,
      hashMethod: 'sha256',
      expected: [{
        email: '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
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