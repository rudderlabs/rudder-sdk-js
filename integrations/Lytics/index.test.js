const Lytics = require("./browser");
const logger = require("../../utils/logUtil");

beforeAll(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

Lytics.prototype.loadScript = jest.fn();

describe("Lytics init tests", () => {
  let lytics;
  beforeEach(() => {
    lytics = new Lytics({ accountId: "Br3nwOFa770jaUKC7H5JJAxx" , stream: "stream_name",blockload:false,loadid:true});
    lytics.init();
  });
});
