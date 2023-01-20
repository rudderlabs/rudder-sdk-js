import LemniskMarketingAutomation from "../../../src/integrations/Lemnisk";

beforeAll(() => { });

afterAll(() => {
  jest.restoreAllMocks();
});
describe('lemnisk init tests', () => {
  let lemnisk;

  test('Testing init call of Google Ads with ConversionId', () => {
    lemnisk = new LemniskMarketingAutomation({ accountId: "12567839", writeKey: "04789yt8rfhbkwjenkl"}, {loglevel: "debug"});
    lemnisk.init();
    expect(typeof window.lmSMTObj).toBe('object');
  });
});

describe("lemnisk page", () => {
  let lemnisk;
  beforeEach(() => {
    lemnisk = new LemniskMarketingAutomation({ accountId: "12567839", writeKey: "04789yt8rfhbkwjenkl"},{loglevel: "debug"});
    lemnisk.init();
    window.lmSMTObj.page = jest.fn();
  });

  test("send pageview", () => {
    lemnisk.page({
      message: {
        context: {},
        properties: {
          category: "test cat",
          path: "/test",
          url: "http://localhost",
          referrer: "",
          title: "test page",
          testDimension: "abc"
        },
      },
    });
     console.log(JSON.stringify(window.lmSMTObj.page.mock.calls)); // this has set with empty {} object when resetCustomDimensions
     expect(window.lmSMTObj.page.mock.calls[0][0]).toEqual({
      "category": "test cat",
      "path": "/test",
      "url": "http://localhost",
      "referrer": "",
      "title": "test page",
      "testDimension": "abc"
    });
  });
});

describe("Lemnisk Track event", () => {
  let lemnisk;
  beforeEach(() => {
    lemnisk = new LemniskMarketingAutomation({ accountId: "12567839", writeKey: "04789yt8rfhbkwjenkl"},{loglevel: "DEBUG"});
    lemnisk.init();
    window.lmSMTObj.track = jest.fn();
  });
  test("Testing Track Custom Events", () => {
    
    lemnisk.track({
      message: {
        context: {},
        event: "Custom",
        properties: {
          "customProp": "testProp",
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: "transactionId",
          value: 35.00,
          shipping: 4.00,
          coupon: 'APPARELSALE',
          currency: 'GBP',
          products: [
              {
                "customPropProd": "testPropProd",
                product_id: 'abc',
                  category: 'Merch',
                  name: 'Food/Drink',
                  brand: '',
                  variant: 'Extra topped',
                  price: 3.00,
                  quantity: 2,
                  currency: 'GBP',
                  position: 1,
                  value: 6.00,
                  typeOfProduct: 'Food',
                  url: 'https://www.example.com/product/bacon-jam',
                  image_url: 'https://www.example.com/product/bacon-jam.jpg'
              }
           ]
      },
    }
    });
    console.log(JSON.stringify(window.lmSMTObj.track.mock.calls));
    expect(window.lmSMTObj.track.mock.calls[0][0]).toEqual("Custom");
    expect(window.lmSMTObj.track.mock.calls[0][1]).toEqual( {
      "customProp": "testProp",
      checkout_id: 'what is checkout id here??',
      event_id: 'purchaseId',
      order_id: "transactionId",
      value: 35.00,
      shipping: 4.00,
      coupon: 'APPARELSALE',
      currency: 'GBP',
      products: [
          {
            "customPropProd": "testPropProd",
            product_id: 'abc',
              category: 'Merch',
              name: 'Food/Drink',
              brand: '',
              variant: 'Extra topped',
              price: 3.00,
              quantity: 2,
              currency: 'GBP',
              position: 1,
              value: 6.00,
              typeOfProduct: 'Food',
              url: 'https://www.example.com/product/bacon-jam',
              image_url: 'https://www.example.com/product/bacon-jam.jpg'
          }
       ]
  });

  });
});



