const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { urlPath } = require('./prepare');

const execute = promisify(execFile);

function awsInterface(
  { bucket, distribution, baseUrl, cacheControl = 'max-age=3600' },
  run = execute,
  request = fetch,
) {
  async function aws(args) {
    const { stdout } = await run('aws', args, {
      env: { ...process.env, AWS_MAX_ATTEMPTS: '10', AWS_PAGER: '' },
      maxBuffer: 16 * 1024 * 1024,
    });
    return stdout;
  }
  return {
    async list(prefix, token) {
      const args = [
        's3api',
        'list-objects-v2',
        '--bucket',
        bucket,
        '--prefix',
        prefix,
        '--no-paginate',
        '--output',
        'json',
      ];
      if (token) args.push('--continuation-token', token);
      return JSON.parse(await aws(args));
    },
    async get(key) {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdn-get-'));
      try {
        const file = path.join(dir, 'body');
        await aws(['s3api', 'get-object', '--bucket', bucket, '--key', key, file]);
        return await fs.readFile(file);
      } finally {
        await fs.rm(dir, { recursive: true, force: true });
      }
    },
    async put(key, file, type) {
      try {
        await aws([
          's3api',
          'put-object',
          '--bucket',
          bucket,
          '--key',
          key,
          '--body',
          file,
          '--content-type',
          type,
          '--cache-control',
          cacheControl,
          '--if-none-match',
          '*',
        ]);
      } catch (error) {
        // Match the AWS error code, not arbitrary text that happens to mention it.
        if (/\(PreconditionFailed\) when calling the PutObject operation/.test(error.stderr || ''))
          error.code = 'PreconditionFailed';
        throw error;
      }
    },
    async invalidate(prefix) {
      const response = JSON.parse(
        await aws([
          'cloudfront',
          'create-invalidation',
          '--distribution-id',
          distribution,
          '--paths',
          `/${prefix}*`,
          '--output',
          'json',
        ]),
      );
      await aws([
        'cloudfront',
        'wait',
        'invalidation-completed',
        '--distribution-id',
        distribution,
        '--id',
        response.Invalidation.Id,
      ]);
    },
    async http(key) {
      const response = await request(`${baseUrl.replace(/\/$/, '')}/${urlPath(key)}`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(30000),
      });
      return { status: response.status, body: Buffer.from(await response.arrayBuffer()) };
    },
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  };
}

module.exports = { awsInterface };
