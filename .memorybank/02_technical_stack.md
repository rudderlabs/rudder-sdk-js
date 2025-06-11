# Technical Stack

## 🛠️ Core Technologies

### **Languages**

- **TypeScript** - Primary language for most packages
- **JavaScript** - Used in legacy packages and build scripts

### **Build & Development**

- **Nx** - Monorepo management and build orchestration
- **Rollup** - Module bundler for library builds
- **Babel** - JavaScript/TypeScript compilation
- **Jest** - Testing framework

### **Code Quality**

- **ESLint** - Code linting with custom rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Lint-staged** - Run linters on staged files

## 📦 Key Dependencies

### **Runtime Dependencies**

- **Ramda** - Functional utilities (`mergeDeepRight`, `clone`, etc.)
- **UUID** - Unique identifier generation

### **Development Dependencies**

- **TypeScript** - Type checking and compilation
- **@types/\*** - Type definitions for JavaScript libraries

## 🔧 Build Outputs

### **Bundle Types**

- **Modern** - ES2017+ with dynamic imports
- **Legacy** - ES5 compatible for older browsers
- **CDN** - Standalone scripts for direct inclusion
- **NPM** - Packages for installation via NPM

### **Module Formats**

- **ESM** - ES modules (`.mjs`, modern imports)
- **CJS** - CommonJS (`.js`, require/exports)
- **UMD** - Universal module definition (browser globals)

## 🎯 Environment Support

- **Browsers** - Modern and legacy (IE11+)
- **Service Workers** - Limited API surface
- **Chrome Extensions** - Content and background scripts
