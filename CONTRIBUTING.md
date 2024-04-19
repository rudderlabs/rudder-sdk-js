# Contributing to RudderStack

Thanks for taking the time and for your help in improving this project!

## Table of contents

- [**RudderStack Contributor Agreement**](#rudderstack-contributor-agreement)
- [**Contribute to this project**](#contribute-to-this-project)
- [**Adding your own integrations**](#adding-your-own-integrations)
- [**Committing**](#committing)
- [**Installing and setting up RudderStack**](#installing-and-setting-up-rudderstack)
- [**Getting help**](#getting-help)

## RudderStack Contributor Agreement

To contribute to this project, we need you to sign the [**Contributor License Agreement (“CLA”)**][CLA] for the first commit you make. By agreeing to the [**CLA**][CLA]
we can add you to list of approved contributors and review the changes proposed by you.

## Contribute to this project

If you encounter a bug or have any suggestion for improving this project, you can [**submit an issue**](https://github.com/rudderlabs/rudder-sdk-js/issues/new) describing your proposed change. Alternatively, you can propose a change by making a pull request and tagging our team members.

For more information on the different ways in which you can contribute to RudderStack, you can chat with us on our [**Slack**](https://rudderstack.com/join-rudderstack-slack-community/) channel.

## Adding your own integrations

One way you can contribute to this project is by adding integrations of your choice for sending the data through their respective web (JavaScript) SDKs.

### How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser`: This outputs **rudder-analytics.min.js**.
  - `npm run build:npm`: This outputs **rudder-sdk-js** folder that contains the npm package contents.
  - `npm run build:integration:all`: This outputs **integrations** folder that contains the integrations.

> We use **rollup** to build our SDKs. The configurations for them are present in `rollup-configs` folder.

- For adding or removing integrations, modify the imports in `index.js` under the `src/integrations` folder.

## Committing

We prefer squash or rebase commits so that all changes from a branch are committed to master as a single commit. All pull requests are squashed when merged, but rebasing prior to merge gives you better control over the commit message.

## Installing and setting up RudderStack

To contribute to this project, you may need to install RudderStack on your machine. You can do so by following our [**docs**](https://rudderstack.com/docs/get-started/installing-and-setting-up-rudderstack) and set up RudderStack in no time.

## Getting help

For any questions, concerns, or queries, you can start by asking a question on our [**Slack**](https://rudderstack.com/join-rudderstack-slack-community/) channel.
<br><br>

### We look forward to your feedback on improving this project!

<!----variables---->

[issue]: https://github.com/rudderlabs/rudder-sdk-js/issues/new
[CLA]: https://forms.gle/845JRGVZaC6kPZy68
