import type { Linter } from 'eslint';

import { scopePreset } from './utils/scopePreset.ts';

const DEFAULT_TEST_FILES = ['**/*.{test,spec}.?(c|m)[jt]s?(x)'];

export async function test(): Promise<Linter.Config[]> {
  const { default: vitestPlugin } = await import('@vitest/eslint-plugin');

  return [
    {
      ignores: ['**/fixtures/**'],
    },
    ...scopePreset([vitestPlugin.configs.recommended], {
      languageFiles: DEFAULT_TEST_FILES,
    }),
    {
      files: DEFAULT_TEST_FILES,
      rules: {
        'vitest/consistent-each-for': 'error',
        'vitest/consistent-test-filename': 'error',
        'vitest/consistent-test-it': ['error', { fn: 'it' }],
        'vitest/consistent-vitest-vi': 'error',
        'vitest/no-alias-methods': 'error',
        'vitest/no-conditional-in-test': 'error',
        'vitest/no-conditional-tests': 'error',
        'vitest/no-duplicate-hooks': 'error',
        'vitest/no-test-prefixes': 'error',
        'vitest/no-test-return-statement': 'error',
        'vitest/prefer-comparison-matcher': 'error',
        'vitest/prefer-describe-function-title': 'error',
        'vitest/prefer-each': 'error',
        'vitest/prefer-equality-matcher': 'error',
        'vitest/prefer-expect-resolves': 'error',
        'vitest/prefer-expect-type-of': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-hooks-on-top': 'error',
        'vitest/prefer-import-in-mock': 'error',
        'vitest/prefer-lowercase-title': 'error',
        'vitest/prefer-mock-promise-shorthand': 'error',
        'vitest/prefer-mock-return-shorthand': 'error',
        'vitest/prefer-snapshot-hint': 'error',
        'vitest/prefer-spy-on': 'error',
        'vitest/prefer-strict-boolean-matchers': 'error',
        'vitest/prefer-strict-equal': 'error',
        'vitest/prefer-to-be': 'error',
        'vitest/prefer-to-contain': 'error',
        'vitest/prefer-to-have-been-called-times': 'error',
        'vitest/prefer-to-have-length': 'error',
        'vitest/prefer-todo': 'error',
        'vitest/prefer-vi-mocked': 'error',
        'vitest/require-awaited-expect-poll': 'error',
        'vitest/require-hook': 'error',
        'vitest/require-mock-type-parameters': 'error',
        'vitest/require-to-throw-message': 'error',
        'vitest/require-top-level-describe': 'error',
        'vitest/valid-title': ['error', { ignoreTypeOfDescribeName: true }],
      },
    },
  ];
}
