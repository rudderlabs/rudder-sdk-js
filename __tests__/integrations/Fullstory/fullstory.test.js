import Fullstory from "../../../src/integrations/Fullstory";

beforeAll(() => { });

afterAll(() => {
    jest.restoreAllMocks();
});
describe('FullStory init tests', () => {
    let fullstory;

    test('Testing init call of FullStory', () => {
        fullstory = new Fullstory({ fs_org: "12567839", fs_debug_mode: true, fs_host: "localhost" }, { loglevel: "debug", loadOnlyIntegrations: {} });
        fullstory.init();
        expect(typeof window.FS).toBe('function');
    });
});

describe("Fullstory page", () => {
    let fullstory;
    beforeEach(() => {
        fullstory = new Fullstory({ fs_org: "12567839", fs_debug_mode: true, fs_host: "localhost" }, { loglevel: "debug", loadOnlyIntegrations: {} });
        window.FS.event = jest.fn();
    });
    test("send pageview", () => {
        fullstory.page({
            message: {
                context: {},
                name: "test page",
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
        expect(window.FS.event.mock.calls[0]).toEqual(["Viewed a Page",{
            "category": "test cat",
            "name": "test page",
            "path": "/test",
            "url": "http://localhost",
            "referrer": "",
            "title": "test page",
            "testDimension": "abc"
        }]);
    });
});

describe("Fullstory Track event", () => {
    let fullstory;
    beforeEach(() => {
        fullstory = new Fullstory({ fs_org: "12567839", fs_debug_mode: true, fs_host: "localhost" }, { loglevel: "debug" });
        window.FS.event = jest.fn();
    });
    test("Testing Track Custom Events", () => {
        fullstory.track({
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
        expect(window.FS.event.mock.calls[0][0]).toEqual("Custom");
        expect(window.FS.event.mock.calls[0][1]).toEqual({
            "customProp": "testProp",
            checkoutId: 'what is checkout id here??',
            eventId: 'purchaseId',
            orderId: "transactionId",
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
describe("Fullstory Identify event", () => {
    let fullstory;
    beforeEach(() => {
        fullstory = new Fullstory({ fs_org: "12567839", fs_debug_mode: true, fs_host: "localhost" }, { loglevel: "debug" }); 
        fullstory.analytics.loadOnlyIntegrations = {};
        window.FS.identify = jest.fn();
    });
    test("Testing Identify Custom Events", () => {

        fullstory.identify({
            message: {
                "userId": "rudder01",
                context: {
                    traits: {
                        email: "abc@ruddertack.com"
                    }
                },

            }
        });
        expect(window.FS.identify.mock.calls[0][0]).toEqual("rudder01");
        expect(window.FS.identify.mock.calls[0][1]).toEqual({
            email: "abc@ruddertack.com"
        });

    });
});
