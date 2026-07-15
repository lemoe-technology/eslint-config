import type { Linter } from 'eslint';

import { scopePreset } from './utils/scopePreset.ts';

export async function yaml(): Promise<Linter.Config[]> {
  const { default: pluginYml } = await import('eslint-plugin-yml');

  return [
    {
      ignores: ['**/pnpm-lock.yaml'],
    },
    ...scopePreset(pluginYml.configs.standard, {
      languageFiles: ['**/*.yaml', '**/*.yml'],
    }),
    {
      files: ['**/*.yaml', '**/*.yml'],
      rules: {
        '@stylistic/spaced-comment': 'off',

        'yml/no-empty-mapping-value': 'off',
        'yml/quotes': ['error', { avoidEscape: true, prefer: 'single' }],
      },
    },
  ];
}
