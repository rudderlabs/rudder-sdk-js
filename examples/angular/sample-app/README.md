# Angular Sample App with RudderStack

This is a sample Angular application that demonstrates how to integrate the RudderStack SDK.

## Setup

1. Make sure you have Node.js and npm installed
2. Clone this repository
3. Navigate to the sample app directory:
   ```
   cd examples/angular/sample-app
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`
   - Or run the setup script from the repository root:
     ```
     cd /path/to/rudder-sdk-js
     ./scripts/setup-examples-env.sh
     ```

## Development Server

Run `npm start` to start the development server. This will:
1. Replace environment variable placeholders in the env-config.js file with values from your .env file
2. Start Angular's development server
3. Navigate to `http://localhost:4200/` in your browser

The application will automatically reload if you change any of the source files.

## How Environment Variables Work

This sample app uses a combination of approaches to handle environment variables:

1. Environment variables are defined in `.env` and `.env.example` files.
2. Before the build/start, a script (`scripts/replace-env-placeholders.js`) processes the `env-config.js` file, replacing placeholders with values from the `.env` file.
3. The Angular app reads these values from the `window` object.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs tests

## Important Files

- `src/app/use-rudder-analytics.ts` - Contains the RudderStack SDK initialization logic
- `src/env-config.js` - Loads environment variables into the window object
- `scripts/replace-env-placeholders.js` - Script to process environment variables
