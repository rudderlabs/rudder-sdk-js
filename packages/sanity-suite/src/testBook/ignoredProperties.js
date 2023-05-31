const ignoredProperties = [
  {
    key: 'message.context.app.version',
    type: 'string',
  },
  {
    key: 'message.context.device.id',
    type: 'string',
  },
  {
    key: 'message.context.library.version',
    type: 'string',
  },
  {
    key: 'message.context.locale',
    type: 'string',
  },
  {
    key: 'message.context.network',
    type: 'string',
    optional: true,
  },
  {
    key: 'message.context.userAgent',
    type: 'string',
  },
  {
    key: 'message.context.sessionId',
    type: 'number',
  },
  {
    key: 'message.context.sessionStart',
    type: 'boolean',
  },
  {
    key: 'message.context.page.tab_url',
    type: 'string',
  },
  {
    key: 'message.context.page.url',
    type: 'string',
  },
  {
    key: 'message.context.page.path',
    type: 'string',
  },
  {
    key: 'message.context.page.referrer',
    type: 'string',
  },
  {
    key: 'message.context.page.referring_domain',
    type: 'string',
  },
  {
    key: 'message.context.page.initial_referrer',
    type: 'string',
  },
  {
    key: 'message.context.page.initial_referring_domain',
    type: 'string',
  },
  {
    key: 'message.context.screen.density',
    type: 'number',
    optional: true,
  },
  {
    key: 'message.context.screen.height',
    type: 'number',
  },
  {
    key: 'message.context.screen.innerHeight',
    type: 'number',
  },
  {
    key: 'message.context.screen.innerWidth',
    type: 'number',
  },
  {
    key: 'message.context.screen.width',
    type: 'number',
  },
  {
    key: 'message.messageId',
    type: 'string',
  },
  {
    key: 'message.originalTimestamp',
    type: 'string',
  },
  {
    key: 'message.anonymousId',
    type: 'string',
  },
  {
    key: 'message.user_properties',
    type: 'object',
    optional: true,
  },
  {
    key: 'message.sentAt',
    type: 'string',
    optional: true,
  },
  {
    key: 'message.properties.referrer',
    type: 'string',
  },
  {
    key: 'message.properties.referring_domain',
    type: 'string',
  },
  {
    key: 'message.properties.initial_referrer',
    type: 'string',
  },
  {
    key: 'message.properties.initial_referring_domain',
    type: 'string',
  },
  {
    key: 'message.properties.path',
    type: 'string',
  },
  {
    key: 'message.properties.url',
    type: 'string',
  },
  {
    key: 'message.properties.tab_url',
    type: 'string',
  },
  {
    key: `message.integrations.Google Analytics 4`, // TODO: remove optional after we implement device mode destinations
    type: 'object',
    optional: true
  },
  {
    key: `message.integrations.Google Analytics 4.sessionId`, // TODO: remove optional after we implement device mode destinations
    type: 'number',
    optional: true
  },
  {
    key: `message.integrations.Google Analytics 4.clientId`, // TODO: remove optional after we implement device mode destinations
    type: 'string',
    optional: true
  },
  {
    key: `message.integrations.Google Analytics 4.sessionNumber`, // TODO: remove optional after we implement device mode destinations
    type: 'number',
    optional: true
  },
];

export { ignoredProperties };
