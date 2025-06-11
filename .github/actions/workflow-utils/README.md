# External Workflow Trigger & Wait

A generic composite action for triggering external workflows and waiting for their completion with proper status handling. This action can be used to trigger any GitHub workflow in any repository with custom inputs.

## Features

- 🚀 **Trigger Any External Workflow**: Dispatch any workflow in any repository
- 📝 **Dynamic Inputs**: Pass custom JSON inputs to the target workflow
- 🌿 **Flexible Git Refs**: Trigger workflows on any branch, tag, or commit
- ⏳ **Smart Waiting**: Poll workflow status with configurable intervals and timeouts
- 📊 **Rich Logging**: Detailed status updates with progress tracking and direct links
- ✅ **Proper Exit Codes**: Fail the calling workflow if external workflow fails
- 🛡️ **Timeout Protection**: Configurable maximum wait times to prevent infinite loops
- 🔗 **Direct Links**: Get direct URLs to monitor the triggered workflow
- 🚨 **Smart Cancellation**: Automatically cancels external workflows when parent workflow is cancelled or fails

## Usage

### Basic Usage (No Custom Inputs)

```yaml
- name: Trigger external workflow
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: owner/repo-name
    workflow_file: my-workflow.yml
    workflow_name: 'My External Workflow'
    max_wait_time: 3600 # 1 hour
    check_interval: 30 # Check every 30 seconds
```

### Advanced Usage (With Custom Inputs)

```yaml
- name: Prepare workflow inputs
  id: prepare_inputs
  run: |
    inputs_json=$(jq -n \
      --arg environment "production" \
      --arg version "1.2.3" \
      --arg feature_flag "true" \
      '{
        environment: $environment,
        app_version: $version,
        enable_feature: $feature_flag
      }')
    echo "inputs_json=$inputs_json" >> $GITHUB_OUTPUT

- name: Trigger external workflow with inputs
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: company/deployment-repo
    workflow_file: deploy.yml
    workflow_ref: main
    workflow_name: 'Production Deployment'
    workflow_inputs: ${{ steps.prepare_inputs.outputs.inputs_json }}
    max_wait_time: 7200 # 2 hours
    check_interval: 60 # Check every minute
```

## Inputs

| Input             | Description                                 | Required | Default             |
| ----------------- | ------------------------------------------- | -------- | ------------------- |
| `github_token`    | GitHub token for API access                 | ✅       | -                   |
| `target_repo`     | Target repository (owner/repo)              | ✅       | -                   |
| `workflow_file`   | Workflow file to trigger (e.g., deploy.yml) | ✅       | -                   |
| `workflow_ref`    | Git ref to trigger the workflow on          | ❌       | `main`              |
| `workflow_name`   | Descriptive name for logging                | ❌       | `External Workflow` |
| `workflow_inputs` | JSON object with inputs for target workflow | ❌       | `{}`                |
| `max_wait_time`   | Maximum wait time in seconds                | ✅       | -                   |
| `check_interval`  | Check interval in seconds                   | ✅       | -                   |

## Outputs

| Output       | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `status`     | Final status (`completed`, `timeout`)                      |
| `conclusion` | Final conclusion (`success`, `failure`, `cancelled`, etc.) |
| `run_id`     | The workflow run ID                                        |
| `run_url`    | Direct URL to the workflow run                             |

## Examples

### Example 1: Trigger Test Suite

```yaml
- name: Run integration tests
  id: integration_tests
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: company/test-repo
    workflow_file: integration-tests.yml
    workflow_name: 'Integration Tests'
    max_wait_time: 1800 # 30 minutes
    check_interval: 30

- name: Deploy if tests pass
  if: steps.integration_tests.outputs.conclusion == 'success'
  run: echo "Tests passed, proceeding with deployment..."
```

### Example 2: Trigger Deployment with Environment

```yaml
- name: Prepare deployment inputs
  id: deploy_inputs
  run: |
    inputs_json=$(jq -n \
      --arg environment "${{ github.event.inputs.environment }}" \
      --arg version "${{ github.ref_name }}" \
      --arg rollback_enabled "true" \
      '{
        target_environment: $environment,
        app_version: $version,
        enable_rollback: $rollback_enabled
      }')
    echo "inputs_json=$inputs_json" >> $GITHUB_OUTPUT

- name: Trigger deployment
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.DEPLOY_TOKEN }}
    target_repo: company/infrastructure
    workflow_file: deploy-app.yml
    workflow_ref: main
    workflow_name: 'App Deployment'
    workflow_inputs: ${{ steps.deploy_inputs.outputs.inputs_json }}
    max_wait_time: 3600
    check_interval: 60
```

### Example 3: Trigger Multiple Workflows in Sequence

```yaml
- name: Run sanity tests
  id: sanity
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: company/test-repo
    workflow_file: sanity-tests.yml
    workflow_name: 'Sanity Tests'
    max_wait_time: 900 # 15 minutes
    check_interval: 30

- name: Run full test suite
  if: steps.sanity.outputs.conclusion == 'success'
  id: full_tests
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: company/test-repo
    workflow_file: full-test-suite.yml
    workflow_name: 'Full Test Suite'
    max_wait_time: 3600 # 1 hour
    check_interval: 60

- name: Deploy to production
  if: steps.full_tests.outputs.conclusion == 'success'
  uses: ./.github/actions/workflow-utils
  with:
    github_token: ${{ secrets.PAT }}
    target_repo: company/deployment
    workflow_file: production-deploy.yml
    workflow_name: 'Production Deployment'
    max_wait_time: 1800 # 30 minutes
    check_interval: 60
```

## JSON Input Format

The `workflow_inputs` parameter accepts a JSON object where keys are the input names expected by the target workflow:

```json
{
  "environment": "production",
  "app_version": "1.2.3",
  "feature_flags": "new_ui,advanced_search",
  "enable_monitoring": "true"
}
```

This maps to a target workflow with inputs like:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [development, staging, production]
      app_version:
        type: string
      feature_flags:
        type: string
      enable_monitoring:
        type: boolean
```

## Cancellation Handling

The action provides robust cancellation handling to prevent orphaned external workflows:

### **🚨 Automatic Cancellation Triggers:**

- **Signal Handling**: Catches SIGTERM/SIGINT signals (manual cancellation, concurrency groups)
- **Cancellation Cleanup**: GitHub Actions built-in condition as reliable fallback

### **🔄 Cancellation Process:**

1. **Detection**: Cancellation signal received or parent workflow cancelled
2. **API Call**: Sends POST request to `/repos/owner/repo/actions/runs/{run_id}/cancel`
3. **Verification**: Confirms cancellation request was successful
4. **Logging**: Provides clear feedback on cancellation status

### **⚡ Performance Considerations:**

- Signal handlers provide immediate response to cancellation signals
- Cleanup step acts as reliable fallback using GitHub Actions native conditions
- No periodic API polling - efficient and rate-limit friendly

## Benefits

- **🔄 Universal**: Works with any GitHub workflow in any repository
- **🎯 Flexible**: Pass any custom inputs via JSON
- **🛡️ Reliable**: Proper error handling and timeout protection
- **📈 Scalable**: Reusable across multiple projects and use cases
- **🔗 Traceable**: Direct links for easy monitoring and debugging
- **⚡ Efficient**: Configurable polling intervals for different workflow types
- **🎨 User-Friendly**: Rich logging with emojis and clear status messages
- **🚨 Resource-Safe**: Prevents orphaned external workflows by auto-cancelling on parent cancellation
