const NAME = "FACEBOOK_PIXEL";
const CNameMapping = {
  [NAME]: NAME,
  "FB Pixel": NAME,
  "Facebook Pixel": NAME,
  FB_PIXEL: NAME,
};

const traitsMapper = [
  {
    destKey: "external_id",
    sourceKeys: [
      "userId",
      "traits.userId",
      "traits.id",
      "context.traits.userId",
      "context.traits.id",
      "anonymousId",
    ],
  },
  {
    destKey: "em",
    sourceKeys: ["context.traits.email", "traits.email"],
  },
  {
    destKey: "ph",
    sourceKeys: ["context.traits.phone", "traits.phone"],
  },
  {
    destKey: "ge",
    sourceKeys: ["context.traits.gender", "traits.gender"],
  },
  {
    destKey: "db",
    sourceKeys: ["context.traits.birthday", "traits.birthday"],
  },
  {
    destKey: "ln",
    sourceKeys: [
      "context.traits.lastname",
      "context.traits.lastName",
      "context.traits.last_name",
      "traits.lastname",
      "traits.lastName",
      "traits.last_name",
    ],
  },
  {
    destKey: "fn",
    sourceKeys: [
      "context.traits.firstname",
      "context.traits.firstName",
      "context.traits.first_name",
      "traits.firstname",
      "traits.firstName",
      "traits.first_name",
    ],
  },
  {
    destKey: "ct",
    sourceKeys: ["context.traits.address.city", "traits.address.city"],
  },
  {
    destKey: "st",
    sourceKeys: ["context.traits.address.state", "traits.address.state"],
  },
  {
    destKey: "zp",
    sourceKeys: ["context.traits.address.zip", "traits.address.zip"],
  },
  {
    destKey: "country",
    sourceKeys: ["context.traits.address.country", "traits.address.country"],
  },
];

export { traitsMapper, CNameMapping, NAME };
