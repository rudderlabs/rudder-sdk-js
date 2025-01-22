# Contributing to RudderStack

Thanks for taking the time and for your help in improving this project!

## Table of contents

- [**RudderStack Contributor Agreement**](#rudderstack-contributor-agreement)
- [**Contribute to this project**](#contribute-to-this-project)
- [**Adding your own integrations**](#adding-your-own-integrations)
- [**Committing**](#committing)
- [**Installing and setting up RudderStack**](#installing-and-setting-up-rudderstack)
- [**Getting help**](#getting-help)
- [**Guide to develop your first RudderStack integration**](#guide-to-develop-your-first-rudderstack-integration)

## RudderStack Contributor Agreement

To contribute to this project, we need you to sign the [**Contributor License Agreement (“CLA”)**][CLA] for the first commit you make. By agreeing to the [**CLA**][CLA] we can add you to list of approved contributors and review the changes proposed by you.

## Contribute to this project

If you encounter a bug or have any suggestion for improving this project, you can [**submit an issue**](https://github.com/rudderlabs/rudder-sdk-js/issues/new) describing your proposed change. Alternatively, you can propose a change by making a pull request and tagging our team members.

For more information on the different ways in which you can contribute to RudderStack, you can chat with us on our [**Slack**](https://rudderstack.com/join-rudderstack-slack-community/) channel.

## Adding your own integrations

One way you can contribute to this project is by adding integrations of your choice for sending the data through their respective web (JavaScript) SDKs.

### How to build the SDK

- Look for run scripts in the `package.json` file for getting the builds. The builds are updated in the `dist` directory of corresponding package directories. Among the others, some of the important ones are:

  - `npm run build:browser:modern`: This outputs **dist/cdn/modern** folder that contains the CDN package contents.
  - `npm run build:npm:modern`: This outputs **dist/npm/modern** folder that contains the NPM package contents.
  - `npm run build:integrations`: This outputs **dist/cdn/legacy** and **dist/cdn/modern** folders that contains the integration SDKs.

> We use **rollup** to build our SDKs. Each package directory contains the configuration for it in `rollup.config.mjs`.

## Committing

Please raise a pull request from your forked repository to the `develop` branch of the main repository.

We prefer squash commits so that all changes from a branch are committed to `develop` branch as a single commit. All pull requests are squashed when merged, but rebasing prior to merge gives you better control over the commit message.

## Installing and setting up RudderStack

To contribute to this project, you may need to install RudderStack on your machine. You can do so by following our [**docs**](https://rudderstack.com/docs/get-started/installing-and-setting-up-rudderstack) and set up RudderStack in no time.

## Getting help

For any questions, concerns, or queries, you can start by asking a question on our [**Slack**](https://rudderstack.com/join-rudderstack-slack-community/) channel.
<br><br>

----

# Guide to develop your first RudderStack integration

Before diving into RudderStack integration development, it's essential to understand the [RudderStack Event Specification](https://www.rudderstack.com/docs/event-spec/standard-events/). This specification serves as the foundation for collecting data in a consistent format and then transforming data for the target destinations. 

## Understanding connection modes - Cloud vs Device mode
RudderStack primarily supports two [connection modes](https://www.rudderstack.com/docs/destinations/rudderstack-connection-modes) - Cloud and Device mode. The development plan is different for both modes.

1. **Cloud Mode Integration**: Events are routed through the [RudderStack data plane](https://github.com/rudderlabs/rudder-server) in this mode. The [`rudder-transformer`](https://github.com/rudderlabs/rudder-transformer) is responsible to transform events data in this mode.
2. **Device Mode Integration**: Events are sent directly from the client to the destination in this mode. Depending upon the client where you are collecting events from, the respective RudderStack client SDK (e.g. `rudder-sdk-js` for the web client) is responsible to transform and deliver these events (using the destination SDK).

## Developing _cloud mode_ RudderStack integration
Follow the guide in [Contributing.md of the `rudder-transfomer` repo](https://github.com/rudderlabs/rudder-transformer/blob/docs-contrib-guide/CONTRIBUTING.md#building-your-first-custom-rudderStack-destination-integration) as
the `rudder-transformer` is responsible for the **cloud mode** transformation.

## Developing _device mode_ RudderStack integration

In this guide, we'll focus specifically on developing a destination integration in device mode integration type. Should you choose device mode integration over cloud mode integration? Following information should help you make the decision.

**Benefits of _device mode_ integrations**

* Device mode is useful when you need capabilities that can only be accessed natively via a destination's SDK, such as push notifications.
* It can also be faster and cheaper because events are delivered directly, without going through RudderStack servers.

**Disadvantages of _device mode_ integrations**

* Device mode integrations impact website performance negatively by adding third-party SDKs
* Makes it hard to collect **first-party** data
* Prone to ad blockers

If _device mode_ integration does not seem suitable, go ahead with the _cloud mode_ inregration development instead and follow [this guide](https://github.com/rudderlabs/rudder-transformer/blob/docs-contrib-guide/CONTRIBUTING.md#building-your-first-custom-rudderStack-destination-integration).

### 1. Setting up the development environment

```bash
# Clone the repository
git clone https://github.com/rudderlabs/rudder-sdk-js

# Setup the project
npm run setup

# To reset the project setup
npm run clean && npm cache clean --force && npm run setup
```

### 2. Understanding the code structure

The repository is a monorepo, with different packages under the `packages` directory.

* `analytics-js`: The main JavaScript SDK
* `analytics-js-integrations`: Hosts device mode integrations
* `analytics-js-plugins`: Optional features for the SDK
* `analytics-js-common`: Common code used by other packages

**Tooling:**

* Rollup: Bundles JavaScript code
* Babel: Transpiles code
* ESLint: Catches lint issues
* Jest: Unit test framework
* NX: Manages the monorepo and CI/CD
* Size Limit: Checks the sizes of final bundles

### 3. Coding the essential components of the integration

> Before proceeding with the next steps, we recommend drafting a document outlining the requirements of your integration and relevant resources

Your integration will require several key files:

**Constants definition**
> `/packages/analytics-js-common/src/constants/integrations/<integration-name>/constants.ts`

Start by creating a new folder in `analytics-js-common` package, under `/packages/analytics-js-common/src/constants/integrations` for the new integration (e.g., test-integration-1). 
We will define few basic constants mandatorily required for all the integrations.
   - Integration name
   - Display name
   - Directory name

This can be done by creating a `constants.ts` with `NAME`, `DISPLAY_NAME`, and `DIR_NAME` at minimum.

The integration and display names should be referred from the auto-generated file in `/packages/analytics-js-common/src/constants/integrations/Destinations.ts`. See the existing integrations for reference.

The directory name is the name of the integration directory in the `packages/analytics-js-integrations/src/integrations` directory. It should not contain any special characters or spaces.

**Main integration code**
> `packages/analytics-js-integrations/src/integrations/<integration-name>/browser.js`

   ```javascript
   // browser.js structure
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

- `config` object contains the destination configuration settings.
   - You can refer to individual configuration settings using `config.<setting_name>`.
- `analytics` object is the RudderStack SDK instance. 
   - It supports all the standard methods like `track`, `identify`, `page`, etc. along with getter methods like `getAnonymousId`, `getUserId`, etc.
- `rudderElement` object is a wrapper around the actual standard RudderStack event object.
   ```json
   {
      "message": <Event payload>
   }
   ```

### 4. Building and testing

#### Build process
```bash
# For legacy build
npm run build:integration --environment INTG_NAME:TestIntegrationOne

# For modern build
npm run build:integration:modern --environment INTG_NAME:TestIntegrationOne
```

#### Testing setup

a. Serve the bundle:
   ```bash
   npx serve dist/cdn/js-integrations
   ```
   The bundle will be served at `http://localhost:3000`.

b. Configure test environment:
   - Modify `packages/analytics-js/public/index.html` to mock source configuration data and point to the local integrations bundle.
      ```javascript
      rudderanalytics.load(writeKey, dataPlaneUrl, {
         destSDKBaseURL: 'http://localhost:3000',
         getSourceConfig: () => ({
            updatedAt: new Date().toISOString(),
            source: {
               // Use valid values from RS dashboard
               name: SOURCE_NAME,
               id: SOURCE_ID,
               workspaceId: WORKSPACE_ID,
               writeKey: WRITE_KEY,
               updatedAt: new Date().toISOString(),
               config: { 
                  statsCollection: {
                     errors: {
                        enabled: false
                     },
                     metrics: {
                        enabled: false
                     },
                  }
               },
               enabled: true,
               destinations: [
                  {
                     config: {
                           id: 'someId',
                           ... add other properties as needed
                     },
                     id: 'dummyDestinationId',
                     enabled: true,
                     deleted: false,
                     destinationDefinition: {
                           name: 'TestIntegrationOne',
                           displayName: 'Test Integration One',
                     }
                  }
               ]
            }
         })
      });
      ```
   - Set environment variables (WRITE_KEY, DATAPLANE_URL) in `.env` file.
   - Run `npm run start`

### 5. Automated testing
Implement automated tests for your integration:

```bash
# Run tests for specific integration at packages/analytics-js-integrations/
npm run test -- TestIntegrationOne/
```

### 6. Configurations for the integration (in `rudder-integrations-config` repository)

In order to allow user to configure your integration via the RudderStack UI (control plane), you'll need to contribute to [`rudder-integrations-config`](https://github.com/rudderlabs/rudder-integrations-config) repository.

Create a new folder for your integration under [`src/configurations/destinations`](https://github.com/rudderlabs/rudder-integrations-config/tree/develop/src/configurations/destinations) and then add the necessary configuration files as following.

**Two approaches for adding UI configurations:**

A. **Automated generation:**
   Create a placeholder file by changing the values in the template available at [`src/test/configData/inputData.json`](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/test/configData/inputData.json) and then run following command
   ```bash
   python3 scripts/configGenerator.py <path-to-placeholder-file>
   ```
B. **Manual configuration:**
   Add config files in `src/configurations/destinations` using the [existing templates](https://github.com/rudderlabs/rudder-integrations-config/blob/develop/test/configData/inputData.json) as reference.
* Define the necessary configuration fields, such as API keys or customer IDs
* `db-config.json`: Define the fields needed for the web source in this file. Field names are immutable and should be intuitive
    * Include the integration's name, display name, supported sources, connection modes, and configuration fields
    * Specify secret keys for secure storage
* `ui-config.json`: Specify how the fields should be presented in the RudderStack dashboard, such as text boxes or dropdowns
* `schema.json`: Define validation rules for the data, using JSON schema specification. Test data should be created for schema validation

**Best practices of configuration management:**

Decide which configurations should be set via the UI/dashboard and which can be passed in code to an event integration property object at the client side, following key points will help in making the decision:

  * Configurations in the UI/dashboard are meant for authentication and customizing integration behavior
  * Avoid over-complicating configurations in the UI, as this can be confusing.
  * Using the config via UI allows changes without needing to update app instrumentation
  * Config options in the UI are generic, whereas the integration object can also customize the behavior per event


### 7. Deployment and support
Once development is complete:
1. The RudderStack team will handle production deployment
2. An announcement will be made in the [Release Notes](https://www.rudderstack.com/docs/releases/) and Slack `#product-releases` channel
3. Ongoing support is available through:
   - GitHub PR feedback
   - [RudderStack Slack community](https://rudderstack.com/join-rudderstack-slack-community/) `#contributing-to-rudderstack` channel

### 8. Best practices
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

We look forward to your feedback on improving this project!

<!----variables---->

[CLA]: https://forms.gle/845JRGVZaC6kPZy68
