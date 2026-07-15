import type { Linter } from 'eslint';

import importPlugin from 'eslint-plugin-import-lite';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export function imports(): Linter.Config[] {
  return [
    {
      plugins: {
        import: importPlugin,
        'unused-imports': unusedImportsPlugin,
        perfectionist: perfectionistPlugin,
      },
      rules: {
        'import/consistent-type-specifier-style': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],

        'perfectionist/sort-export-attributes': ['error', { type: 'natural' }],
        'perfectionist/sort-exports': [
          'error',
          {
            type: 'natural',
            newlinesInside: 'ignore',
            groups: [
              'type-export',
              'value-export',
            ],
          },
        ],
        'perfectionist/sort-heritage-clauses': ['error', { type: 'natural' }],
        'perfectionist/sort-import-attributes': ['error', { type: 'natural' }],
        'perfectionist/sort-imports': [
          'error',
          {
            type: 'natural',
            groups: [
              'type-import',
              'value-builtin',
              'value-external',

              'type-internal',
              ['type-parent', 'type-sibling', 'type-index'],
              'value-internal',
              ['value-parent', 'value-sibling', 'value-index'],

              'side-effect',
              'ts-equals-import',
              'unknown',
            ],
          },
        ],
        'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      },
    },
  ];
}
