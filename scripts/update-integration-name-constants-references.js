const fs = require('fs');
const path = require('path');

// Paths
const destinationsPath = path.join(
  __dirname,
  '../packages/analytics-js-common/src/constants/Destinations.ts',
);
const integrationsDir = path.join(
  __dirname,
  '../packages/analytics-js-common/src/constants/integrations',
);

// Step 1: Parse Destinations.ts
const destinationsContent = fs.readFileSync(destinationsPath, 'utf-8');

const DESTINATIONS = {};
const regex = /export const (\w+)_NAME = '(\w+)';\nexport const \1_DISPLAY_NAME = '(.*?)';/g;
let match;
while ((match = regex.exec(destinationsContent)) !== null) {
  const [, key, name, displayName] = match;
  DESTINATIONS[name] = { name, displayName, key };
  DESTINATIONS[displayName.toLowerCase().replace(/\s+/g, '')] = { name, displayName, key }; // Normalize
}

// Step 2: Find all constants.ts files in constants/integrations
function findConstantsFiles(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...findConstantsFiles(fullPath));
    } else if (file === 'constants.ts') {
      files.push(fullPath);
    }
  });
  return files;
}

function replaceExports(exports) {
  return exports.replace(
    // eslint-disable-next-line sonarjs/slow-regex
    /export {\s*([\S\s]*?)\s*};/,
    (match, exports) => {
      const updatedExportList = exports
        .split(',')
        .map(e => e.trim())
        .filter(e => e !== 'NAME' && e !== 'DISPLAY_NAME')
        .filter(Boolean) // Removes any empty strings from the list
        .join(', ');

      return `export { ${updatedExportList} };`;
    },
  );
}

const integrationFiles = findConstantsFiles(integrationsDir);

// Step 3: Update each file
integrationFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract NAME and DISPLAY_NAME to match with Destinations.ts
  const nameMatch = /const NAME = '(.*?)';/.exec(content);
  const displayNameMatch = /const DISPLAY_NAME = '(.*?)';/.exec(content);
  if (!nameMatch || !displayNameMatch) return;

  const name = nameMatch[1];
  const displayName = displayNameMatch[1].toLowerCase().replace(/\s+/g, '');

  const destination = DESTINATIONS[name] || DESTINATIONS[displayName];
  if (!destination) {
    console.log(`No match found for ${filePath}`);
    return;
  }

  // Generate import lines
  const nameImports = `import { ${destination.key}_NAME as NAME, ${destination.key}_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';\n`;
  const nameExports = `export { ${destination.key}_NAME as NAME, ${destination.key}_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';\n`;

  // Remove existing NAME and DISPLAY_NAME declarations
  const withoutNameAndDisplayName = content
    .replace(/const NAME = '.*?';\n/, '')
    .replace(/const DISPLAY_NAME = '.*?';\n/, '');

  // Update export statement to exclude NAME and DISPLAY_NAME
  const updatedExports = replaceExports(withoutNameAndDisplayName);

  // Ensure imports are at the top of the file
  const updatedContent = `${nameImports}\n${updatedExports}\n${nameExports}\n`;

  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`Updated ${filePath}`);
});
