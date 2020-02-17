var ghRelease = require("gh-release");

// all options have defaults and can be omitted
var options = {
  tag_name: "1.1.0-beta.0",
  target_commitish: "master",
  name: "Release 1.1.0-beta.0",
  draft: false,
  prerelease: false,
  repo: "rudder-sdk-js",
  owner: "sayan-rudder",
  endpoint: "https://api.github.com" // for GitHub enterprise, use http(s)://hostname/api/v3
};

// options can also be just an empty object
var options = {};

// or an API token
options.auth = {
  token: ""
};

ghRelease(options, function(err, result) {
  if (err) throw err;
  console.log(result); // create release response: https://developer.github.com/v3/repos/releases/#response-4
});
