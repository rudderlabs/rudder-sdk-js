const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { generateManifest, writeManifest } = require('./publication');

const run = promisify(execFile);
const archiveDirectories = [
  [
    'packages/analytics-js-integrations/dist/cdn/legacy/js-integrations',
    'all_integration_sdks.tar.gz',
  ],
  [
    'packages/analytics-js-integrations/dist/cdn/modern/js-integrations',
    'all_integration_sdks.tar.gz',
  ],
  ['packages/analytics-js-plugins/dist/cdn/modern/plugins', 'all_plugins.tar.gz'],
];

async function archives(repo, tar = process.env.CDN_TAR || 'tar', deterministic = true) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'cdn-archive-'));
  try {
    for (const [directory, filename] of archiveDirectories) {
      const root = path.join(repo, directory);
      const output = path.join(temp, 'archive.tar');
      if (!deterministic) {
        await run(tar, ['-czf', output, '-C', root, '.']);
        await fs.copyFile(output, path.join(root, filename));
        continue;
      }
      await run(tar, [
        '--sort=name',
        '--mtime=@0',
        '--owner=0',
        '--group=0',
        '--numeric-owner',
        // Clear special/executable bits first; X then applies only to directories.
        '--mode=a-st,a-x,u=rwX,go=rX',
        '--format=gnu',
        '--exclude=./list.html',
        `--exclude=./${filename}`,
        '-cf',
        output,
        '-C',
        root,
        '.',
      ]);
      const { stdout } = await run('gzip', ['-n', '-c', output], {
        encoding: 'buffer',
        maxBuffer: 256 * 1024 * 1024,
      });
      await fs.writeFile(path.join(root, filename), stdout);
    }
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}

const escapeHtml = value =>
  value.replace(
    /[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const urlPath = key => key.split('/').map(encodeURIComponent).join('/');

async function listing(root, directory, title, archive, baseUrl, prefix, options) {
  const manifest = await generateManifest(root, options);
  const start = `${directory}/`;
  const files = manifest.resources
    .map(resource => resource.path)
    .filter(
      file =>
        file.startsWith(start) &&
        !file.slice(start.length).includes('/') &&
        ![archive, 'list.html'].includes(file.slice(start.length)),
    );
  const url = file => escapeHtml(`${baseUrl.replace(/\/$/, '')}/${urlPath(`${prefix}${file}`)}`);
  const rows = files.map(
    file =>
      `<tr><td><a href="${url(file)}">${escapeHtml(file.slice(start.length))}</a></td><td>${manifest.resources.find(resource => resource.path === file).integrity}</td></tr>`,
  );
  await fs.writeFile(
    path.join(root, directory, 'list.html'),
    `<!DOCTYPE html>\n<html>\n<head><title>RudderStack JavaScript SDK - ${escapeHtml(title)}</title></head>\n<body>\n<h1>RudderStack JavaScript SDK - ${escapeHtml(title)}</h1>\n<p><a href="${url(`${directory}/${archive}`)}" download><button>Download All Files</button></a></p>\n<table>\n<tr><th>File Name</th><th>SHA-384</th></tr>\n${rows.join('\n')}\n</table>\n</body>\n</html>\n`,
  );
}

async function copyTree(source, destination) {
  const stat = await fs.lstat(source);
  if (stat.isDirectory()) {
    await fs.mkdir(destination, { recursive: true });
    for (const entry of await fs.readdir(source)) {
      await copyTree(path.join(source, entry), path.join(destination, entry));
    }
  } else if (stat.isFile()) {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination, require('node:fs').constants.COPYFILE_EXCL);
  } else throw new Error(`Unsupported publication source: ${source}`);
}

async function prepare(repo, output, baseUrl) {
  const sdk = async directory => {
    const { name, version } = JSON.parse(
      await fs.readFile(path.join(repo, 'packages', directory, 'package.json')),
    );
    return { name, version };
  };
  const version = async directory => (await sdk(directory)).version;
  const publications = [
    {
      name: 'sdk',
      sdk: await sdk('analytics-js'),
      prefix: `${await version('analytics-js')}/`,
      sources: [
        ['analytics-js/dist/cdn/legacy/iife', 'legacy'],
        ['analytics-js/dist/cdn/modern/iife', 'modern'],
        ['analytics-js-integrations/dist/cdn/legacy/js-integrations', 'legacy/js-integrations'],
        ['analytics-js-integrations/dist/cdn/modern/js-integrations', 'modern/js-integrations'],
        ['analytics-js-plugins/dist/cdn/modern/plugins', 'modern/plugins'],
      ],
    },
    {
      name: 'legacy',
      sdk: await sdk('analytics-v1.1'),
      prefix: `${await version('analytics-v1.1')}/`,
      sources: [
        ['analytics-v1.1/dist/cdn/legacy', ''],
        ['analytics-v1.1/dist/cdn/modern', 'modern'],
        ['analytics-js-integrations/dist/cdn/legacy/js-integrations', 'js-integrations'],
        ['analytics-js-integrations/dist/cdn/modern/js-integrations', 'modern/js-integrations'],
      ],
    },
    {
      name: 'loader',
      sdk: await sdk('loading-scripts'),
      prefix: `js-sdk-loader-scripts/${await version('loading-scripts')}/`,
      sources: ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'].map(file => [
        `loading-scripts/dist/${file}`,
        file,
      ]),
    },
  ];
  if (new Set(publications.map(publication => publication.prefix)).size !== publications.length)
    throw new Error('Publication prefixes overlap');
  await fs.mkdir(output, { recursive: true });
  for (const publication of publications) {
    const root = path.join(output, publication.name);
    await fs.rm(root, { recursive: true, force: true });
    await fs.mkdir(root);
    for (const [source, destination] of publication.sources) {
      await copyTree(path.join(repo, 'packages', source), path.join(root, destination));
    }
    if (publication.name !== 'loader') {
      const legacyDir = publication.name === 'sdk' ? 'legacy/js-integrations' : 'js-integrations';
      await listing(
        root,
        legacyDir,
        'Device Mode Integrations (Legacy)',
        'all_integration_sdks.tar.gz',
        baseUrl,
        publication.prefix,
        { sdk: publication.sdk, repo },
      );
      await listing(
        root,
        'modern/js-integrations',
        'Device Mode Integrations (Modern)',
        'all_integration_sdks.tar.gz',
        baseUrl,
        publication.prefix,
        { sdk: publication.sdk, repo },
      );
      if (publication.name === 'sdk')
        await listing(
          root,
          'modern/plugins',
          'Plugins',
          'all_plugins.tar.gz',
          baseUrl,
          publication.prefix,
          { sdk: publication.sdk, repo },
        );
    }
    await writeManifest(root, { sdk: publication.sdk, repo });
  }
  await fs.writeFile(
    path.join(output, 'publications.json'),
    `${JSON.stringify(
      publications.map(({ name, prefix }) => ({ name, prefix })),
      null,
      2,
    )}\n`,
  );
  return publications;
}

module.exports = { archives, listing, prepare, urlPath };
