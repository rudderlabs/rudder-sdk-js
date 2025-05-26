# Project Overview

This repository contains the RudderStack JavaScript SDK and related packages, managed as a monorepo.

## Purpose

- To provide a robust and flexible JavaScript SDK for tracking customer event data from websites and web applications.
- To enable integration with various third-party destinations by transforming and routing event data.
- To support usage in diverse environments, including standard browser contexts, Single Page Applications (SPAs), and Chrome Extensions (content scripts and background scripts).

## Key Features of the RudderStack JavaScript SDK

- **Event Tracking**: `page`, `track`, `identify`, `group`, `alias`, `screen` calls.
- **Device Mode Integrations**: Load third-party destination SDKs directly on the client-side.
- **Cloud Mode Integrations**: Send data to RudderStack's backend, which then forwards it to destinations.
- **Data Persistence**: Manages user identity and session information using cookies and local storage.
- **Consent Management**: Supports integration with consent managers for GDPR, CCPA, etc.
- **Event Filtering**: Allows selective sending of events to specific destinations.
- **Ad Blocker Detection**: Provides utilities to detect if ad blockers are interfering with tracking.
- **Installation Options**: Can be installed via CDN or as an NPM package.
- **Modern and Legacy Bundles**: Offers different bundles for modern browsers (supporting dynamic imports) and legacy browsers.
- **SDK Hardening**: Provides mechanisms to reduce external network requests and enhance security (e.g., bundled plugins, overriding source configuration).

## Monorepo Structure

- This repository uses a monorepo structure (managed by Nx) to manage multiple packages.
- Core SDK package, plugins, integrations and utilities are organized within this monorepo.
- The `packages/` directory contains the individual publishable packages.

## Target Environments

- Modern web browsers
- Legacy web browsers (via legacy bundles)
- Service Workers (requires careful consideration of available APIs)
- Chrome Extensions (Content Scripts and Background Scripts)
