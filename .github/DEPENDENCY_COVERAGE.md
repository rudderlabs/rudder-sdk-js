# Mock-server dependency inventory

`examples/utils/mock-servers` is an independent npm project. Its committed lock records direct and transitive versions for GitHub's dependency graph.

Run `npm ci --ignore-scripts` in that directory to reproduce the inventory. Refresh with `npm install --package-lock-only --ignore-scripts`, review the diff, and commit the lock. Do not refresh the root workspace lock for this project.

After merge, verify that GitHub ingests this manifest and lock. Existing Dependabot policy and alert dismissals are unchanged. Revert the lock to roll back this inventory addition.
