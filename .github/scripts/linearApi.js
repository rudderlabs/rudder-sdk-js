// Linear API helper for Integration SDK Version Audit workflow
// Reference implementation using @linear/sdk

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

if (!LINEAR_API_KEY) {
  throw new Error('LINEAR_API_KEY environment variable is required');
}
if (!LINEAR_TEAM_ID) {
  throw new Error('LINEAR_TEAM_ID environment variable is required');
}

const { LinearClient } = require('@linear/sdk');
const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });

// Hardcoded Linear IDs for master ticket creation
const MAINTENANCE_PROJECT_ID = 'f99cafb5-7d4a-4549-8c77-afe2644feba9'; // Integrations: Maintenance Project
const KTLO_LABEL_ID = '68c1ca4f-cc21-4c28-9ce5-618a8b39c788'; // Type: KTLO
const VERSION_UPGRADE_LABEL_ID = '2ee64e36-d577-4b4b-9ae4-e7292db061d4'; // KTLO Type: VersionUpgrade

// Status types, not status names: a team can add or rename an open status at any time
const OPEN_STATE_TYPES = ['triage', 'backlog', 'unstarted', 'started'];

// The rudder-transformer audit files into the same Linear team with [Rudder Transformer].
// A shared marker would make one audit update the other audit's tickets.
const MASTER_TITLE_MARKER = 'Integration SDK Version Audit [Rudder SDK JS]';
const SUBTICKET_TITLE_SUFFIX = 'SDK Version Audit [Rudder SDK JS]';

async function getStateId(stateName, teamId) {
  try {
    const team = await linearClient.team(teamId);
    const states = await team.states();
    const state = states.nodes.find(s => s.name.toLowerCase() === stateName.toLowerCase());
    if (!state) {
      console.warn(
        `State "${stateName}" not found. Available states: ${states.nodes.map(s => s.name).join(', ')}`,
      );
      return null;
    }
    return state.id;
  } catch (error) {
    console.error(`Error fetching state ID for "${stateName}":`, error.message);
    return null;
  }
}

async function getCurrentUserId() {
  try {
    const viewer = await linearClient.viewer;
    return viewer?.id || null;
  } catch (error) {
    console.error('Error fetching current user ID:', error.message);
    return null;
  }
}

async function getUserId(userName) {
  try {
    const users = await linearClient.users();
    const user = users.nodes.find(
      u =>
        u.name?.toLowerCase().includes(userName.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(userName.toLowerCase()) ||
        u.email?.toLowerCase().includes(userName.toLowerCase()),
    );
    return user?.id || null;
  } catch (error) {
    console.error(`Error fetching user ID for "${userName}":`, error.message);
    return null;
  }
}

async function getCurrentCycleId(teamId) {
  try {
    const team = await linearClient.team(teamId);
    const cycle = await team.activeCycle;
    return cycle?.id || null;
  } catch (error) {
    console.error('Error fetching current cycle ID:', error.message);
    return null;
  }
}

async function searchIssues({ titleContains, teamId, stateTypes, limit = 50 }) {
  try {
    const filter = {
      team: { id: { eq: teamId || LINEAR_TEAM_ID } },
      title: { containsIgnoreCase: titleContains },
    };
    if (stateTypes && stateTypes.length > 0) {
      filter.state = { type: { in: stateTypes } };
    }
    const issues = await linearClient.issues({ filter, first: limit });
    return Promise.all(
      issues.nodes.map(async issue => {
        const state = await issue.state;
        const parent = await issue.parent;
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          priority: issue.priority,
          url: issue.url,
          dueDate: issue.dueDate,
          state: { name: state?.name },
          parentId: parent?.id || null,
        };
      }),
    );
  } catch (error) {
    console.error(`Error searching issues with title "${titleContains}":`, error.message);
    // An empty result would read as "no duplicate" and let the caller create one
    throw error;
  }
}

const getIssueNumber = identifier => parseInt(identifier.replace(/\D+/g, ''), 10) || 0;

const getSubticketTitle = integrationName => `${integrationName} ${SUBTICKET_TITLE_SUFFIX}`;

async function findOpenSubticketGlobally(integrationName) {
  // Closed masters count too: people close a master and leave its subtickets open
  const masterResults = await searchIssues({ titleContains: MASTER_TITLE_MARKER, limit: 250 });
  const auditMasterIds = new Set(
    masterResults.filter(issue => !issue.parentId).map(issue => issue.id),
  );

  const subticketTitle = getSubticketTitle(integrationName);
  const results = await searchIssues({
    titleContains: subticketTitle,
    stateTypes: OPEN_STATE_TYPES,
  });

  // The search matches a part of the title, so "Engage" also returns the "MoEngage" ticket
  const validSubs = results
    .filter(
      issue =>
        issue.title.toLowerCase() === subticketTitle.toLowerCase() &&
        auditMasterIds.has(issue.parentId),
    )
    .sort((a, b) => getIssueNumber(b.identifier) - getIssueNumber(a.identifier));

  return validSubs.length > 0 ? validSubs[0] : null;
}

async function createIssue({
  title,
  description,
  parentId,
  priority,
  labelIds,
  dueDate,
  stateId,
  assigneeId,
  cycleId,
  projectId,
}) {
  try {
    const result = await linearClient.createIssue({
      teamId: LINEAR_TEAM_ID,
      title,
      description,
      parentId,
      priority,
      labelIds,
      dueDate,
      stateId,
      assigneeId,
      cycleId,
      projectId,
    });
    // Linear SDK createIssue returns { _issue: { id }, success, lastSyncId }
    // Check if result has an 'issue' property (promise/getter) or use _issue.id
    const issueId = result.issue ? (await result.issue).id : result._issue?.id || result.id;
    if (!issueId) {
      throw new Error('Failed to create issue: no issue ID returned');
    }
    // Fetch full issue details to get identifier, title, url
    const issue = await linearClient.issue(issueId);
    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
    };
  } catch (error) {
    console.error('Error creating issue:', error.message);
    throw error;
  }
}

async function listIssuesByParent(parentId, limit = 250) {
  try {
    const issues = await linearClient.issues({
      filter: { parent: { id: { eq: parentId } } },
      first: limit,
    });
    return Promise.all(
      issues.nodes.map(async issue => {
        const state = await issue.state;
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          priority: issue.priority,
          url: issue.url,
          dueDate: issue.dueDate,
          state: { name: state?.name },
        };
      }),
    );
  } catch (error) {
    console.error(`Error listing issues by parent "${parentId}":`, error.message);
    throw error;
  }
}

async function updateIssue(issueId, fields) {
  try {
    const result = await linearClient.updateIssue(issueId, fields);
    if (!result.success) {
      throw new Error('Linear did not apply the update');
    }
    // Linear SDK updateIssue returns { _issue: { id }, success, lastSyncId }
    // Check if result has an 'issue' property (promise/getter) or use _issue.id
    const updatedIssueId = result.issue
      ? (await result.issue).id
      : result._issue?.id || result.id || issueId;
    // Fetch full issue details to get identifier, title, url
    const issue = await linearClient.issue(updatedIssueId);
    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
    };
  } catch (error) {
    console.error(`Error updating issue "${issueId}":`, error.message);
    throw error;
  }
}

async function updateIssueDescription(issueId, description) {
  return updateIssue(issueId, { description });
}

module.exports = {
  createIssue,
  listIssuesByParent,
  updateIssue,
  updateIssueDescription,
  getStateId,
  getUserId,
  getCurrentUserId,
  getCurrentCycleId,
  searchIssues,
  getSubticketTitle,
  findOpenSubticketGlobally,
  MAINTENANCE_PROJECT_ID,
  KTLO_LABEL_ID,
  VERSION_UPGRADE_LABEL_ID,
  MASTER_TITLE_MARKER,
};
