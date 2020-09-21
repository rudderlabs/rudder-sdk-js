const querystring = require("querystring");
const { matchesUA } = require("browserslist-useragent");

exports.handler = async (event) => {
  const { request } = event.Records[0].cf;
  const { headers } = request;
  
  const params = querystring.parse(request.querystring.toLowerCase());

  const { transport } = params;

  const userAgent = headers["user-agent"][0].value;
  
  const isBeacon = transport == "beacon" ? true : false;
  
  console.log("UA and beacon in request : " + userAgent + isBeacon);

  console.log(JSON.stringify(request));

  // Setup the two different origins
  
  let origin = "/v2";
  
  let isModernUser = matchesUA(userAgent, {
    env: "modern",
    allowHigherVersions: true,
  });
  
  isModernUser = isModernUser && headers["user-agent"][0].value != "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
  
  console.log(`after internal computation moder user and isBeacon: ${isModernUser} ${isBeacon}`);
  
  if(isModernUser) {
    origin += "/es6";
    if(isBeacon) {
      origin += "/rudder-analytics.min_beacon.js";
    } else {
      origin += "/rudder-analytics.min.js";
    }
  } else {
    origin += "/es5";
    if(isBeacon) {
      origin += "/rudder-analytics.min_beacon_es5.js";
    } else {
      origin += "/rudder-analytics.min_es5.js";
    }
  }
  
  request.uri = origin;
  return request;
};
