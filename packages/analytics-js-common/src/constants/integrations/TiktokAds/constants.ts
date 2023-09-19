const DIR_NAME = 'TiktokAds';
const NAME = 'TIKTOK_ADS';
const DISPLAY_NAME = 'TikTok Ads';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  TiktokAds: NAME,
  'Tiktok ads': NAME,
  'Tiktok Ads': NAME,
  'Tik Tok Ads': NAME,
  'tik tok ads': NAME,
  tiktokads: NAME,
};
const PARTNER_NAME = 'RudderStack';

const trackMapping = [
  {
    destKey: 'event_id',
    sourceKeys: ['properties.eventId', 'properties.event_id', 'messageId'],
  },
  {
    destKey: 'test_event_code',
    sourceKeys: 'testEventCode',
  },
  {
    destKey: 'contents',
    sourceKeys: 'properties.contents',
  },
  {
    destKey: 'content_category',
    sourceKeys: 'properties.category',
  },
  {
    destKey: 'status',
    sourceKeys: 'properties.status',
  },
  {
    destKey: 'content_name',
    sourceKeys: 'properties.name',
  },
  {
    destKey: 'content_id',
    sourceKeys: ['properties.product_id', 'properties.productId'],
  },
  {
    destKey: 'content_type',
    sourceKeys: ['properties.contentType', 'properties.content_type'],
  },
  {
    destKey: 'currency',
    sourceKeys: 'properties.currency',
  },
  {
    destKey: 'value',
    sourceKeys: 'properties.value',
  },
  {
    destKey: 'description',
    sourceKeys: 'properties.description',
  },
  {
    destKey: 'email',
    sourceKeys: ['context.traits.email', 'traits.email', 'properties.email'],
  },
  {
    destKey: 'phone',
    sourceKeys: ['context.traits.phone', 'traits.phone', 'properties.phone'],
  },
];
const eventNameMapping = {
  'product added to wishlist': 'AddToWishlist',
  'product added': 'AddToCart',
  'checkout started': 'InitiateCheckout',
  'payment info entered': 'AddPaymentInfo',
  'checkout step completed': 'CompletePayment',
  'order completed': 'PlaceAnOrder',
  viewcontent: 'ViewContent',
  clickbutton: 'ClickButton',
  search: 'Search',
  contact: 'Contact',
  download: 'Download',
  submitform: 'SubmitForm',
  completeregistration: 'CompleteRegistration',
  subscribe: 'Subscribe',
};

export {
  NAME,
  CNameMapping,
  PARTNER_NAME,
  trackMapping,
  eventNameMapping,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
};
