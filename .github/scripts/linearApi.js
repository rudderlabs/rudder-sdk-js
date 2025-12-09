// Linear API helper for @audit.md workflow to create and manage Linear tickets using the Linear GraphQL API

const axios = require('axios');

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

if (!LINEAR_API_KEY) {
  console.error('LINEAR_API_KEY is required');
  process.exit(1);
}
if (!LINEAR_TEAM_ID) {
  console.error('LINEAR_TEAM_ID is required');
  process.exit(1);
}

const linearClient = axios.create({
  baseURL: 'https://api.linear.app',
  headers: {
    Authorization: LINEAR_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

async function getStateId(stateName, teamId) {
  const query = `
    query GetState($teamId: String!) {
      team(id: $teamId) {
        states {
          nodes {
            id
            name
            type
          }
        }
      }
    }
  `;

  try {
    const res = await linearClient.post('/graphql', { query, variables: { teamId } });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    const states = res.data.data.team.states.nodes;
    const state = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
    if (!state) {
      console.warn(
        `State "${stateName}" not found. Available states: ${states.map((s) => s.name).join(', ')}`,
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
  const query = `
    query {
      viewer {
        id
        name
        email
      }
    }
  `;

  try {
    const res = await linearClient.post('/graphql', { query });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    const viewer = res.data.data.viewer;
    if (!viewer || !viewer.id) {
      console.warn('Could not retrieve current user ID from viewer.');
      return null;
    }
    return viewer.id;
  } catch (error) {
    console.error('Error fetching current user ID:', error.message);
    return null;
  }
}

async function getUserId(userName) {
  const query = `
    query GetUsers {
      users {
        nodes {
          id
          name
          email
          displayName
        }
      }
    }
  `;

  try {
    const res = await linearClient.post('/graphql', { query });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    const users = res.data.data.users.nodes;
    const user = users.find(
      (u) =>
        u.name?.toLowerCase().includes(userName.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(userName.toLowerCase()) ||
        u.email?.toLowerCase().includes(userName.toLowerCase()),
    );
    if (!user) {
      console.warn(`User "${userName}" not found.`);
      return null;
    }
    return user.id;
  } catch (error) {
    console.error(`Error fetching user ID for "${userName}":`, error.message);
    return null;
  }
}

async function getCurrentCycleId(teamId) {
  const query = `
    query GetCurrentCycle($teamId: String!) {
      team(id: $teamId) {
        activeCycle {
          id
          name
        }
      }
    }
  `;

  try {
    const res = await linearClient.post('/graphql', { query, variables: { teamId } });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    const activeCycle = res.data.data.team.activeCycle;
    if (!activeCycle) {
      console.warn('No active cycle found for team.');
      return null;
    }
    return activeCycle.id;
  } catch (error) {
    console.error('Error fetching current cycle ID:', error.message);
    return null;
  }
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
  const mutation = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      title,
      description,
      teamId: LINEAR_TEAM_ID,
      parentId: parentId,
      priority: priority ?? 3,
      labelIds: labelIds,
      dueDate: dueDate,
      stateId: stateId,
      assigneeId: assigneeId,
      cycleId: cycleId,
      projectId: projectId,
    },
  };

  try {
    const res = await linearClient.post('/graphql', { query: mutation, variables });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    return res.data.data.issueCreate.issue;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Linear API error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

async function listIssuesByParent(parentId, limit = 250) {
  const query = `
    query IssuesByParent($parentId: ID!, $first: Int!) {
      issues(filter: { parent: { id: { eq: $parentId } } }, first: $first) {
        nodes {
          id
          identifier
          title
          priority
          url
          dueDate
          state { name }
        }
      }
    }
  `;

  const variables = { parentId, first: limit };
  try {
    const res = await linearClient.post('/graphql', { query, variables });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    return res.data.data.issues.nodes;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Linear API error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

async function updateIssueDescription(issueId, description) {
  const mutation = `
    mutation UpdateIssue($id: String!, $description: String!) {
      issueUpdate(id: $id, input: { description: $description }) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const variables = { id: issueId, description };
  try {
    const res = await linearClient.post('/graphql', { query: mutation, variables });
    if (res.data.errors) {
      throw new Error(`Linear GraphQL error: ${JSON.stringify(res.data.errors)}`);
    }
    return res.data.data.issueUpdate.issue;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Linear API error (${error.response.status}): ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

module.exports = {
  createIssue,
  listIssuesByParent,
  updateIssueDescription,
  getStateId,
  getUserId,
  getCurrentUserId,
  getCurrentCycleId,
};
