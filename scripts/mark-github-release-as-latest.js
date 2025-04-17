#!/usr/bin/env node

/**
 * Mark a GitHub release as the latest release
 * 
 * This script is used in GitHub Actions workflows to mark a specific release as the latest.
 * It takes a package name and version, finds the corresponding GitHub release, and updates
 * it to be marked as the latest release.
 * 
 * Usage in GitHub Actions:
 * ```yaml
 * - name: Mark release as latest
 *   uses: actions/github-script@v7
 *   with:
 *     github-token: ${{ secrets.GITHUB_TOKEN }}
 *     script: |
 *       const markAsLatest = require('./scripts/mark-github-release-as-latest.js');
 *       await markAsLatest({
 *         github,
 *         context,
 *         packageName: '@rudderstack/analytics-js',
 *         version: process.env.VERSION
 *       });
 * ```
 */

/**
 * Mark a GitHub release as the latest
 * @param {Object} options - Options object
 * @param {Object} options.github - GitHub API client
 * @param {Object} options.context - GitHub Actions context
 * @param {string} options.packageName - Package name (e.g. '@rudderstack/analytics-js' or 'rudder-sdk-js')
 * @param {string} options.version - Version to mark as latest (e.g. '1.2.3')
 * @returns {Promise<void>}
 */
module.exports = async ({ github, context, packageName, version }) => {
  const releaseTag = `${packageName}@${version}`;
  
  console.log(`Marking ${releaseTag} as the latest release on GitHub`);
  
  // Find the release for the version
  const releases = await github.rest.repos.listReleases({
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  
  const releaseToMark = releases.data.find(release => 
    release.tag_name === releaseTag || 
    release.name === releaseTag
  );
  
  if (!releaseToMark) {
    console.log(`Release with tag ${releaseTag} not found`);
    return;
  }
  
  // Update the release to set it as the latest
  await github.rest.repos.updateRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    release_id: releaseToMark.id,
    make_latest: true
  });
  
  console.log(`Successfully marked ${releaseTag} as the latest release`);
}; 
