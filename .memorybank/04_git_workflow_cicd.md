# Git Workflow and CI/CD

## 🌿 Branching Strategy

### **Main Branches**

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features

### **Feature Branches**

- **Format**: `feature/description-of-change`
- **Base**: Branch from `develop`
- **Merge**: Create PR to `develop`

### **Branch Naming Examples**

- `feature/add-consent-management-plugin`
- `fix/memory-leak-in-event-queue`
- `docs/update-integration-examples`

## 🔄 Commit Workflow

### **Commit Format**

Use conventional commits format.

```
<type>(<scope>): <description>

[optional body]
```

### **Types**

- **feat** - New features
- **fix** - Bug fixes
- **docs** - Documentation changes
- **test** - Test additions/updates
- **refactor** - Code refactoring
- **chore** - Build process, dependencies

### **Scopes** (Package Names)

- `analytics-js`, `plugins`, `integrations`, `common`, etc.

## 🚀 CI/CD Pipeline

### **Pre-commit Hooks**

- **Linting** - ESLint checks
- **Formatting** - Prettier formatting
- **Type Checking** - TypeScript compilation
- **Testing** - Affected package tests

### **Pull Request Checks**

- **Build Verification** - All packages build successfully
- **Test Suite** - Unit and integration tests
- **Size Checks** - Bundle size impact analysis
- **Code Review** - Required approvals

### **Release Process**

- **Version Bumping** - Semantic versioning
- **Changelog Generation** - Automated from commits
- **Package Publishing** - NPM registry publication
- **CDN Deployment** - Asset distribution

## ⚙️ Development Commands

### **Common Tasks**

```bash
npm run build              # Build all packages
npm run test               # Run all tests
npm run lint               # Lint all code
npm run affected:test      # Test only affected packages
```

### **Local Development**

```bash
npm run setup                # Install dependencies and setup the project
npm run clean                # Clean the project
npm run clean && npm cache clean --force && npm run setup # Cleanly re-setup the project
```
