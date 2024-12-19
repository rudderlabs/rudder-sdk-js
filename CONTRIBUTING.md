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

----
# Guide to develop your first device mode RudderStack integration

Before diving into RudderStack integration development, it's essential to understand the [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/). This specification serves as the foundation for collecting data in a consistent format and then transforming data for the target destinations. In this guide, we'll focus specifically on developing a destination integration in device mode integration type.

## Understanding integration types
RudderStack supports two primary integration modes:

1. **Cloud Mode Integration**: Events are routed through the RudderStack data plane in this mode
2. **Device Mode Integration**: Events are sent directly from the client to the destination in this mode

## Integration development journey

### 1. Initial setup and configuration
First, you'll need to configure the RudderStack UI in the [`rudder-integrations-config`](https://github.com/rudderlabs/rudder-integrations-config) repository:
- Navigate to [`src/configurations/destinations`](./src/configurations/destinations)
- Add necessary configuration files for dashboard setup
- Prepare integration documentation or planning documents

### 2. Core development steps

#### Setting up the development environment
```bash
# Clone the repository
git clone https://github.com/rudderlabs/rudder-sdk-js
# Setup the project
npm run setup
```

#### Essential components
Your integration will require several key files:

1. **Constants definition** (`/packages/analytics-js-common/src/constants/integrations`)
   - Integration name
   - Display name
   - Directory name

2. **Main integration code** (`packages/analytics-js-integrations/src/integrations`)
   ```javascript
   // index.js and browser.js structure
   class TestIntegrationOne {
     constructor(config, analytics, destinationInfo) {
       // initialization code
     }
     
     init() {
       // SDK initialization
     }
     
     // Core methods
     isLoaded() { /**Your destination SDK is loaded successfully**/}
     isReady() { /**At this point, you can start sending supported events to your destination e.g. track, identify, etc.**/ }
     
     // Event handling
     identify(rudderElement) {}
     track(rudderElement) {}
     page(rudderElement) {}
     alias(rudderElement) {}
     group(rudderElement) {}
   }
   ```

### 3. Building and testing

#### Build process
```bash
# For legacy build
npm run build:integration --environment INTG_NAME:TestIntegrationOne

# For modern build
npm run build:integration:modern --environment INTG_NAME:TestIntegrationOne
```

#### Testing setup
1. Serve the bundle:
   ```bash
   npx serve dist/cdn/js-integrations
   ```
2. Configure test environment:
   - Modify `public/index.html` for mock source config
   - Set environment variables (WRITE_KEY, DATAPLANE_URL)
   - Run `npm run start`

### 4. Automated testing
Implement automated tests for your integration:
```bash
# Run tests for specific destination
npm run test:ts -- component --destination=my_destination
```

### 5. UI configuration
Two approaches for adding UI configurations:

1. **Manual configuration**
   - Add config files in `src/configurations/destinations`
   - Use existing templates as reference

2. **Automated generation**
   ```bash
   python3 scripts/configGenerator.py <path-to-placeholder-file>
   ```

## Deployment and support
Once development is complete:
1. The RudderStack team will handle production deployment
2. An announcement will be made in the [Release Notes](https://www.rudderstack.com/docs/releases/) and Slack `#product-releases` channel
3. Ongoing support is available through:
   - GitHub PR feedback
   - [RudderStack Slack community](https://rudderstack.com/join-rudderstack-slack-community/) `#contributing-to-rudderstack` channel

## Best practices
- Draft the integration plan document before coding
- Be judicious in choosing where you want to allow integration users to configure settings (in the control plane vs the sdk instrumentation code)
- Follow existing integration examples
- Document all configuration options
- Keep code modular and maintainable

Building a RudderStack integration requires attention to detail and thorough testing. The RudderStack team provides support throughout the development process, ensuring your integration meets quality standards and works reliably in production.

## References

- [RudderStack community on Slack](https://rudderstack.com/join-rudderstack-slack-community/)
- [Recording of the community workshop to develop device mode integration](https://youtu.be/70w2ESMBPCI)
- [Guide to develop source and cloud mode destination integration](https://github.com/rudderlabs/rudder-transformer/blob/develop/CONTRIBUTING.md)
- [Recording of the community workshop to develop source and cloud mode integration](https://youtu.be/OD2vCYG-P7k)
- [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/)

----

### We look forward to your feedback on improving this project!

<!----variables---->

[CLA]: https://forms.gle/845JRGVZaC6kPZy68
