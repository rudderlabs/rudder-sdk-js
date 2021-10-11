test("Check SDK is loaded as object and api calls reaching to hit network", () => {
  const xhrMock = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onreadystatechange: jest.fn(),
    send: jest.fn(),
    readyState: 4,
    responseText: JSON.stringify({}),
    status: 200
  };

  window.XMLHttpRequest = jest.fn(() => xhrMock);

  document.head.innerHTML = `
    `;
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
        "reset"
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
  ),
    rudderanalytics.page();

  require("./prodsdk.js");

  console.log(rudderanalytics);

  rudderanalytics.page();
  rudderanalytics.track("test-event");
  rudderanalytics.identify("jest-user");

  // check the sdk loaded successfully
  expect(global.rudderanalytics.push).not.toBe(Array.prototype.push);
  // one source config endpoint call, one implicit page call, three explicit calls
  expect(xhrMock.send).toHaveBeenCalledTimes(5);
});
