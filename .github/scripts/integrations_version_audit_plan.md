# Integration SDK Version Audit

## Overview

Conduct an AI-assisted audit of **every device mode integration in this repository**, discovered directly from `packages/analytics-js-integrations/src/integrations`, use Cursor's codebase search and documentation walkthrough capabilities to analyze deprecation risks and version information, then **immediately create or update** one Linear subticket for each integration requiring action using the `.github/scripts/linearApi.js` helper module.

## Key Files

- **Data Source**: `packages/analytics-js-integrations/src/integrations` - One folder per device mode integration. The vendor SDK URL is read from the integration's source files. There is no hard-coded integration list.
- **Linear API Helper**: `.github/scripts/linearApi.js` - Reference implementation for Linear API calls (agent uses this to understand API structure and makes calls directly)

**Important**: The workflow is performed entirely through AI-assisted analysis using Cursor's capabilities. The agent reads `linearApi.js` to understand the API structure, then makes Linear API calls directly using its capabilities. **Tickets are created immediately after analysis completes, not deferred to a script.**

**Environment Variables Required**:

- `LINEAR_API_KEY` - Required, Linear API key for authentication
- `LINEAR_TEAM_ID` - Required, Linear team ID (UUID) where tickets will be created

## Priority and Due Date Mapping

Use the first row that matches. Do not combine rows. An integration that matches no row needs no ticket.

| #   | Condition                                                                       | Priority   | Due date               |
| --- | ------------------------------------------------------------------------------- | ---------- | ---------------------- |
| 1   | Sunset date is in the past, or less than 90 days away                           | Urgent (1) | Tomorrow (next day)    |
| 2   | Sunset date is 90 to 180 days away                                              | High (2)   | Sunset date - 90 days  |
| 3   | Sunset date is 181 to 365 days away                                             | Medium (3) | Sunset date - 180 days |
| 4   | Sunset date is more than 365 days away                                          | Low (4)    | Sunset date - 180 days |
| 5   | No sunset date, and the loaded version is more than 2 major versions behind     | Medium (3) | null                   |
| 6   | No sunset date, and the loaded version is 1 or 2 major versions behind          | Low (4)    | null                   |
| 7   | No sunset date, and the loading method does not match the vendor's current docs | Low (4)    | null                   |

- **Sunset date**: the date on which the vendor stops serving or supporting the loaded SDK version, the script URL, or the product itself.
- **No sunset date, or a date that cannot be parsed**: leave `dueDate` null. Never invent a due date.
- Due dates are set before sunset dates to allow time for migration and testing.
- Use UTC for "today", "tomorrow" and every day count.

## Implementation Steps

### Phase 1: Integration Discovery and Grouping

1. **Discover every integration from the codebase**

- List every folder under `packages/analytics-js-integrations/src/integrations`. Each folder is one integration.
- **The integration name is the exact folder name** (for example `MoEngage`, `GA4_V2`, `INTERCOM`). Use it unchanged in every ticket title and every dedup search. A display name such as "Mo Engage" breaks the duplicate check on the next run.
- Read the source files in the folder. Skip the `test` and `__tests__` folders. The vendor SDK URL is usually in `nativeSdkLoader.js` or `browser.js`, but some integrations keep it in `constants.js`, `utils.js` or `util.js`.
- Extract every vendor SDK URL that the integration loads at runtime. Ignore URLs inside comments and documentation links.
- Some loaders build the URL from parts (a host constant, a path, a config value). Rebuild the full URL pattern and write each config value as `${name}`, for example `https://static.hotjar.com/c/hotjar-${siteId}.js`.
- Some integrations use the loader of another folder (`GA360` uses `GA`, `GA4_V2` uses `GA4`). Record the parent folder.
- **Do not use a hard-coded integration list.** The audit must cover all discovered folders on every run.

2. **Put each integration in one group** (the group decides which checks it needs)

Two checks exist:

- **Version check** - compare the loaded version with the vendor's latest release. Report the version gap, the sunset date and the migration path.
- **Loading-method check** - compare how we load and initialise the SDK (script URL, CDN host, snippet shape, init call) with the vendor's current public installation docs.

Use the first group that matches:

- **`versioned`** - at least one loaded URL holds a version.
  - A URL holds a version when its path, file name or query string pins any part of an SDK release number. The pin can be full (`sentry-cdn.com/6.13.1/`), partial (`web-sdk/5.9/braze.min.js`) or major only (`keen-tracking@4`, `mixpanel-2-latest.min.js`, `/versions/2/`, `/v001/`, `?version=2`).
  - **When in doubt, choose `versioned`.** If the vendor has no release line for the number, the version check gives no result, and only the loading-method check counts.
  - Use only the version in the URL. Ignore a snippet version constant inside the loader code.
  - Version check **and** loading-method check.
  - Compare at the precision that the URL gives. For `keen-tracking@4`, compare the major version only.
  - Some integrations can load more than one version, selected by configuration (for example Amplitude). Report each version. Use the oldest one for the priority.
- **`unversioned`** - the integration loads a vendor script, and no URL holds a version. This covers a "latest" URL (`js.userpilot.io/sdk/latest.js`), a fixed script name (`connect.facebook.net/en_US/fbevents.js`) and a URL built from customer configuration (`cdn.heapanalytics.com/js/heap-${apiKey}.js`).
  - Loading-method check. No version gap exists, so also look for an announced deprecation of the script, the snippet or the product.
  - Do **not** skip these. A vendor can change the install method, the CDN host or the init API with no version in our URL.
- **`no-vendor-script`** - the integration injects no script of its own. Three cases exist:
  - **Wrapper** - it uses the loader of a parent integration. Run no check of its own, because the parent's finding covers it. Create no subticket for the wrapper. Name the wrapper in the parent's subticket.
  - **Customer-loaded SDK** - it calls a vendor global that the customer's page loads (for example Optimizely). Check that the vendor's current docs still document the global and the methods that our code calls. A removed or deprecated method is a loading-method mismatch.
  - **No vendor SDK** - it sends data with plain requests or pixels (for example Lotame, Shynet). Run no check. The category is No Action, with the reason "no vendor SDK".

A vendor SDK copy that is served from a RudderStack host (for example `cdn.rudderlabs.com`) is still a vendor script. Group it by the rules above.

3. **Record the discovered set**

- Build `discoveredIntegrations` with the name and the group of each integration. The coverage check in step 6a uses it.

### Phase 2: Analysis with Cursor

4. **Analyze integrations using Cursor**

- For each discovered integration, run the checks its group requires (see Phase 1, step 2):
  - **Codebase Search**: Use Cursor's semantic codebase search to:
    - Find integration implementation files
    - Search for version indicators (SDK URLs, SDK versions, version constants)
    - Identify current version usage in the codebase
  - **Documentation Walkthrough**: Use Cursor's `web_search` tool to:
    - Search and review the vendor's official SDK documentation, release notes and CDN version list
    - Search for and analyze migration guides and changelogs
    - Search for deprecation timelines and breaking changes information
    - Verify latest version availability and release dates
    - Check for any announced deprecations or sunset dates for the loaded SDK version
    - Gather detailed version upgrade requirements and migration steps
    - Read the vendor's current installation/quick-start docs and compare them with our loader: script URL, CDN host, snippet shape and init call
  - **Cross-reference**: Compare the SDK URL found in the codebase with the vendor's latest version and documentation
  - **Identify gaps**: Flag discrepancies between the loaded SDK version, the integration code and the official documentation
  - **Loading method**: State explicitly whether our loading method still matches the vendor's current public docs.
    - **The vendor's main install page decides.** This is the page that the vendor's docs present first for a new browser install.
    - Our loading method **matches** when the main install page, or a current page that it links to, documents our script URL, our snippet shape and our init call. Compare the host, the path and the names of the query parameters. Ignore the values of customer parameters.
    - Our loading method is a **mismatch** in every other case. A method that the vendor documents only on a page marked legacy, classic, deprecated or old is a mismatch. A method that the vendor still supports but no longer shows is a mismatch.
    - A vendor preference for another install method (for example npm or a loader script) is not a mismatch while a current page still documents our method.
  - **Sources**: Keep the source URL for every fact. If a page gives no answer, write "not found". Never fill a gap from memory.

- **Research effort** - the audit has no value for an integration that you did not research:
  - Research one integration at a time. Do not put several vendors in one search.
  - Do not shorten the research to save time. A complete run matters more than a fast run.
  - Almost every vendor in this repository has public installation docs. "Documentation not found" is a rare result.
  - Before you write "documentation not found" for a vendor, try all four sources in this order:
    1. A web search for the vendor's install docs, for example "[vendor] JavaScript SDK installation" and "[vendor] tracking code install".
    2. The vendor's docs sites, for example `docs.[vendor domain]`, `developers.[vendor domain]` and `help.[vendor domain]`. Take the vendor domain from the loaded script URL.
    3. The vendor's public GitHub repository and npm package for the web SDK.
    4. A web search for the exact script file name or host that our loader uses.
  - If one source fails, try the next one. A failed page load or an empty search is not a result.

### Phase 3: Priority Calculation and Categorization

5. **Calculate priority and due dates**

- Parse sunset dates (see Date Parsing section for supported formats)
- For multiple sunset dates in one field, use the earliest one for priority calculation
- Calculate days until sunset (from today to sunset date)
- Extract major version numbers for comparison:
  - "v22.0" → 22
  - "22" → 22
  - "v1.76.0" → 1
  - "5.9" → 5
  - "@4" → 4
- Apply the table in "Priority and Due Date Mapping". Use the first row that matches.
- Handle edge cases: "TBD", "Not mentioned", "NA", "n/a", "Not applicable", "not found", ambiguous dates → treat as no sunset date, and put the original text in the ticket

6. **Categorize integrations**

Each integration gets exactly one category. A wrapper is the exception: record it as "covered by [parent]" and give it no category.

Decide in this order:

1. **Action Required**: a row of the priority table matches on facts that you verified. Missing facts do not change this. Name each missing fact in the ticket.
2. **Unknown**: no row matches, and a fact that could make a row match is missing. Examples:
   - The loaded version cannot be determined (a `versioned` URL, or a RudderStack-hosted copy)
   - The vendor's documentation cannot be found or read after all four sources of step 4, so the latest version or the loading method is not known
3. **No Action**: no row matches, and no fact is missing. This means no sunset date, the same major version as the latest release, and a loading method that matches the vendor's current docs. A minor or patch gap alone is No Action. Report the gap in the master ticket.

An Unknown integration gets no subticket. List it in the summary log, with the reason. For "documentation not found", the reason names each source that you tried.

**Unknown limit**: if more than 10 integrations are Unknown, the research was too shallow. Repeat step 4 one time for the Unknown integrations, then categorize them again.

6a. **Enforce full coverage of discovered integrations** (AFTER the analysis, BEFORE any ticket)

- Track every integration that got a category (`analyzedIntegrations`). A wrapper counts as analyzed when its parent is analyzed.
- **Hard rule**: if any discovered integration is missing from `analyzedIntegrations`, stop. Skip Phase 4. Print the summary of step 9 with the missing names, then print `AUDIT_RESULT: FAILED - coverage check` as the last line of the output.
- Example check:
  ```javascript
  const discoveredNames = new Set(discoveredIntegrations.map(i => i.name));
  const analyzedNames = new Set(analyzedIntegrations.map(i => i.name));
  const missing = [...discoveredNames].filter(n => !analyzedNames.has(n));
  const coveragePassed = missing.length === 0;
  ```

### Phase 4: Duplicate Detection and Linear Ticket Creation (MUST EXECUTE IMMEDIATELY)

**⚠️ CRITICAL**: This phase MUST be executed during the audit. Do NOT create a script file. Do NOT defer ticket creation. Make Linear API calls directly using the agent's capabilities.

**⚠️ DEDUPLICATION**: Before creating any ticket, always check for an existing open ticket. Never create a duplicate.

**Zero findings is a valid result.** If no integration is "Action Required", create and update no ticket, and go to step 9.

7. **Classify integrations and check for existing subtickets** (EXECUTE FIRST)

- Read `.github/scripts/linearApi.js` to understand the API structure, including the dedup functions `findOpenSubticketGlobally` and `searchIssues`.
- For each integration categorized as "Action Required", search for an existing open subticket with `findOpenSubticketGlobally(integrationName)`. This searches across ALL open master tickets of this repository.
- A ticket is open when its status type is `triage`, `backlog`, `unstarted` or `started`. Match the status type, never the status name.
- The subticket title must equal `getSubticketTitle(integrationName)` in full, ignoring letter case. A partial match is not a duplicate: a search for `Engage` also returns the `MoEngage` ticket.
- The parent of the subticket must be a master audit ticket of this repository. The master can be open or closed.
- Search only for "Action Required" integrations. Do not edit or close the open subticket of an integration that is now No Action or Unknown. A person closes it.
- **A failed search is not "no duplicate".** If a search call returns an error, retry it. If it still fails, create no ticket for that integration and record the error.
- Separate the integrations into two lists: **updates** (an open subticket exists) and **new** (no open subticket).

  ```javascript
  const {
    createIssue,
    getStateId,
    getCurrentCycleId,
    findOpenSubticketGlobally,
    getSubticketTitle,
    listIssuesByParent,
    updateIssue,
    updateIssueDescription,
    MAINTENANCE_PROJECT_ID,
    KTLO_LABEL_ID,
    VERSION_UPGRADE_LABEL_ID,
  } = require('./.github/scripts/linearApi');

  const updatableIntegrations = []; // existing open subticket found
  const newIntegrations = []; // no existing subticket
  const errors = [];

  for (const integration of actionRequiredIntegrations) {
    let existingSub;
    try {
      existingSub = await findOpenSubticketGlobally(integration.name);
    } catch {
      try {
        existingSub = await findOpenSubticketGlobally(integration.name); // retry one time
      } catch (error) {
        // No ticket for this integration: a failed search is not "no duplicate"
        errors.push(`Duplicate search failed for ${integration.name}: ${error.message}`);
        continue;
      }
    }
    if (existingSub) {
      updatableIntegrations.push({ integration, existingSub });
    } else {
      newIntegrations.push(integration);
    }
  }

  console.log(`Integrations to update: ${updatableIntegrations.length}`);
  console.log(`New integrations: ${newIntegrations.length}`);
  ```

8. **Update existing subtickets in place**

- Update each existing open subticket under its current parent master ticket. Do not move it.
- Keep the existing due date when it is earlier than the calculated one, or when no due date is calculated. An Urgent ticket must not move to "tomorrow" on every run.
- Track the parent master IDs of all updated subtickets, so their descriptions can be refreshed in step 8b.

  ```javascript
  const affectedMasterIds = new Set();
  const earlierDate = (a, b) => (a && b ? (a < b ? a : b) : a || b); // ISO dates (YYYY-MM-DD) or null

  for (const { integration, existingSub } of updatableIntegrations) {
    console.log(`Updating existing subticket: ${existingSub.identifier} for ${integration.name}`);
    await updateIssue(existingSub.id, {
      description: ticketDescription,
      priority: calculatedPriority,
      dueDate: earlierDate(existingSub.dueDate, calculatedDueDate),
    });
    affectedMasterIds.add(existingSub.parentId);
    // Track as "updated" (not "created") in the summary - store { identifier, url }
  }
  ```

8a. **Create a new master ticket only if there are new integrations**

- **If `newIntegrations` is empty**: create no master ticket. Log: `No new integrations found - skipping master ticket creation.`
- **If `newIntegrations` has entries**: create one master ticket for this run, then create the subtickets under it.

  ```javascript
  let newMasterTicket = null;

  if (newIntegrations.length > 0) {
    const statusStateId = await getStateId('Queued', LINEAR_TEAM_ID);
    const currentCycleId = await getCurrentCycleId(LINEAR_TEAM_ID);

    if (!statusStateId)
      console.warn(
        'Warning: Could not find "Queued" state. Ticket will be created without status.',
      );
    if (!currentCycleId)
      console.warn('Warning: Could not find current cycle. Ticket will be created without cycle.');

    newMasterTicket = await createIssue({
      title: `Integration SDK Version Audit [Rudder SDK JS] [${runDate}]`, // runDate: today in UTC, DD/MM/YYYY
      description: '', // Placeholder - updated in step 8b once subticket URLs exist
      priority: 3, // Medium priority
      stateId: statusStateId, // Status: Queued
      cycleId: currentCycleId, // Current cycle
      projectId: MAINTENANCE_PROJECT_ID,
      labelIds: [KTLO_LABEL_ID, VERSION_UPGRADE_LABEL_ID],
    });
    console.log(
      `Created new master ticket: ${newMasterTicket.identifier} - ${newMasterTicket.url}`,
    );

    for (const integration of newIntegrations) {
      console.log(`Creating new subticket for ${integration.name}`);
      await createIssue({
        title: getSubticketTitle(integration.name), // "<folder name> SDK Version Audit [Rudder SDK JS]"
        description: ticketDescription, // Use Individual Integration Ticket Template (see below)
        parentId: newMasterTicket.id,
        priority: calculatedPriority, // 1-4 based on urgency (1=Urgent, 4=Low)
        dueDate: calculatedDueDate, // ISO format string (YYYY-MM-DD) or null
        labelIds: [],
      });
      // Track as "created" in the summary
    }
  }
  ```

- **Title rule**: keep the `[Rudder SDK JS]` marker in every title. The rudder-transformer audit uses `[Rudder Transformer]`, and a shared marker would mix the two audits.
- Handle errors gracefully: if one ticket creation or update fails, log the error and continue with the remaining integrations.
- Consider a small delay between ticket calls to avoid rate limiting.
- **Verification**: after all tickets are created or updated, verify that:
  - Every integration requiring action has a subticket - **MUST have an actual ticket URL**
  - Each subticket contains the analysis from the codebase search and the web_search findings
  - Priority and due dates match the priority table
- **CRITICAL**: if an integration is "Action Required" and the output holds no ticket URL for it, the audit has FAILED. Never invent a ticket URL.

8b. **Refresh the descriptions of all affected master tickets** (AFTER all subtickets are created or updated)

- Refresh the description of every master ticket that had a subticket created or updated in this run. This covers the new master ticket and every master in `affectedMasterIds`.
- Build each description from the Master Ticket Description Template.
- For a new master, fill every section with the results of this run.
- For an older master, rebuild only the four priority sections from its own open subtickets. Leave its other sections unchanged.

  ```javascript
  const mastersToRefresh = new Set(affectedMasterIds);
  if (newMasterTicket) {
    mastersToRefresh.add(newMasterTicket.id);
  }

  for (const masterId of mastersToRefresh) {
    const subtickets = await listIssuesByParent(masterId);
    const refreshedDescription = masterDescriptionFromTemplate; // Master Ticket Description Template
    await updateIssueDescription(masterId, refreshedDescription);
    console.log(`Refreshed master ticket description: ${masterId}`);
  }
  ```

9. **Log analysis summary** (AFTER tickets are created or updated)

- After all analysis and ticket creation is complete, log a summary of what was done to console:
- **MUST include the actual Linear URL** of every ticket that this run created or updated
- **MUST distinguish** between updated tickets and newly created ones
- **MUST end with the result line.** The last line of the output is `AUDIT_RESULT: PASSED`, or `AUDIT_RESULT: FAILED - <reason>`. The workflow reads this line to pass or fail the run.

```javascript
console.log('\n=== Integration SDK Version Audit Summary ===');
console.log(`Total Integrations discovered in codebase: ${totalIntegrationsDiscovered}`);
console.log(`  - versioned (version check and loading-method check): ${versionedCount}`);
console.log(`  - unversioned (loading-method check only): ${unversionedCount}`);
console.log(`  - no-vendor-script: ${noVendorScriptCount}`);
console.log(`Coverage validation: ${coveragePassed ? 'PASSED' : 'FAILED'}`);
if (!coveragePassed) {
  console.log(`  Missing analyses for: ${missing.join(', ')}`);
}
console.log(`\nBy Category:`);
console.log(`  - Action Required: ${actionRequiredCount}`);
console.log(`  - No Action: ${noActionCount}`);
console.log(`  - Unknown: ${unknownCount}`);
unknownIntegrations.forEach(i => console.log(`      ${i.name}: ${i.reason}`));
console.log(`  - Wrappers (covered by parent): ${wrapperCount}`);
wrapperIntegrations.forEach(i => console.log(`      ${i.name}: covered by ${i.parent}`));
console.log(`\nBy Priority:`);
console.log(`  - Urgent (1): ${urgentCount}`);
console.log(`  - High (2): ${highCount}`);
console.log(`  - Medium (3): ${mediumCount}`);
console.log(`  - Low (4): ${lowCount}`);
console.log(`\nTickets:`);
if (newMasterTicket) {
  console.log(`  - New Master Ticket: ${newMasterTicket.identifier} - ${newMasterTicket.url}`);
} else {
  console.log(`  - No new master ticket created`);
}
console.log(`  - Masters refreshed: ${mastersToRefresh.size}`);
console.log(`  - Subtickets created: ${subticketsCreated}`);
console.log(`  - Subtickets updated (existing): ${subticketsUpdated}`);
console.log(`\nSubticket URLs:`);
for (const sub of allSubticketResults) {
  console.log(`  - ${sub.integrationName}: ${sub.identifier} - ${sub.url} (${sub.action})`);
}
if (errors.length > 0) {
  console.log(`\nErrors Encountered: ${errors.length}`);
  errors.forEach(err => console.log(`  - ${err}`));
}
console.log('\n=== End of Audit Summary ===\n');
console.log(auditPassed ? 'AUDIT_RESULT: PASSED' : `AUDIT_RESULT: FAILED - ${failureReason}`);
```

10. **Verify analysis completion and ticket creation**

- **CRITICAL**: Verify that all discovered integrations were analyzed AND all required Linear tickets were created or updated successfully
- The audit has PASSED only when the coverage check passed, and every "Action Required" integration has a real ticket URL (not a placeholder, not "pending", not "to be created")
- A run with zero "Action Required" integrations has PASSED with no ticket URL
- Ensure the summary log includes any errors encountered during the process
- If a ticket failed to create or update, retry it once. If it still fails, the audit has FAILED.

## Linear Ticket Templates

### Master Ticket Description Template

List each integration in exactly one section.

```markdown
## 🚨 Critical Issues (Urgent Priority)

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date] — Sunset: [Sunset Date] — Docs: [Link] — [Brief description]

## ⚠️ High Priority Updates

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date] — Sunset: [Sunset Date] — Docs: [Link] — [Brief description]

## 📋 Medium Priority Monitoring

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Due: [Date or "None"] — Sunset: [Sunset Date or "None"] — Docs: [Link] — [Brief description]

## 🔽 Low Priority

**Count**: [Number]

- **[Integration Name]** ([Ticket URL]) — Sunset: [Sunset Date or "None"] — Docs: [Link] — [Brief description]

## ✅ No Action Required

**Count**: [Number]

- **[Integration Name]** - [Group] - [Brief reason, e.g., "Loads 7.0, latest is 7.2, same major", "Loader matches current vendor docs"]
- [Continue listing every integration that requires no action]

## ❓ Unknown (Manual Review Needed)

**Count**: [Number]

- **[Integration Name]** - [Reason, e.g., "Vendor docs not found", "Version of the hosted copy is not visible"]

## ℹ️ Wrappers (Covered by the Parent Integration)

**Count**: [Number]

- **[Integration Name]** - Uses the loader of **[Parent Integration Name]**
```

### Individual Integration Ticket Description Template

```markdown
## Current State

- Group: [versioned/unversioned/no-vendor-script]
- SDK URL in code: [URL, with the file path that loads it. One line per URL.]
- Version in use: [version or "Not in the URL"]
- Latest available: [latest version or "Not applicable"]
- Sunset date: [date or "None announced"]
- Loading method: [Matches the vendor's current docs / Mismatch: what changed]
- Priority: [Urgent/High/Medium/Low] - [the row of the priority table that matched]
- Wrappers covered: [wrapper integration names or "None"]

## References

- Docs: [link]
- Migration: [link if available]
- Changelog: [link if available]

## Actions

- [ ] Review the breaking changes between [version in use] and [target version]
- [ ] Update the loader to [target version or the new loading method]
- [ ] [Only with a sunset date] Complete the migration before [sunset date]
- [ ] [Only when the vendor shut the product down] Decide: remove the integration or migrate it

## Testing

- [ ] Verify that the SDK loads and `isLoaded()` and `isReady()` return true
- [ ] Verify that each supported event type reaches the vendor
- [ ] Update the integration unit tests

## Risks & Rollback

- Risks: [breaking changes from docs]
- Rollback: Revert the loader to the previous SDK URL
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

Use the existing `.github/scripts/linearApi.js` module for ticket creation and deduplication. Functions are called directly during the AI-assisted analysis process.

### Module Exports

- `createIssue({ title, description, parentId, priority, labelIds, dueDate, stateId, assigneeId, cycleId, projectId })` - Create a new Linear ticket
  - **Note**: Team ID is taken from `LINEAR_TEAM_ID` environment variable (not passed as parameter)
  - Parameters:
    - `title` (required), `description` (required)
    - `parentId` (optional), `priority` (optional, 1-4)
    - `labelIds` (optional array), `dueDate` (optional ISO string)
    - `stateId` (optional) - State/workflow status ID, from `getStateId('Queued', teamId)`
    - `assigneeId` (optional) - User ID to assign the ticket to
    - `cycleId` (optional) - Cycle ID to associate the ticket with
    - `projectId` (optional) - Project ID to associate the ticket with
- `getStateId(stateName, teamId)` - Query Linear API to find state ID by name (e.g., "Queued")
- `getCurrentUserId()` - Query Linear API to get the current authenticated user's ID (uses `viewer` query)
- `getUserId(userName)` - Query Linear API to find user ID by name (for searching specific users)
- `getCurrentCycleId(teamId)` - Query Linear API to find the current/active cycle ID
- `listIssuesByParent(parentId, limit)` - List all subtickets for a parent ticket
- `updateIssue(issueId, fields)` - Update any fields on an existing ticket (e.g., `{ description, priority, dueDate }`)
- `updateIssueDescription(issueId, description)` - Convenience wrapper that only updates the description

**Duplicate Detection (MUST use before creating tickets):**

- `searchIssues({ titleContains, teamId, stateTypes, limit })` - Search tickets by title substring, optionally filtered by workflow status types. Throws on an API error.
- `getSubticketTitle(integrationName)` - Build the full subticket title: `<integration name> SDK Version Audit [Rudder SDK JS]`
- `findOpenSubticketGlobally(integrationName)` - Find an open subticket for one integration across ALL master audit tickets of this repository. Accepts only a full title match under a master of this repository, open or closed. Returns the newest match (including `parentId`) or null.

**Title markers:**

- `MASTER_TITLE_MARKER` - `Integration SDK Version Audit [Rudder SDK JS]`
- **Never change the marker to `[Rudder Transformer]`.** That marker belongs to the rudder-transformer audit, and a shared marker would make this audit update that repository's tickets.

**Hardcoded Constants (for master ticket creation):**

- `MAINTENANCE_PROJECT_ID` - Project ID for the maintenance project
- `KTLO_LABEL_ID` - Label ID for KTLO under Type
- `VERSION_UPGRADE_LABEL_ID` - Label ID for VersionUpgrade under KTLO Type

### Environment Variables Required

- `LINEAR_API_KEY` - Linear API key for authentication (required)
- `LINEAR_TEAM_ID` - Linear team ID (UUID) where tickets will be created (required)

### Usage Notes

- **CRITICAL**: The `linearApi.js` file serves as a **reference implementation** for the AI agent
- The agent **reads** this file to understand the Linear API structure (queries, mutations, parameters)
- The agent **makes Linear API calls directly** using its capabilities - it does NOT execute the Node.js code
- Direct calls go to the Linear GraphQL endpoint `https://api.linear.app/graphql`, with the header `Authorization: <LINEAR_API_KEY>`
- **DO NOT create a separate audit script file** (like `audit.js`) - tickets MUST be created during the audit process
- **Tickets are created immediately** after analysis completes, not deferred to a script execution
- The `LINEAR_TEAM_ID` environment variable must be set in the workflow environment
- If the agent attempts to create a script file instead of making API calls directly, it should be corrected to make the calls immediately
- **DEDUPLICATION IS MANDATORY**: Before creating any subticket, the agent MUST call `findOpenSubticketGlobally(integrationName)`. If an open subticket exists, update it in place. Only create a new subticket (under a new master) when no open match is found.

## Notes

- **Error Handling**:
  - Ambiguous or invalid sunset dates → treat as no sunset date, include the original date string in the ticket for manual review
  - Missing version info on a `versioned` integration → Categorize as "Unknown", state the reason
  - API errors (Linear API failures) → Log error with integration name, continue with remaining integrations, note failures in summary. The audit result is FAILED.
- **Edge Cases**: Handle "NA", "n/a", "Not applicable", "TBD", empty strings gracefully when parsing data
- **No version in the URL**: An `unversioned` integration is never skipped. It gets the loading-method check, and a mismatch creates a ticket.
