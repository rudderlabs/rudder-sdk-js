const productAdded = 'Product Added';
const orderCompleted = 'Order Completed';
const mockConversionId = 'AW-11071053757';
const mockOrderId = '771c04b-2cb8-41dd-9609-330b37bcc62c';

const mockEvents = [
  { eventName: 'Product Viewed' },
  { eventName: orderCompleted },
  { eventName: 'Sign Up' },
  { eventName: 'Lead' },
];

const mockEventTypeConversions = [
  { conversionLabel: '15klCKLCs4gYETIBi58p', name: 'Sign Up' },
  { conversionLabel: '9Hr5CKXCs4gYETIBi58p', name: 'Page View' },
  { conversionLabel: 'TCBjCKjCs4gYETIBi58p', name: orderCompleted },
  { conversionLabel: 'KhF2CKvCs4gYETIBi58p', name: productAdded },
];

const googleAdsConfigs = [
  {
    conversionID: mockConversionId,
    conversionLinker: true,
    defaultPageConversion: '9Hr5CKXCs4gYEIXBi58p',
    disableAdPersonalization: false,
    eventFilteringOption: 'disable',
    sendPageView: true,
    trackConversions: true,
    trackDynamicRemarketing: true,
    enableConversionEventsFiltering: false,
    enableDynamicRemarketingEventsFiltering: false,
    eventsToTrackConversions: [{ eventName: productAdded }],
    eventsToTrackDynamicRemarketing: [{ eventName: 'Product Added To The List' }],
    eventMappingFromConfig: [
      { from: 'Sign Up', to: 'Signup' },
      { to: 'Lead', from: orderCompleted },
      { from: 'Page View', to: 'PageVisit' },
      { from: productAdded, to: 'AddToCart' },
    ],
    clickEventConversions: [
      { conversionLabel: '15klCKLCs4gYEIXBi58p', name: 'Sign Up' },
      { conversionLabel: '9Hr5CKXCs4gYEIXBi58p', name: 'Page View' },
      { conversionLabel: 'TCBjCKjCs4gYEIXBi58p', name: orderCompleted },
      { conversionLabel: 'KhF2CKvCs4gYEIXBi58p', name: productAdded },
    ],
  },
  {
    conversionID: mockConversionId,
    conversionLinker: true,
    defaultPageConversion: '9Hr5CKXCs4gYEIXBi58p',
    disableAdPersonalization: false,
    eventFilteringOption: 'disable',
    sendPageView: true,
    trackConversions: true,
    trackDynamicRemarketing: false,
    enableConversionEventsFiltering: false,
    enableDynamicRemarketingEventsFiltering: false,
    eventsToTrackConversions: [{ eventName: productAdded }],
    eventsToTrackDynamicRemarketing: [{ eventName: 'Product Added To The List' }],
    eventMappingFromConfig: [
      { from: 'Sign Up', to: 'Signup' },
      { to: 'Lead', from: orderCompleted },
      { from: 'Page View', to: 'PageVisit' },
      { from: productAdded, to: 'AddToCart' },
    ],
    clickEventConversions: [
      { conversionLabel: '15klCKLCs4gYEIXBi58p', name: 'Sign Up' },
      { conversionLabel: '9Hr5CKXCs4gYEIXBi58p', name: 'Page View' },
      { conversionLabel: 'TCBjCKjCs4gYEIXBi58p', name: orderCompleted },
      { conversionLabel: 'KhF2CKvCs4gYEIXBi58p', name: productAdded },
    ],
  },
  {
    conversionID: mockConversionId,
    conversionLinker: true,
    defaultPageConversion: '9Hr5CKXCs4gYEIXBi58p',
    disableAdPersonalization: false,
    eventFilteringOption: 'disable',
    sendPageView: true,
    trackConversions: false,
    trackDynamicRemarketing: true,
    enableConversionEventsFiltering: false,
    enableDynamicRemarketingEventsFiltering: false,
    eventsToTrackConversions: [{ eventName: productAdded }],
    eventsToTrackDynamicRemarketing: [{ eventName: 'Product Added To The List' }],
    eventMappingFromConfig: [
      { from: 'Sign Up', to: 'Signup' },
      { to: 'Lead', from: orderCompleted },
      { from: 'Page View', to: 'PageVisit' },
      { from: productAdded, to: 'AddToCart' },
    ],
    clickEventConversions: [
      { conversionLabel: '15klCKLCs4gYEIXBi58p', name: 'Sign Up' },
      { conversionLabel: '9Hr5CKXCs4gYEIXBi58p', name: 'Page View' },
      { conversionLabel: 'TCBjCKjCs4gYEIXBi58p', name: orderCompleted },
      { conversionLabel: 'KhF2CKvCs4gYEIXBi58p', name: productAdded },
    ],
  },
  {
    conversionID: mockConversionId,
    conversionLinker: true,
    defaultPageConversion: '9Hr5CKXCs4gYEIXBi58p',
    disableAdPersonalization: false,
    eventFilteringOption: 'disable',
    sendPageView: true,
    trackConversions: true,
    trackDynamicRemarketing: true,
    enableConversionEventsFiltering: true,
    enableDynamicRemarketingEventsFiltering: true,
    eventsToTrackConversions: [{ eventName: orderCompleted }],
    eventsToTrackDynamicRemarketing: [{ eventName: 'Product Added To The List' }],
    eventMappingFromConfig: [
      { from: 'Sign Up', to: 'Signup' },
      { to: 'Lead', from: orderCompleted },
      { from: 'Page View', to: 'PageVisit' },
      { from: productAdded, to: 'AddToCart' },
    ],
    clickEventConversions: [
      { conversionLabel: '15klCKLCs4gYEIXBi58p', name: 'Sign Up' },
      { conversionLabel: '9Hr5CKXCs4gYEIXBi58p', name: 'Page View' },
      { conversionLabel: 'TCBjCKjCs4gYEIXBi58p', name: orderCompleted },
      { conversionLabel: 'KhF2CKvCs4gYEIXBi58p', name: productAdded },
    ],
  },
];

const googleAdsTrack = 'Google Ads Track';

const trackCallPayload = {
  message: {
    context: {},
    event: orderCompleted,
    properties: {
      event_id: 'purchaseId',
      order_id: mockOrderId,
      value: 35.0,
      shipping: 4.0,
      currency: 'IND',
      products: [
        {
          product_id: 'abc',
          category: 'Merch',
          name: 'Food/Drink',
          brand: '',
          variant: 'Extra topped',
          price: 3.0,
          quantity: 2,
          currency: 'GBP',
          typeOfProduct: 'Food',
        },
      ],
    },
  },
};

export {
  mockEvents,
  mockOrderId,
  productAdded,
  orderCompleted,
  googleAdsTrack,
  googleAdsConfigs,
  trackCallPayload,
  mockConversionId,
  mockEventTypeConversions,
};
