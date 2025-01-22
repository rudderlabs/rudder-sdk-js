/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync, readFileSync, writeFileSync, statSync } = require('fs');
const { join } = require('path');

// Paths
const integrationsDir = join(
  __dirname,
  '../packages/analytics-js-common/src/constants/integrations',
);

const destinationsPath = join(integrationsDir, 'Destinations.ts');

// Error collection
const errors = [];

// Step 1: Parse Destinations.ts
const destinationsContent = readFileSync(destinationsPath, 'utf-8');

const DESTINATIONS = {};
const regex = /export const (\w+)_NAME = '(\w+)';\nexport const \1_DISPLAY_NAME = '(.*?)';/g;
const allMatches = [...destinationsContent.matchAll(regex)];
allMatches.forEach(match => {
  const [, key, name, displayName] = match;
  DESTINATIONS[name] = { name, displayName, key };
  DESTINATIONS[displayName.toLowerCase().replace(/\s+/g, '')] = { name, displayName, key }; // Normalize
});

// Step 2: Find all constants.ts files in constants/integrations
function findConstantsFiles(dir) {
  const files = [];

  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      files.push(...findConstantsFiles(fullPath));
    } else if (file === 'constants.ts') {
      files.push(fullPath);
    }
  });
  return files;
}

const integrationFiles = findConstantsFiles(integrationsDir);

// Step 3: Update each file
integrationFiles.forEach(filePath => {
  const content = readFileSync(filePath, 'utf-8');

  // Extract NAME and DISPLAY_NAME to match with Destinations.ts
  const nameMatch = /const NAME = '(.*?)';/.exec(content);
  const displayNameMatch = /const DISPLAY_NAME = '(.*?)';/.exec(content);
  if (!nameMatch || !displayNameMatch) return;

  const name = nameMatch[1];
  const displayName = displayNameMatch[1].toLowerCase().replace(/\s+/g, '');

  const destination = DESTINATIONS[name] || DESTINATIONS[displayName];
  if (!destination) {
    errors.push(`No match found for ${filePath}`);
    return;
  }

  // Generate import lines
  const nameImports = `import { ${destination.key}_NAME as NAME, ${destination.key}_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';\n`;

  // Remove existing NAME and DISPLAY_NAME declarations
  const withoutNameAndDisplayName = content
    .replace(/const NAME = '.*?';\n/, '')
    .replace(/const DISPLAY_NAME = '.*?';\n/, '');

  // Ensure imports are at the top of the file
  const updatedContent = `${nameImports}\n${withoutNameAndDisplayName}`;

  writeFileSync(filePath, updatedContent, 'utf-8');

  console.log(`Updated ${filePath}`);
});

// Step 4: Log errors after processing all files
if (errors.length > 0) {
  console.error('\nErrors encountered:');
  errors.forEach(error => console.error(`- ${error}`));
} else {
  console.log('\nNo errors encountered.');
}
