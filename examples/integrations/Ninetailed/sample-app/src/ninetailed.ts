import { Ninetailed } from '@ninetailed/experience.js';

// Registers window.ninetailed, which the RudderStack Ninetailed device-mode destination forwards events to
export const ninetailed = new Ninetailed({
  // REQUIRED. An API key uniquely identifying your Ninetailed account.
  clientId: '52f31dff-94c4-4a59-8938-52a3ffc94571',
  // OPTIONAL. Your Ninetailed environment, typically either "main" or "development"
  environment: 'main', // Default
});
