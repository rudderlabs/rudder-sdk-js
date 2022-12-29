const NAME = 'FACEBOOK_PIXEL';
const CNameMapping = {
  [NAME]: NAME,
  'FB Pixel': NAME,
  'Facebook Pixel': NAME,
  'facebook pixel': NAME,
  fbpixel: NAME,
  FBPIXEL: NAME,
  FB_PIXEL: NAME,
};

const traitsMapper = [
  {
    destKey: 'external_id',
    sourceKeys: ['userId', 'context.traits.userId', 'context.traits.id', 'anonymousId'],
  },
  {
    destKey: 'em',
    sourceKeys: 'context.traits.email',
  },
  {
    destKey: 'ph',
    sourceKeys: 'context.traits.phone',
  },
  {
    destKey: 'ge',
    sourceKeys: 'context.traits.gender',
  },
  {
    destKey: 'db',
    sourceKeys: 'context.traits.birthday',
  },
  {
    destKey: 'ln',
    sourceKeys: ['context.traits.lastname', 'context.traits.lastName', 'context.traits.last_name'],
  },
  {
    destKey: 'fn',
    sourceKeys: [
      'context.traits.firstname',
      'context.traits.firstName',
      'context.traits.first_name',
    ],
  },
  {
    destKey: 'ct',
    sourceKeys: ['context.traits.address.city', 'context.traits.city'],
  },
  {
    destKey: 'st',
    sourceKeys: ['context.traits.address.state', 'context.traits.state'],
  },
  {
    destKey: 'zp',
    sourceKeys: ['context.traits.address.zip', 'context.traits.zip'],
  },
  {
    destKey: 'country',
    sourceKeys: ['context.traits.address.country', 'context.traits.country'],
  },
];

const reserveTraits = [
  'email',
  'lastName',
  'firstName',
  'phone',
  'external_id',
  'city',
  'birthday',
  'gender',
  'street',
  'zip',
  'country',
];

export { traitsMapper, CNameMapping, NAME, reserveTraits };
