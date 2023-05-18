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
    key: 'message.context.library.name', // TODO: remove this entry once we solve the bug of overriding the library name
    type: 'string',
  },
  {
    key: 'message.context.locale',
    type: 'string',
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
    key: 'message.sentAt',
    type: 'string',
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
    key: `message.integrations.Google Analytics 4.sessionId`,
    type: 'string',
  },
  {
    key: `message.integrations.Google Analytics 4.clientId`,
    type: 'string',
  },
  {
    key: `message.integrations.Google Analytics 4.sessionNumber`,
    type: 'number',
  },
];

export { ignoredProperties };
