# Symfony Usage

RudderStack JS SDK [npm package](https://www.npmjs.com/package/@rudderstack/analytics-js) can be
used with Symfony PHP framework.

## Table of contents

- [**Examples**](#examples)
- [**Webpack Encore**](#Webpack-Encore)
- [**Twig template**](#Twig-template)
- [**External resources**](#External-resources)

## Examples

The provided examples are based on official documentation of the framework, these contain minimal
implementation.

### Sample Symfony project setup

- symfony new sample --version=5.4 --webapp
- cd sample
- composer require symfony/webpack-encore-bundle
- composer require twig
- npm i
- npm i -S @rudderstack/analytics-js
- npm run build
- symfony server:start

## Webpack Encore

RudderStack JS SDK [npm package](https://www.npmjs.com/package/@rudderstack/analytics-js) can be
utilised with Webpack Encore. You can start with the generated project and alter the app.js file to
integrate the sdk:

    import { RudderAnalytics } from '@rudderstack/analytics-js';

    const analytics = new RudderAnalytics();
    const loadOptions = {};
    analytics.load('<writeKey>', '<dataplaneUrl>', loadOptions);
    window.rudderanalytics = analytics;

    window.rudderanalytics.page();

You can then utilise the RudderStack JS SDK within the rest of you JavaScript code

See relevant [example](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/symfony/sample)

## Twig template

RudderStack JS SDK CDn package can be utilised directly in the twig templates by including the
snippet in your template partial for HTML head element.

## External resources

- [Installing & Setting up the Symfony Framework](https://symfony.com/doc/current/setup.html)
- [Front-end Tools: Handling CSS & JavaScript](https://symfony.com/doc/current/frontend.html)
- [Create your First Page in Symfony](https://symfony.com/doc/current/page_creation.html)
