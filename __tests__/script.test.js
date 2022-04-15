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

  beforeEach(() => {
    jest.resetModules();

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
          "getUserTraits",
          "getAnonymousId",
          "getUserId",
          "setAnonymousId",
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
    rudderanalytics.load("WRITE_KEY", "DATA_PLANE_URL");
    require("./prodsdk.js");
  });

  it("If SDK script is 'required' (imported), then check that it is loaded and queued API calls are processed", () => {
    // Only done for this case to test the
    // API calls queuing functionality
    jest.resetModules();
    rudderanalytics.page();
    require("./prodsdk.js");

    expect(global.rudderanalytics.push).not.toBe(Array.prototype.push);

    // one source config endpoint call and one implicit page call
    // Refer to above 'beforeEach'
    expect(xhrMock.send).toHaveBeenCalledTimes(2);
  });

  it("If APIs are called, then appropriate network requests are made", () => {
    rudderanalytics.page();
    rudderanalytics.track("test-event");
    rudderanalytics.identify("jest-user");
    rudderanalytics.group("jest-group");
    rudderanalytics.alias("new-jest-user", "jest-user");

    // one source config endpoint call and above API requests
    expect(xhrMock.send).toHaveBeenCalledTimes(6);
  });

  it("If 'getAnonymousId' API is invoked, then the return value conforms to the UUID format", () => {
    const anonId = rudderanalytics.getAnonymousId();

    const uuidRegEx =
      /^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    expect(anonId).toMatch(uuidRegEx);
  });
});
