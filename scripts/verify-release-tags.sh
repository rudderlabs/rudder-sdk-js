#!/bin/bash
# Fails if any package bumped between BASE_REF and RELEASE_REF lacks a
# `<name>@<version>` tag on REMOTE pointing at RELEASE_REF.
# Usage: verify-release-tags.sh <release_ref> <base_ref> [remote]
set -euo pipefail

release_ref=${1:?release ref required}
base_ref=${2:?base ref required}
remote=${3:-origin}
script_dir=$(cd "$(dirname "$0")" && pwd)

release_sha=$(git rev-parse "${release_ref}^{commit}")
# Reads refs, not the working tree, so it can be replayed against past releases.
project_files=$(git ls-tree --name-only "$release_sha" packages/ | sed 's|$|/project.json|')

# Annotated tags list a peeled `^{}` line with the commit; lightweight tags do not.
remote_tags=$(git ls-remote --tags "$remote" | awk '
  { ref = $2; sub("^refs/tags/", "", ref) }
  ref ~ /\^\{\}$/ { sub(/\^\{\}$/, "", ref); peeled[ref] = $1; next }
  { direct[ref] = $1 }
  END { for (t in direct) print t, (t in peeled ? peeled[t] : direct[t]) }')

expected=()
missing=()
for pj in $project_files; do
  project=$(git show "${release_sha}:${pj}" 2>/dev/null) || continue
  pkg_dir=$(dirname "$pj")
  current_package=$(git show "${release_sha}:${pkg_dir}/package.json")
  current_version=$(printf '%s' "$current_package" | jq -r '.version // empty')
  prev_version=$(git show "${base_ref}:${pkg_dir}/package.json" 2>/dev/null | jq -r '.version // empty' || true)

  tag=$(printf '%s' "$current_package" | node "${script_dir}/get-release-version-tag.js" <(printf '%s' "$project"))
  [ -z "$tag" ] && continue
  [ -n "$prev_version" ] && [ "$current_version" = "$prev_version" ] && continue

  expected+=("$tag")
  actual=$(awk -v t="$tag" '$1 == t { print $2 }' <<< "$remote_tags")
  if [ -z "$actual" ]; then
    missing+=("${tag} (absent)")
  elif [ "$actual" != "$release_sha" ]; then
    missing+=("${tag} (points at ${actual})")
  fi
done

echo "Expected tags at ${release_sha}: ${expected[*]:-none}"
if [ ${#missing[@]} -gt 0 ]; then
  echo "::error::Release tags missing or mispointed (expected ${release_sha}): ${missing[*]}"
  exit 1
fi
echo "All ${#expected[@]} release tags present on ${remote}"
