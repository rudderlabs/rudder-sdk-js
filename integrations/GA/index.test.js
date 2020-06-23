import { GA } from "./browser";

beforeAll(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

GA.prototype.loadScript = jest.fn();

describe("GA init tests", () => {
  let googleAnalytics;
  beforeEach(() => {
    googleAnalytics = new GA({ trackingID: "UA-143161493-8" });
    googleAnalytics.init();
  });

  test("GA init default config test time", () => {
    // const googleAnalytics = new GA({ trackingID: "UA-143161493-8" });
    // googleAnalytics.init();
    expect(typeof window.ga.l).toBe("number");
  });

  test("GA init default config test create and require", () => {
    expect(window.GoogleAnalyticsObject).toEqual("ga");
    expect(typeof window.ga).toBe("function");
    expect(typeof window.ga.l).toBe("number");
    // expect(window.ga.q[0]).toEqual();
    expect(window.ga.q[0][0]).toEqual("create");
    expect(window.ga.q[0][1]).toEqual("UA-143161493-8");
    expect(window.ga.q[0][2]).toEqual({
      cookieDomain: "auto",
      siteSpeedSampleRate: 1,
      sampleRate: 100,
      allowLinker: true,
      useAmpClientId: false,
    });
    expect(window.ga.q[1][0]).toEqual("require");
    expect(window.ga.q[1][1]).toEqual("ecommerce");
  });

  describe("GA page", () => {
    let googleAnalytics;
    beforeEach(() => {
      googleAnalytics = new GA({
        trackingID: "UA-143161493-8",
        dimensions: [],
        metrics: [],
        contentGroupings: [],
      });
      googleAnalytics.init();
      window.ga = jest.fn();
    });

    test("send pageview", () => {
      googleAnalytics.page({
        message: {
          context: {},
          properties: {
            category: "test cat",
            path: "/test",
            url: "http://localhost",
            referrer: "",
            title: "test page",
          },
        },
      });
      // console.log(JSON.stringify(window.ga.mock.calls)); // this has set with empty {} object when resetCustomDimensions

      expect(window.ga.mock.calls[2][0]).toEqual("send");
      expect(window.ga.mock.calls[2][1]).toEqual("pageview");

      // it has a pageview as a top level key..expected??
      expect(window.ga.mock.calls[2][2]).toEqual({
          page: "/test",
          title: "test cat",
          location: "http://localhost",
      });

      // TODO: call another page, check location not set
    });
  });

  describe("GA simple non ecomm event", () => {
    let googleAnalytics;
    beforeEach(() => {
      googleAnalytics = new GA({
        trackingID: "UA-143161493-8",
        dimensions: [],
        metrics: [],
        contentGroupings: [],
      });
      googleAnalytics.init();
      window.ga = jest.fn();
    });

    test("send track call interaction and default category", () => {
      googleAnalytics.track({
        message: {
          context: {},
          event: "test track",
          properties: {
            value: 20,
            label: "test label",
          },
        },
      });
      // console.log(JSON.stringify(window.ga.mock.calls));

      expect(window.ga.mock.calls[0][0]).toEqual("send");
      expect(window.ga.mock.calls[0][1]).toEqual("event");

      expect(window.ga.mock.calls[0][2]).toEqual({
          eventCategory: "All",
          eventAction: "test track",
          eventLabel: "test label",
          eventValue: 20,
          nonInteraction: false,
      });
    });

    test("send track call non-interaction and explicit category", () => {
      googleAnalytics.track({
        message: {
          context: {},
          event: "test track",
          properties: {
            category: "test cat",
            value: 20,
            label: "test label",
            nonInteraction: 1,
          },
        },
      });
      // console.log(JSON.stringify(window.ga.mock.calls));

      expect(window.ga.mock.calls[0][0]).toEqual("send");
      expect(window.ga.mock.calls[0][1]).toEqual("event");

      expect(window.ga.mock.calls[0][2]).toEqual({
          eventCategory: "test cat",
          eventAction: "test track",
          eventLabel: "test label",
          eventValue: 20,
          nonInteraction: true,
      });
    });
  });
});
