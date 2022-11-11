# Chrome Extension Usage

RudderStack JS SDK can be used in Chrome Extensions with manifest v3, both as a content script or as a background script
service worker.

## Table of contents

- [**Examples**](#examples)
- [**Background Script**](#background-script)
- [**Content Script**](#content-script)

## Examples

The provided examples are based on [Chrome Extension v3 Starter](https://github.com/SimGus/chrome-extension-v3-starter) 
that contains a minimal Chrome/Chromium extension using the newest version of the manifest (v3).

## Background Script

RuderStack npm package JS SDK service worker export can be used as background script. In order to do so you will need to 
place it in your Chrome extension resources, either by copying the file from node modules, and have it as part of the 
resources, or by using a JS bundler and bundle it as part of you service worker script.

Relevant permissions need to be enabled in the manifest file as per the desired capabilities and connections allowed.
Additionally setting the background script type as module will allow you to import is as ESM.

    "permissions": ["storage", "tabs"],
    "host_permissions": [
        "https://*.dataplane.rudderstack.com/*",
        "https://*.rudderlabs.com/*",
        "*://*/*"
    ],
    "externally_connectable": {
        "matches": [
            "https://*.dataplane.rudderstack.com/*",
            "https://*.rudderlabs.com/*"
        ]
    },
    "background": {
        "service_worker": "service-worker.js",
        "type": "module"
    },

After that you should be able to follow the [NodeJS SDK documentation](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/) 
for further usage.

You can react to events that are available in background scripts via the [Chrome API](https://developer.chrome.com/docs/extensions/reference/).

Here is an example to track url changes.

Sample background script imports:

    # In case file is copied from node_modules/rudder-sdk-js/service-worker/index.es.js in extension resources folder
    import { Analytics } from "./rudderAnalytics.js";

    # In case the package is imported directly as umd and then bundled in the background script
    import { Analytics } from "rudder-sdk-js/service-worker";

    # In case the package is imported directly as es-module and then bundled in the background script
    import { Analytics } from "rudder-sdk-js/service-worker/index.es"; 

Sample background script:
    
    const rudderClient = new Analytics("<writeKey>","<dataPlaneURL>/v1/batch");
    
    chrome.tabs.onUpdated.addListener((tabId, tab) => {
        if (tab.url) {
            rudderClient.track({
                userId: "123456",
                event: "Event Name",
                properties: {
                    data: { url: tab.url },
                }
            });
        }
    });

## Content Script

RuderStack JS SDK can be used as content script. In order to do so you will need to place it in your Chrome extension
resources, either by downloading the file and have it as part of the resources or by using a JS bundler and bundle it as 
part of you content script.

Relevant permissions need to be enabled in the manifest file as per the desired capabilities and connections allowed

    "permissions": ["storage", "tabs"],
    "host_permissions": [
        "https://*.dataplane.rudderstack.com/*",
        "https://*.rudderlabs.com/*",
        "*://*/*"
    ],
    "externally_connectable": {
        "matches": [
            "https://*.dataplane.rudderstack.com/*",
            "https://*.rudderlabs.com/*"
        ]
    }

After that you should be able to follow the [JS SDK documentation](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/quick-start-guide/) 
for further usage.

You can react to events that are available in both content and background scripts too via the [Chrome API](https://developer.chrome.com/docs/extensions/reference/).

Here is an example to track url changes.

Sample content script:

    # prepend the JS SDK file here
    rudderanalytics.load("<writeKey>", "<dataPlaneURL>");
    
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value } = obj;

        if (type === "trackURL") {
            rudderanalytics.track("URL change", { url: value });
        }
    });

Sample background script:

    chrome.tabs.onUpdated.addListener((tabId, tab) => {
        if (tab.url) {
            chrome.tabs.sendMessage(tabId, {
                type: "trackURL",
                value: {
                    url: tab.url
                },
            });
        }
    });

## External resources

- [Official feature summary for manifest v3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
- [Migrating from v2 to v3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/) + [very useful checklist once you think you are done](https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/)
- [Excellent write-ups of a migration](https://github.com/kentbrew/learning-manifest-v3)
