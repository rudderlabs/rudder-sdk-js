describe("Tests for SDK load and API calls", () => {
  const xhrMock = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    responseText: JSON.stringify({}),
    status: 200,
  };

  describe("Tests for queued API calls", () => {
    it("If SDK script is 'required' (imported), then check that it is loaded and queued API calls are processed", () => {
      rudderanalytics.page();
      require("./prodsdk.js");

      expect(global.rudderanalytics.push).not.toBe(Array.prototype.push);

      // one source config endpoint call and one implicit page call
      // Refer to above 'beforeEach'
      expect(xhrMock.send).toHaveBeenCalledTimes(2);
    });
  });

  beforeAll(() => {
    window.XMLHttpRequest = jest.fn(() => xhrMock);

    document.head.innerHTML = ` `;
    rudderanalytics = window.rudderanalytics = [];
    for (
      var methods = [
          "load",
          "page",
          "track",
          "alias",
          "group",
          "identify",
          "ready",
          "reset",
        ],
        i = 0;
      i < methods.length;
      i++
    ) {
      var method = methods[i];
      rudderanalytics[method] = (function (d) {
        return function () {
          rudderanalytics.push([d, ...arguments]);
        };
      })(method);
    }
    rudderanalytics.load(
      "1d4Qof5j9WqTuFhvUkmLaHe4EV3",
      "https://hosted.rudderlabs.com"
    );
  });

  beforeEach(() => {
    require("./prodsdk.js");
  });

  it("If APIs are called, then appropriate network requests are made", () => {
    rudderanalytics.page();
    rudderanalytics.track("test-event");
    rudderanalytics.identify("jest-user");
    rudderanalytics.group("jest-group");
    rudderanalytics.alias("new-jest-user", "jest-user");

    expect(xhrMock.send).toHaveBeenCalledTimes(5);
  });

  it("If 'getAnonymousId' API is invoked, then the return value conforms to the UUID format", () => {
    const anonId = rudderanalytics.getAnonymousId();

    const uuidRegEx =
      /^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    expect(anonId).toMatch(uuidRegEx);
  });
});
