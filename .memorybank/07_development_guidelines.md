# Development Guidelines

## 🎯 Core Philosophy

**"Less code is better. Lines of code = Debt."**

Write code that is simple, maintainable, and focused. Every line should serve a purpose.

---

## 🧠 Key Development Mindsets

1. **Simplicity:** Write simple and straightforward code
2. **Readability:** Ensure your code is easy to read and understand
3. **Performance:** Keep performance in mind but do not over-optimize at the cost of readability
4. **Maintainability:** Write code that is easy to maintain and update
5. **Testability:** Ensure your code is easy to test
6. **Reusability:** Write reusable components and functions
7. **Environment Awareness:** Write code compatible with browsers and service workers. Avoid Node.js-only APIs

---

## 📋 Code Guidelines

### **Control Flow & Structure**
- **Utilize Early Returns:** Use early returns to avoid nested conditions and improve readability
- **Functional and Immutable Style:** Prefer a functional, immutable style unless it becomes much more verbose
- **Tree-shakable and Side-effect Free:** Write modules that are tree-shakable and avoid side effects where possible

### **Naming & Organization**
- **Descriptive Names:** Use descriptive names for variables and functions
- **Event Handler Naming:** Prefix event handler functions with `handle` (e.g., `handleClick`, `handleKeyDown`)
- **Constants Over Functions:** Use constants instead of functions where possible. Define types if applicable
- **Function Ordering:** Order functions with those that are composing other functions appearing earlier in the file

### **Styling & Classes**
- **Conditional Classes:** Prefer conditional classes over ternary operators for class attributes

### **Code Quality**
- **Correct and DRY Code:** Focus on writing correct, best practice, DRY (Don't Repeat Yourself) code

---

## 📝 Documentation Standards

### **Function Comments**
- Add a comment at the start of each function describing what it does
- **JSDoc Comments:** Use JSDoc comments for JavaScript (unless it's TypeScript) and modern ES6 syntax

### **Bug Documentation**
- **TODO Comments:** If you encounter a bug or suboptimal code, add comments starting with `TODO:` outlining the problems

---

## 🚫 Critical Constraints

### **Minimal Code Changes Rule**
- Only modify sections of the code related to the task at hand
- Avoid modifying unrelated pieces of code
- Avoid changing existing comments
- Avoid any kind of cleanup unless specifically instructed to
- Accomplish the goal with the minimum amount of code changes
- Code change = potential for bugs and technical debt

---

## 🛠️ Development Tools & Standards

### **Code Quality Tools**
- Use Prettier for code formatting
- Use ESLint for code linting
- Follow Conventional Commits for commit messages

### **Best Practices**
- Write modular, reusable, and well-documented APIs
- Test for cross-browser and service worker compatibility
- Consider using TypeScript for type safety

---

## 🌐 Environment Compatibility

**Critical:** All code must be compatible with:
- ✅ Modern browsers
- ✅ Service workers
- ❌ Node.js-only APIs (avoid these)

This ensures the SDK works across all target environments without compatibility issues.

---

## 📊 Success Criteria

Code should be:
- ✅ Simple and readable
- ✅ Performant without over-optimization
- ✅ Maintainable and testable
- ✅ Compatible across target environments
- ✅ Following established patterns
- ✅ Minimally invasive to existing codebase 
