# RudderStack Symfony Example

This example demonstrates how to integrate RudderStack's JavaScript SDK with a Symfony application.

## Features

- Passes RudderStack configuration from environment variables to JavaScript
- Initializes the RudderStack SDK using Webpack Encore
- Tracks page view events automatically
- Follows Symfony best practices for asset management and configuration

## Requirements

- PHP 8.0 or higher
- Composer
- Node.js and npm

## Installation

1. Clone this repository
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Install JavaScript dependencies:
   ```bash
   npm install
   ```
4. Configure your RudderStack credentials in `.env`:
   ```
   RUDDERSTACK_WRITE_KEY=your_write_key
   RUDDERSTACK_DATAPLANE_URL=your_dataplane_url
   ```
5. Build the frontend assets:
   ```bash
   npm run build
   ```
6. Start the Symfony development server:
   ```bash
   symfony server:start
   ```
   
   If you don't have the Symfony CLI installed, you can use PHP's built-in server:
   ```bash
   php -S localhost:8000 -t public
   ```

7. Visit http://localhost:8000 in your browser

## How It Works

### Backend (PHP)

1. The RudderStack credentials are stored in environment variables in the `.env` file
2. The `RudderstackController` handles the main page request and passes these credentials to the Twig template
3. The base template makes the configuration available to JavaScript via a script tag

### Frontend (JavaScript)

1. The JavaScript code in `assets/app.js` retrieves the RudderStack configuration from the window object
2. It initializes the RudderStack SDK with your credentials
3. It automatically tracks a page view event when the page loads

## Customization

You can extend this example to track additional events by using the RudderStack API. For example:

```javascript
// Track a custom event
analytics.track('Button Clicked', {
  buttonId: 'signup-button',
  buttonText: 'Sign Up'
});

// Track user identification
analytics.identify('user123', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Documentation

- [RudderStack JavaScript SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/)
- [Symfony Documentation](https://symfony.com/doc/current/index.html)
- [Webpack Encore](https://symfony.com/doc/current/frontend.html) 
