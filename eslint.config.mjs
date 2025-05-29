import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';
import compat from 'eslint-plugin-compat';
import unicorn from 'eslint-plugin-unicorn';
import nxPlugin from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsoncParser from 'jsonc-eslint-parser';

export default [
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...eslint.configs.recommended.globals,
        browser: true,
        window: true,
        document: true,
        navigator: true,
        location: true,
        history: true,
        localStorage: true,
        sessionStorage: true,
        process: true,
        Buffer: true,
        console: true,
        jest: true
      },
      parser: tsParser,
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.json'
        },
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    ignores: [
      '.husky/**',
      '__mocks__/**',
      '__fixtures__/**',
      'jest/**',
      'dist/**',
      'node_modules/**',
      'reports/**',
      'stats/**',
      '**/*.md',
      '**/*.d.ts',
      '**/*.config.js',
      'examples/chrome-extension/**/rudderAnalytics.js',
      'examples/chrome-extension/**/foreground.js',
      'testBookSuites/**',
      'tsconfig.build.tsbuildinfo',
      '**/nativeSdkLoader.js',
      'assets/**',
      '**/project.json'
    ],
    plugins: {
      '@typescript-eslint': tseslint,
      'unicorn': unicorn,
      'compat': compat,
      '@nx': nxPlugin,
      'import': importPlugin,
      'sonarjs': sonarjs,
    },
    settings: {
      'import/resolver': {
        typescript: {}
      },
      lintAllEsApis: true,
      polyfills: [
        'URL',
        'URLSearchParams',
        'Promise',
        'Number.isNaN',
        'Number.isInteger',
        'Array.from',
        'Array.prototype.find',
        'Array.prototype.includes',
        'String.prototype.endsWith',
        'String.prototype.startsWith',
        'String.prototype.includes',
        'String.prototype.replaceAll',
        'String.fromCodePoint',
        'Object.entries',
        'Object.values',
        'Object.assign',
        'Object.fromEntries',
        'TextEncoder',
        'TextDecoder',
        'CustomEvent',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'navigator.sendBeacon',
        'Uint8Array',
        'Set',
        'atob'
      ]
    },
    rules: {
      'compat/compat': [
        'warn',
        'browserslist'
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          varsIgnorePattern: '^CatchErr',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          caughtErrors: 'none'
        }
      ],
      'import/prefer-default-export': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
            kebabCase: true
          }
        }
      ],
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/better-regex': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-includes': 'off',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/max-switch-cases': 'off',
      'sonarjs/cognitive-complexity': ['error', 40],
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'no-console': 'off',
      'no-plusplus': 'off',
      'import/no-extraneous-dependencies': 'off',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['rudderAnalyticsRemotePlugins/*'],
          banTransitiveDependencies: true,
          depConstraints: [
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib']
            },
            {
              sourceTag: 'type:sdk',
              onlyDependOnLibsWithTags: ['type:lib']
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:sdk']
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared']
            }
          ]
        }
      ],
      'sonarjs/todo-tag': 'warn'
    }
  },
  {
    files: ['**/package.json', '**/project.json'],
    languageOptions: {
      parser: jsoncParser,
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.json'
        },
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    plugins: {
      '@nx': nxPlugin
    },
    rules: {
      '@nx/dependency-checks': [
        'warn',
        {
          buildTargets: ['build'],
          checkMissingDependencies: true,
          checkObsoleteDependencies: true,
          checkVersionMismatches: true,
          ignoredDependencies: [
            '@preact/signals-core',
            '@lukeed/uuid',
            'md5',
            'assert'
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.json'
        },
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  prettier
];
