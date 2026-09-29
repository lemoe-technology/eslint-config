import type { Linter } from 'eslint';

import { scopePreset } from './utils/scopePreset.ts';

export async function jsonc(): Promise<Linter.Config[]> {
  const { default: pluginJsonc } = await import('eslint-plugin-jsonc');

  return [
    ...scopePreset(pluginJsonc.configs['recommended-with-json'], {
      languageFiles: ['**/*.json', '**/*.jsonc'],
    }),
    ...scopePreset(pluginJsonc.configs['recommended-with-json5'], {
      languageFiles: ['**/*.json5'],
    }),
    {
      files: ['**/*.json', '**/*.jsonc'],
      rules: {
        // compatible with tsconfig.json
        'jsonc/no-comments': 'off',
      },
    },
    {
      files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
      rules: {
        'jsonc/array-bracket-newline': ['error', { minItems: 1 }],
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/array-element-newline': ['error', 'always'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', 2],
        'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'jsonc/no-octal-escape': 'error',
        'jsonc/object-curly-newline': ['error', { minProperties: 1 }],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      },
    },
  ];
}
