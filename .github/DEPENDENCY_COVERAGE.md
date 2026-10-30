# Mock-server dependency inventory

`examples/utils/mock-servers` is an independent npm project. Its committed lock records direct and transitive versions for GitHub's dependency graph.

Run `npm ci --ignore-scripts` in that directory to reproduce the inventory. Refresh with `npm update --package-lock-only --ignore-scripts --before=<cutoff>`, where `<cutoff>` is an ISO timestamp at least seven days before the refresh. Review the diff and commit the lock. Do not refresh the root workspace lock for this project.

Run `npm audit` after refreshing. The age cutoff can exclude a recent security fix. Record any remaining advisory and the excluded fix instead of treating a refreshed lock as vulnerability-free.

After merge, verify that GitHub ingests this manifest and lock. Existing Dependabot policy and alert dismissals are unchanged. Revert the lock to roll back this inventory addition.
