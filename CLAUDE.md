# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development Setup

- `npm run setup` - Install dependencies and build modern packages (initial setup)
- `npm run clean` - Clean build artifacts and reset project
- `npm run setup:ci` - CI setup with dependencies and modern build

### Building

- `npm run build` - Build all packages
- `npm run build:modern` - Build modern JavaScript versions
- `npm run build:browser` - Build browser bundles
- `npm run build:package:modern` - Build modern package versions for distribution

### Development Server

- `npm run start` - Start development servers for core packages (analytics-js, plugins, integrations)
- `npm run start:modern` - Start modern build development servers

### Testing

- `npm run test` - Run all tests
- `npm run test:ci` - Run affected tests for CI
- `npm run test:pre-commit:affected` - Run affected tests for pre-commit

### Linting and Quality

- `npm run check:lint` - Run ESLint checks
- `npm run check:lint:ci` - Run ESLint for affected files in CI
- `npm run lint:fix` - Fix linting issues
- `npm run check:size` - Check bundle sizes
- `npm run check:circular` - Check for circular dependencies
- `npm run check:duplicates` - Check for duplicate code

### Single Test Execution

```bash
# Run tests for specific package
cd packages/[package-name]
npm run test

# Run specific test file
npx jest [test-file-pattern]

# Run tests for specific integration
cd packages/analytics-js-integrations
npm run test -- [IntegrationName]/
```

## Architecture Overview

### Monorepo Structure (Nx-based)

The repository uses Nx for monorepo management with packages in `/packages/`:

#### Core SDK Packages

- **`analytics-js`** - Main JavaScript SDK (modern v3 architecture)
- **`analytics-v1.1`** - Legacy v1.1 SDK (backward compatibility)
- **`analytics-js-service-worker`** - Service worker SDK for serverless environments

#### Supporting Packages

- **`analytics-js-common`** - Shared utilities, types, constants, and services
- **`analytics-js-plugins`** - Optional SDK plugins (consent managers, queues, encryption)
- **`analytics-js-integrations`** - Device mode destination integrations
- **`analytics-js-cookies`** - Cookie utilities
- **`analytics-js-loading-scripts`** - SDK loading scripts
- **`analytics-js-legacy-utilities`** - Utilities for legacy SDK support
- **`sanity-suite`** - Testing and validation suite

### Key Architectural Concepts

#### Modern SDK (v3) Architecture

The main SDK (`analytics-js`) follows a plugin-based architecture:

- **Core Analytics Engine** - Event processing and lifecycle management
- **Plugin System** - Extensible via plugins for features and destinations
- **State Management** - Centralized state using signals
- **Event Repository** - Event queuing and delivery management
- **Configuration Manager** - Dynamic configuration loading

#### Plugin System

Plugins extend SDK functionality:

- **Device Mode Destinations** - Direct integration with third-party SDKs
- **Consent Managers** - Privacy compliance (OneTrust, Ketch, etc.)
- **Storage & Encryption** - Data persistence and security
- **Queue Management** - Event delivery strategies (XHR, Beacon)

### Directory Structure Patterns

#### Package Structure

```
packages/[package-name]/
├── src/           # Source code
├── __tests__/     # Unit tests
├── __fixtures__/  # Test fixtures
├── __mocks__/     # Test mocks
├── dist/          # Built output
├── public/        # Static assets
└── rollup.config.mjs # Build configuration
```

#### Integration Development

Device mode integrations follow this pattern:

- Constants: `analytics-js-common/src/constants/integrations/[name]/constants.ts`
- Implementation: `analytics-js-integrations/src/integrations/[name]/browser.js`
- Required methods: `init()`, `isLoaded()`, `isReady()`, event handlers

### Build System

- **Rollup** - Primary bundler for all packages
- **Babel** - JavaScript/TypeScript transpilation
- **Multiple Build Targets** - Legacy, Modern, NPM, CDN variants
- **Size Limits** - Bundle size tracking and enforcement

### Commit Standards

Follow conventional commits with **mandatory scopes**:

- Package scopes: Use full Nx project names (e.g., `@rudderstack/analytics-js`)
- Custom scopes: `monorepo`, `deps`, `release`, `examples`
- 50 character limit for commit subject lines
- Use atomic commits with clear progression

### Key Files to Reference

- `nx.json` - Nx monorepo configuration
- `package.json` - Root scripts and dependencies
- Individual package `project.json` files - Package-specific configurations
- `.cursor/rules/` - Development guidelines and standards

### Common Patterns

- **State Management** - Uses `@preact/signals-core` for reactive state
- **TypeScript** - Strongly typed with shared types in `analytics-js-common`
- **Testing** - Jest with MSW for HTTP mocking
- **Linting** - ESLint with custom configuration
- **Error Handling** - Centralized error reporting and logging
