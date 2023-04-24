const eventMapping = [
  {
    from: 'ABC Searched',
    to: 'WatchVideo',
  },
  {
    from: 'ABC Searched',
    to: 'ViewCategory',
  },
];

const googleAdsConfigs = [
  {
    eventsMapping: eventMapping,
  },
  {
    sendAsCustomEvent: true,
  },
  {
    sendAsCustomEvent: false,
  },
];

export { eventMapping, googleAdsConfigs };
