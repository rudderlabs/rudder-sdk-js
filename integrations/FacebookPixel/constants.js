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
    sourceKeys: ["traits.email", "context.traits.email"],
  },
  {
    destKey: "ph",
    sourceKeys: ["traits.phone", "context.traits.phone"],
  },
  {
    destKey: "ge",
    sourceKeys: ["traits.gender", "context.traits.gender"],
  },
  {
    destKey: "db",
    sourceKeys: ["traits.birthday", "context.traits.birthday"],
  },
  {
    destKey: "ln",
    sourceKeys: [
      "traits.lastname",
      "traits.lastName",
      "traits.last_name",
      "context.traits.lastname",
      "context.traits.lastName",
      "context.traits.last_name",
    ],
  },
  {
    destKey: "fn",
    sourceKeys: [
      "traits.firstname",
      "traits.firstName",
      "traits.first_name",
      "context.traits.firstname",
      "context.traits.firstName",
      "context.traits.first_name",
    ],
  },
  {
    destKey: "ct",
    sourceKeys: ["traits.address.city", "context.traits.address.city"],
  },
  {
    destKey: "st",
    sourceKeys: ["traits.address.state", "context.traits.address.state"],
  },
  {
    destKey: "zp",
    sourceKeys: ["traits.address.zip", "context.traits.address.zip"],
  },
  {
    destKey: "country",
    sourceKeys: ["traits.address.country", "context.traits.address.country"],
  },
];

export { traitsMapper, CNameMapping, NAME };
