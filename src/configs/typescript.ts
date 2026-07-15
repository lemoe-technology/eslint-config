import type { Linter } from 'eslint';

import tses from 'typescript-eslint';

import { scopePreset } from './utils/scopePreset.ts';

export function typescript(tsconfigRootDir?: string): Linter.Config[] {
  return [
    {
      ignores: ['**/*.gen.d.ts'],
    },
    ...scopePreset(tses.configs.strictTypeChecked, {
      languageFiles: ['**/*.ts', '**/*.tsx'],
      ruleFiles: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    }),
    ...scopePreset(tses.configs.stylisticTypeChecked, {
      languageFiles: ['**/*.ts', '**/*.tsx'],
      ruleFiles: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    }),
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: ['.vue'],
          ...(tsconfigRootDir !== undefined ? { tsconfigRootDir } : {}),
        },
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
      rules: {
        '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
        '@typescript-eslint/no-non-null-assertion': 'off',
        // replaced by unused-imports/no-unused-vars
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/unified-signatures': 'off',

        // stylistic
        '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never', arrayLiteralTypeAssertions: 'never' }],

        '@typescript-eslint/default-param-last': 'error',
        '@typescript-eslint/no-unused-private-class-members': 'error',
        '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false }],
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/require-array-sort-compare': 'error',
        '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        // stylistic
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/method-signature-style': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/prefer-enum-initializers': 'error',
      },
    },
  ];
}
