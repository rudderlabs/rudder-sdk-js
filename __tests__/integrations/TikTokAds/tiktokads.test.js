import TiktokAds from "../../../src/integrations/TiktokAds/browser";

beforeAll(() => { });

afterAll(() => {
    jest.restoreAllMocks();
});
describe('tiktokads init tests', () => {
    let tiktokads;
    test('Testing init call of TiktokAds', () => {
        tiktokads = new TiktokAds({
            pixelCode: "12567839", eventsToStandard: [
                { from: 'Sign Up', to: 'Signup' },
                { to: 'Lead', from: 'orderCompleted' },
                { from: 'Page View', to: 'PageVisit' },
                { from: 'productAdded', to: 'AddToCart' },
            ]
        }, { loglevel: "debug" });
        tiktokads.init();
        expect(typeof window.ttq).toBe('object');
    });
});

describe("tiktokads page", () => {
    let tiktokads;
    beforeEach(() => {
        tiktokads = new TiktokAds({
            pixelCode: "12567839", eventsToStandard: [
                { from: 'Sign Up', to: 'Signup' },
                { to: 'Lead', from: 'orderCompleted' },
                { from: 'Page View', to: 'PageVisit' },
                { from: 'productAdded', to: 'AddToCart' },
            ]
        }, { loglevel: "debug" });
        tiktokads.init();
        window.ttq.page = jest.fn();
    });

    test("send pageview", () => {
        tiktokads.page({
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
        expect(window.ttq.page.mock.calls[0][0]).toEqual();
    });
});

describe("TiktokAds Track event", () => {
    let tiktokads;
    beforeEach(() => {
        tiktokads = new TiktokAds({
            pixelCode: "12567839", eventsToStandard: [
                { from: 'Sign Up', to: 'Signup' },
                { to: 'Lead', from: 'orderCompleted' },
                { from: 'Page View', to: 'PageVisit' },
                { from: 'Custom', to: 'AddToCart' },
            ]
        }, { loglevel: "DEBUG" });
        tiktokads.init();
        window.ttq.track = jest.fn();
    });
    test("Testing Track Custom Events", () => {
        tiktokads.track({
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
        expect(window.ttq.track.mock.calls[0][0]).toEqual("AddToCart");
        expect(window.ttq.track.mock.calls[0][1]).toEqual({
            value: 35.00,
            "currency": "GBP",
            "partner_name": "RudderStack",
            contents: [
                {
                    "content_category": "Merch",
                    "content_id": "abc",
                    "content_name": "Food/Drink",
                    "content_type": "product",
                    price: 3.00,
                    quantity: 2,

                }
            ]
        });
    });
});
describe("TiktokAds Identify event", () => {
    let tiktokads;
    beforeEach(() => {
        tiktokads = new TiktokAds({
            pixelCode: "12567839", eventsToStandard: [
                { from: 'Sign Up', to: 'Signup' },
                { to: 'Lead', from: 'orderCompleted' },
                { from: 'Page View', to: 'PageVisit' },
                { from: 'productAdded', to: 'AddToCart' },
            ]
        }, { loglevel: "DEBUG" });
        tiktokads.init();
        window.ttq.identify = jest.fn();
    });
    test("Testing Identify Custom Events", () => {

        tiktokads.identify({
            message: {
                "userId": "rudder01",
                context: {
                    traits: {
                        email: "abc@ruddertack.com"
                    }
                },

            }
        });
        expect(window.ttq.identify.mock.calls[0][0]).toEqual({ email: "abc@ruddertack.com" });
    });
});
