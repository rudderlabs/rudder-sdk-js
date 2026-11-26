const fs = require('node:fs/promises');
const path = require('node:path');
const { archives, prepare } = require('./prepare');
const {
  loadPublication,
  publishAll,
  assertMovingDestinations,
  assertRollbackDestinations,
} = require('./publication');
const { awsInterface } = require('./aws');

async function main([command, output = '.cdn-publication', ...destinations]) {
  if (command === 'assert-moving') {
    assertMovingDestinations([output, ...destinations]);
    return;
  }
  if (command === 'assert-rollback') {
    assertRollbackDestinations([output, ...destinations]);
    return;
  }
  if (command === 'archives') {
    await archives(
      process.cwd(),
      undefined,
      !process.env.INPUT_ENVIRONMENT || process.env.INPUT_ENVIRONMENT === 'production',
    );
    return;
  }
  if (!process.env.BASE_CDN_URL) throw new Error('BASE_CDN_URL is required');
  if (command === 'prepare') {
    await prepare(process.cwd(), output, process.env.BASE_CDN_URL);
    console.log(`Prepared SDK, legacy and loader publication trees in ${output}`);
    return;
  }
  if (command !== 'publish')
    throw new Error('Expected archives, prepare, publish, assert-moving or assert-rollback');
  if (!process.env.BUCKET_NAME || !process.env.DISTRIBUTION_ID)
    throw new Error('BUCKET_NAME and DISTRIBUTION_ID are required');
  const definitions = JSON.parse(await fs.readFile(path.join(output, 'publications.json')));
  const publications = [];
  for (const { name, prefix } of definitions)
    publications.push(await loadPublication(path.join(output, name), prefix));
  const io = awsInterface({
    bucket: process.env.BUCKET_NAME,
    distribution: process.env.DISTRIBUTION_ID,
    baseUrl: process.env.BASE_CDN_URL,
    cacheControl: process.env.VERSIONED_CACHE_CONTROL,
  });
  // Complete every preflight before the first production upload.
  await publishAll(publications, io);
}

if (require.main === module)
  main(process.argv.slice(2)).catch(error => {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  });

module.exports = { main };
