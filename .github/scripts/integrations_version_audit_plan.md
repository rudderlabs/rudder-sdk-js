# Integration SDK Version Audit

## Overview

Conduct an AI-assisted audit of all integrations from `.github/scripts/versions.json`, use Cursor's codebase search and documentation walkthrough capabilities to analyze deprecation risks and version information, then **immediately create** a master Linear ticket with subtickets for each integration requiring action using the `.github/scripts/linearApi.js` helper module.

## Key Files

- **Data Source**: `.github/scripts/versions.json` - Contains integrations with version info, sunset dates, and documentation links.
- **Linear API Helper**: `.github/scripts/linearApi.js` - Reference implementation for Linear API calls (agent uses this to understand API structure and makes calls directly)

**Important**: The workflow is performed entirely through AI-assisted analysis using Cursor's capabilities. The agent reads `linearApi.js` to understand the API structure, then makes Linear API calls directly using its capabilities. **Tickets are created immediately after analysis completes, not deferred to a script.**

**Environment Variables Required**:

- `LINEAR_API_KEY` - Required, Linear API key for authentication
- `LINEAR_TEAM_ID` - Required, Linear team ID (UUID) where tickets will be created

## Priority and Due Date Mapping

### Priority Levels:

- **Urgent (1)**: < 90 days until sunset
- **High (2)**: 90-180 days until sunset
- **Medium (3)**: 180-365 days until sunset OR version gap > 2 major versions
- **Low (4)**: > 365 days until sunset OR minor version updates

### Due Date Logic:

- **Urgent (1)**: Due date = Tomorrow (next day)
- **High (2)**: Due date = sunset date - 90 days (approximately 3 months before sunset)
- **Medium (3)**: Due date = sunset date - 180 days (approximately 6 months before sunset)
- **Low (4)**: Due date = 12 months from analysis date
- **No sunset date or unparseable**: leave `dueDate` null (no fallback)

**Note**: Priority is calculated from days-until-sunset. Due dates are set before sunset dates to allow time for migration and testing.

## Implementation Steps

### Phase 1: Data Parsing

1. **Parse versions.json**

- Read and parse `.github/scripts/versions.json`
- Extract for each integration:
- Destination
- SDK Versions currently referred in Device Mode Destinations
- Link to check SDK versions documentation
- Latest SDK Version rolled out
- Sunset Date Current SDK Version

2. **Detect and filter non-versioned APIs**

- Before proceeding with analysis, identify and filter out destinations that use non-versioned APIs
- **Non-versioned detection logic**: A destination is considered non-versioned if any of the following conditions are met:
  - `"SDK Versions currently referred in Device Mode Destinations"` field contains (case-insensitive):
    - "not versioned"
    - "not applicable" (when in context of versioning)
  - `"Latest SDK Version rolled out"` field contains (case-insensitive):
    - "not versioned"
    - "not applicable" (when followed by "no versioning" or similar)
    - "n/a" (when followed by "no versioning" or "versioned api")
    - "no versioning"
    - "continuously updated"
    - "custom endpoint" or "custom configurable endpoint"
    - "account-specific endpoint"
  - `"Sunset Date Current SDK Version"` field contains (case-insensitive):
    - "not applicable"
    - "n/a (no versioned api)"
    - "no versioned api to sunset"
- **Filtering**: Remove all non-versioned destinations from the analysis pipeline
- **Logging**: Log the count and names of skipped destinations for transparency:
  ```javascript
  const skippedDestinations = allDestinations.filter(isNonVersioned);
  console.log(
    `Skipped ${skippedDestinations.length} non-versioned API destinations: ${skippedDestinations.map((d) => d.Destination).join(', ')}`,
  );
  ```
- Only proceed with versioned destinations for subsequent analysis phases

3. **Enforce full coverage of versioned destinations**

- After filtering, build the set of versioned destinations (`versionedDestinations`)
- During analysis, track every destination actually processed (`analyzedDestinations`)
- **Hard rule**: if any versioned destination is missing from `analyzedDestinations`, fail the audit immediately (exit non-zero) and log the missing names for debugging
- Example check:
  ```javascript
  const versionedNames = new Set(versionedDestinations.map((d) => d.Destination));
  const analyzedNames = new Set(analyzedDestinations.map((d) => d.Destination));
  const missing = [...versionedNames].filter((n) => !analyzedNames.has(n));
  if (missing.length > 0) {
    console.error(`Coverage check failed. Missing analyses for: ${missing.join(', ')}`);
    process.exit(1);
  }
  ```

### Phase 2: Analysis with Cursor

4. **Analyze integrations using Cursor**

- For each integration from versions.json (non-versioned destinations already filtered out):
  - **Codebase Search**: Use Cursor's semantic codebase search to:
    - Find integration implementation files
    - Search for version indicators (API endpoints, SDK versions, version constants)
    - Identify current version usage in the codebase
    - Locate relevant configuration and transformation files
  - **Documentation Walkthrough**: Use Cursor's `web_search` tool to:
    - Search and review official documentation links from versions.json
    - Search for and analyze migration guides and changelogs
    - Search for deprecation timelines and breaking changes information
    - Search for API/SDK version compatibility information
    - Verify latest version availability and release dates
    - Check for any announced deprecations or sunset dates not captured in versions.json
    - Gather detailed version upgrade requirements and migration steps
  - **Cross-reference**: Compare versions.json data with findings from codebase search and documentation
  - **Identify gaps**: Flag discrepancies between versions.json, codebase implementation, and official documentation

### Phase 3: Priority Calculation and Categorization

5. **Calculate priority and due dates**

- Parse sunset dates (see Date Parsing section for supported formats)
- For multiple sunset dates in one field, use the earliest one for priority calculation
- Calculate days until sunset (from today to sunset date)
- Extract major version numbers for comparison:
  - "v22.0" → 22
  - "22" → 22
  - "2025-04-15" → 2025 (use year for date-based versions)
  - "v1.76.0" → 1
  - "v2025.07" → 2025
  - If version strings don't contain numbers, compare as strings
- Apply priority logic:
  - **Urgent (1)**: < 90 days until sunset → Due: Tomorrow (next day)
  - **High (2)**: 90-180 days until sunset → Due: sunset date - 90 days (approximately 3 months before)
  - **Medium (3)**: 180-365 days until sunset OR version gap > 2 major versions → Due: sunset date - 180 days (approximately 6 months before)
  - **Low (4)**: > 365 days until sunset OR minor version updates → Due: 12 months from analysis date
- Handle edge cases: "TBD", "Not mentioned", "NA", "n/a", "Not applicable", ambiguous dates → Mark as Low priority (4) or Unknown category

6. **Categorize integrations**

Categorization logic:

- **Action Required**:
  - Has a sunset date (regardless of how far in the future)
  - Current version differs from latest version (and latest is not "NA"/"n/a")
  - Version gap > 2 major versions (even without sunset date)
  - Any deprecation risk or configuration issues identified
- **No Action**:
  - Up-to-date (current version matches latest version)
  - No sunset date announced
  - No version gap or only minor version differences
  - Compliant with latest standards
- **Unknown**:
  - Missing version information in versions.json
  - Unclear or ambiguous sunset dates that cannot be parsed
  - Missing documentation links
  - Needs manual review to determine status

### Phase 4: Linear Ticket Creation (MUST EXECUTE IMMEDIATELY)

**⚠️ CRITICAL**: This phase MUST be executed during the audit. Do NOT create a script file. Do NOT defer ticket creation. Make Linear API calls directly using the agent's capabilities.

7. **Create master Linear ticket** (EXECUTE NOW - DO NOT DEFER)

- Read `.github/scripts/linearApi.js` to understand the Linear API structure
- **IMMEDIATELY** make Linear API calls using the agent's capabilities:
  - Call `getStateId('Queued', LINEAR_TEAM_ID)` to get state ID
  - Call `getCurrentUserId()` to get current user ID
  - Call `getCurrentCycleId(LINEAR_TEAM_ID)` to get cycle ID
- **IMMEDIATELY** create the master ticket by calling `createIssue` with the following structure:

  **Reference implementation from linearApi.js (agent uses this structure to make API calls directly):**
  ```javascript
  // Agent reads this structure and makes Linear API calls directly using its capabilities
  // DO NOT create a script file - execute API calls immediately
  const {
    createIssue,
    getStateId,
    getCurrentUserId,
    getCurrentCycleId,
  } = require('./.github/scripts/linearApi');

  // Query for required IDs
  const statusStateId = await getStateId('Queued', LINEAR_TEAM_ID);
  const currentUserId = await getCurrentUserId();
  const currentCycleId = await getCurrentCycleId(LINEAR_TEAM_ID);

  // If any IDs are null, log warnings but proceed with ticket creation
  if (!statusStateId)
    console.warn('Warning: Could not find "Queued" state. Ticket will be created without status.');
  if (!currentUserId)
    console.warn(
      'Warning: Could not retrieve current user ID. Ticket will be created without assignee.',
    );
  if (!currentCycleId)
    console.warn('Warning: Could not find current cycle. Ticket will be created without cycle.');

  const masterTicket = await createIssue({
    title: 'Integration SDK Version Audit [Rudder SDK JS] [Current Date in DD/MM/YYYY]',
    description: masterDescription, // Use Master Ticket Description Template (see below)
    priority: 3, // Medium priority
    stateId: statusStateId, // Status: Queued
    cycleId: currentCycleId, // Current cycle
    labelIds: [], // Optional: add label IDs if labels exist in Linear
  });
  ```

  - Store returned ticket ID (`masterTicket.id`) for use as parent in subtickets
  - The returned object includes: `id`, `identifier` (e.g., "INT-4499"), `title`, and `url`

8. **Create subtickets for each integration requiring action** (EXECUTE NOW - DO NOT DEFER)

- For each integration categorized as "Action Required":
- **IMMEDIATELY** create subticket by calling `createIssue` (reference `createIssue` function structure):
  **Reference implementation from linearApi.js (agent makes API calls directly):**
  ```javascript
  // Agent reads this structure and makes Linear API calls directly
  // Execute immediately - do NOT create a script file
  await createIssue({
    title: `${integrationName} SDK Version Audit [Rudder SDK JS]`, // No brackets needed, Linear will format
    description: ticketDescription, // Use Individual Integration Ticket Template (see below)
    parentId: masterTicket.id, // From step 7
    priority: calculatedPriority, // 1-4 based on urgency (1=Urgent, 4=Low)
    dueDate: calculatedDueDate, // ISO format string (YYYY-MM-DD) or null
    labelIds: [], // Optional: add label IDs if labels exist
  });
  ```
- Create all subtickets in batch after analysis completes
  - Handle errors gracefully: if one ticket creation fails, log the error and continue with remaining integrations
  - Consider adding a small delay between ticket creations to avoid rate limiting
  - **Verification**: After all tickets are created, verify that:
    - Master ticket was created successfully (check for ticket ID and URL) - **MUST have actual ticket URL, not placeholder**
    - All integrations requiring action have corresponding subtickets - **MUST have actual ticket URLs**
    - Each subticket contains detailed analysis from codebase search and web_search findings
    - Priority and due dates are correctly assigned based on sunset dates and version gaps
    - Ticket descriptions include all relevant information from documentation review
  - **CRITICAL**: If tickets were not created (no ticket URLs in output), the audit has FAILED and must be retried

9. **Log analysis summary** (AFTER tickets are created)

  - After all analysis and ticket creation is complete, log a summary of what was done to console:
  - **MUST include actual Linear ticket URLs** - if URLs are missing, ticket creation failed

   ```javascript
   console.log('\n=== Integration SDK Version Audit Summary ===');
   console.log(`Total Integrations in versions.json: ${totalIntegrationsInFile}`);
   console.log(`Skipped (Non-versioned APIs): ${skippedCount}`);
   if (skippedCount > 0) {
     console.log(`  - ${skippedDestinations.map((d) => d.Destination).join(', ')}`);
   }
   console.log(`Coverage validation: ${coveragePassed ? 'PASSED' : 'FAILED'}`);
   if (!coveragePassed) {
     console.log(`  Missing analyses for: ${missingDestinations.join(', ')}`);
   }
   console.log(`Total Integrations Analyzed: ${totalIntegrations}`);
   console.log(`\nBy Category:`);
   console.log(`  - Action Required: ${actionRequiredCount}`);
   console.log(`  - No Action: ${noActionCount}`);
   console.log(`  - Unknown: ${unknownCount}`);
   console.log(`\nBy Priority:`);
   console.log(`  - Urgent (1): ${urgentCount}`);
   console.log(`  - High (2): ${highCount}`);
   console.log(`  - Medium (3): ${mediumCount}`);
   console.log(`  - Low (4): ${lowCount}`);
   console.log(`\nTickets Created:`);
   console.log(`  - Master Ticket: ${masterTicket.identifier} - ${masterTicket.url}`);
   console.log(`  - Subtickets: ${subticketsCreated} tickets created`);
   if (errors.length > 0) {
     console.log(`\nErrors Encountered: ${errors.length}`);
     errors.forEach((err) => console.log(`  - ${err}`));
   }
   console.log('\n=== End of Audit Summary ===\n');
   ```

10. **Verify analysis completion and ticket creation**

- **CRITICAL**: Verify that all versioned integrations were analyzed AND all required Linear tickets were created successfully
- **MUST verify**: Summary log includes actual Linear ticket URLs (not placeholders, not "pending", not "to be created")
- If ticket URLs are missing from the summary, ticket creation FAILED and the audit is incomplete
- Ensure the summary log includes any errors encountered during the process
- If any tickets failed to create, log the error and retry ticket creation before completing the audit

## Linear Ticket Templates

### Master Ticket Description Template

```markdown
## 🚨 Critical Issues (Urgent Priority)

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date] — Sunset: [Sunset Date] — Docs: [Link] — [Brief description]

## ⚠️ High Priority Updates

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date] — Sunset: [Sunset Date] — Docs: [Link] — [Brief description]

## 📋 Medium Priority Monitoring

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date] — Sunset: [Sunset Date] — Docs: [Link] — [Brief description]

## ✅ Low Priority / Up-to-Date

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Sunset: [Sunset Date or "None"] — Docs: [Link] — [Brief status]

## ✅ No Action Required (Up-to-Date & Compliant)

**Count**: [Number]

**Previous Analysis ([Number]):**

- **[Integration Name]** - [Brief reason - e.g., "Latest version v2.1.0, no deprecation announced"]
- **[Integration Name]** - [Brief reason - e.g., "Using current API v3, compliant with latest standards"]
- [Continue listing all integrations that require no action with brief status for each]

## ❓ Unknown / Pending Analysis

**Count**: [Number]

## ℹ️ Non-Versioned APIs (Skipped from Audit)

**Count**: [Number]

These destinations use non-versioned APIs and maintain backward compatibility without explicit versioning. No audit required as there are no version gaps, sunset dates, or migration paths to track.

- **[Destination Name]** - [Brief reason, e.g., "No versioning in API URL", "Not versioned (maintains backward compatibility)", "Uses custom configurable endpoint"]
- **[Destination Name]** - [Brief reason]
- [Continue listing all skipped non-versioned destinations with brief reason for each]
```

### Individual Integration Ticket Description Template

```markdown
## Current State

- Endpoint in use: [endpoint/version in code]
- Latest available: [latest version]
- Sunset date: [date or "None announced"]
- Urgency: [CRITICAL/HIGH/MEDIUM/LOW]

## References

- Docs: [link]
- Migration: [link if available]
- Changelog: [link if available]

## Actions

- [ ] Audit usage of [endpoint/version]
- [ ] Identify customer configs using this API
- [ ] Plan migration timeline to [target version] before [sunset date]

## Testing

- [ ] Verify backward compatibility
- [ ] Validate requests/responses on target version
- [ ] Update integration tests

## Risks & Rollback

- Risks: [breaking changes from docs]
- Rollback: Keep previous version callable until migration completes
```

## Date Parsing

Handle various date formats when parsing sunset dates. When multiple dates are present (e.g., multiple version ranges), use the earliest sunset date for priority calculation:

**Supported Formats:**

- "April 30, 2026" - Standard date format
- "April 28th, 2026" - Date with ordinal suffix
- "September 2025" - Month and year only (use last day of month)
- "@May 6, 2025" - Date with @ prefix
- "v17 @June 4, 2025" - Version prefix with date
- "2023-02-22 → till 2025-02-22" - Date range (use end date)
- "2023-02-22 → till 2025-02-22\n2024-06-15 → till 2026-06-15" - Multiple ranges (use earliest end date)

**Parsing Rules:**

- Extract the end date from ranges (after "→" or "till")
- For multiple ranges, use the earliest sunset date for urgency calculation
- For month-only dates (e.g., "September 2025"), use the last day of that month
- Handle ordinal suffixes (st, nd, rd, th) in dates

## Linear API Integration

Use the existing `.github/scripts/linearApi.js` module for ticket creation. Functions are called directly during the AI-assisted analysis process.

### Module Exports

- `createIssue({ title, description, parentId, priority, labelIds, dueDate, stateId, assigneeId, cycleId })` - Create a new Linear ticket
  - **Note**: Team ID is taken from `LINEAR_TEAM_ID` environment variable (not passed as parameter)
  - Parameters:
    - `title` (required), `description` (required)
    - `parentId` (optional), `priority` (optional, default: 3)
    - `labelIds` (optional array), `dueDate` (optional ISO string)
    - `stateId` (optional) - State/workflow status ID (e.g., "triage")
    - `assigneeId` (optional) - User ID to assign the ticket to
    - `cycleId` (optional) - Cycle ID to associate the ticket with
- `getStateId(stateName, teamId)` - Query Linear API to find state ID by name (e.g., "Queued")
- `getCurrentUserId()` - Query Linear API to get the current authenticated user's ID (uses `viewer` query)
- `getUserId(userName)` - Query Linear API to find user ID by name (for searching specific users)
- `getCurrentCycleId(teamId)` - Query Linear API to find the current/active cycle ID
- `listIssuesByParent(parentId, limit)` - List all subtickets for a parent ticket
- `updateIssueDescription(issueId, description)` - Update an existing ticket's description

### Environment Variables Required

- `LINEAR_API_KEY` - Linear API key for authentication (required)
- `LINEAR_TEAM_ID` - Linear team ID (UUID) where tickets will be created (required)

### Usage Notes

- **CRITICAL**: The `linearApi.js` file serves as a **reference implementation** for the AI agent
- The agent **reads** this file to understand the Linear GraphQL API structure (queries, mutations, parameters)
- The agent **makes Linear API calls directly** using its capabilities - it does NOT execute the Node.js code
- **DO NOT create a separate audit script file** (like `audit.js`) - tickets MUST be created during the audit process
- **Tickets are created immediately** after analysis completes, not deferred to a script execution
- The `LINEAR_TEAM_ID` environment variable must be set in the workflow environment
- If the agent attempts to create a script file instead of making API calls directly, it should be corrected to make the calls immediately

## Notes

- **Error Handling**:
  - Ambiguous sunset dates → Mark as "Unknown" category, Low priority (4)
  - Missing version info → Categorize as "Unknown", request manual review in ticket description
  - API errors (Linear API failures) → Log error with integration name, continue with remaining integrations, note failures in summary
  - Codebase search returns no results → Still create ticket if action required, note in ticket that "Integration may not be implemented in codebase or uses different naming"
  - Invalid date formats → Mark as "Unknown" category, include original date string in ticket for manual review
- **Edge Cases**: Handle "NA", "n/a", "Not applicable", "TBD", empty strings gracefully when parsing data
- **Non-versioned APIs**: Destinations with non-versioned APIs are automatically detected and skipped from analysis. These include destinations where versioning is explicitly marked as "not versioned", "not applicable", "no versioning", or similar indicators. No tickets are created for these destinations as they don't require version tracking or migration analysis.
