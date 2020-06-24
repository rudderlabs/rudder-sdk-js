const ghRelease = require("gh-release");
const homedir = require("os").homedir();
const fs = require("fs");

// options can also be just an empty object
var options = {};

// all options have defaults and can be omitted
var options = {
  tag_name: "1.1.1",
  target_commitish: "master",
  name: "Release 1.1.1",
  draft: false,
  prerelease: false,
  repo: "rudder-sdk-js",
  owner: "rudderlabs",
  endpoint: "https://api.github.com", // for GitHub enterprise, use http(s)://hostname/api/v3
};

// or an API token
let token = fs.readFileSync(`${homedir}/.gh_token`, "utf8");
token = token.replace(/\n/g, "");

options.auth = {
  token,
};

ghRelease(options, function (err, result) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(JSON.stringify(result)); // create release response: https://developer.github.com/v3/repos/releases/#response-4
});
