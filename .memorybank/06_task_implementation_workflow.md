# Task Implementation Workflow

This document outlines the recommended Plan-Act workflow for implementing tasks, from analysis to completion, with emphasis on thorough planning, systematic execution, and knowledge capture.

---

## 📋 Effective Task Description Format

Suggest this format for clear, actionable task descriptions, if not already provided:

```markdown
## 📋 Description
[High-level business value description focusing on what and why]

## 📚 Additional Resources  
[Links to technical docs, designs, research, etc.]

## ✅ Acceptance Criteria
- [Clear, testable requirements using proper markdown bullets]
- [Each criterion should be measurable and specific]

## 🚀 Implementation Checklist
TBA - Will be populated during implementation planning

## 📝 Checklist
[ ] Implementation of the solution
[ ] Meets acceptance criteria
[ ] Unit tests added
[ ] End to End cases added
[ ] Sanity suite changes
[ ] Cross-browser testing
[ ] Developer tested feature
[ ] Documentation 
  [ ] The process with DOCS team initiated
  [ ] Documentation reviewed and approved
[ ] PR opened
  [ ] Code Review approved
[ ] Product owner approval
[ ] TAMs informed about changes
[ ] Feature merged
```

---

## 🔍 Plan Mode - Analysis & Planning Phase

### **1. Task Analysis**
- **Understand the request** - What exactly is being asked for?
- **Identify business value** - Why is this needed?
- **Check memory bank** - What context exists for this type of work?

### **2. Context Gathering**
- **Review existing code** thoroughly before assuming greenfield implementation
- **Check for related functionality** that might already exist or be partially implemented
- **Understand current patterns** and utilities available in the codebase
- **Identify constraints** (environment compatibility, performance, breaking changes)

### **3. Planning & Strategy**
- **Generate multiple approaches** - What are the different ways to solve this?
- **Evaluate trade-offs** - Complexity vs maintainability vs performance
- **Plan the approach** based on what's already there vs. what needs to be built
- **Estimate scope** - Is this >50 lines? New feature? Architecture change?
- **Present plan** and get approval before implementation

## ⚡ Act Mode - Implementation Phase

### **Before Starting Implementation**
- **Always suggest to commit the changes** after every small change. This will help in tracking the changes and will help in rolling back to a previous state if needed.

### **Systematic Implementation**
- **Reference memory bank** for coding standards and patterns
- **Apply development guidelines** from memory bank consistently
- **Use existing helper utilities** consistently (e.g., utility functions from common packages)
- **Make minimal code changes** - only modify sections related to the task at hand
- **Follow established patterns** and coding conventions
- **Document decisions** inline in the code that affect future implementations. Focus on the "why" not just the "what"
- **Respect linting and formatting rules** and fix the issues before committing the changes.

### **Verification & Testing**
- **Test changes thoroughly** - unit tests, integration tests, manual testing
- **Verify against plan** - Does the implementation match what was planned?
- **Check constraints** - Browser + service worker compatibility maintained?
- **Debug issues systematically** if found

### **Testing Strategy**
- **Fix existing tests** when behavior changes rather than bypassing them
- **Add comprehensive test coverage** for new functionality
- **Include edge cases** and error scenarios
- **Test integration points** with other components

---

## 🔄 Memory Bank Integration

Always suggest to update the memory bank after the task is completed. Refer to the [memory bank maintenance](00_memory_bank_maintenance.md) for more details.

---

## 🚀 Git and Development Workflow

### **Branch Management**
- **Use descriptive branch names** that follow project conventions. Example: `feature/add-new-plugin-for-device-mode`
- **Branch from appropriate base** (usually `develop`)

### **Commit Practices**
- **Follow conventional commit format** with clear, descriptive messages
- **DO NOT Reference task identifiers** in commit messages
- **Make atomic commits** that represent logical units of work
- **Use meaningful commit messages** that explain the "why" not just the "what"

### **Code Review Preparation**
- **Provide clear PR descriptions** that explain the changes and their impact
- **Include testing evidence** or instructions
- **Highlight areas needing special attention** 
- **Link to related documentation** or design decisions

---

## 📈 Continuous Improvement

### **Learning Capture**
- **Document effective approaches** for similar problems in the future
- **Record unsuccessful attempts** and why they didn't work
- **Note useful resources** and documentation discovered during implementation
- **Update workflow documentation** based on new learnings
- **DO NOT reference task identifiers** while capturing the learnings.

### **Process Evolution**
- **Iterate on task description formats** based on what works
- **Refine implementation approaches** based on experience
- **Improve testing strategies** based on bugs found
- **Enhance collaboration patterns** based on team feedback

---

**Remember**: This workflow is designed to maximize efficiency, maintain code quality, and preserve knowledge for future implementations. 
