import type { Linter } from 'eslint';

import { scopePreset } from './utils/scopePreset.ts';

export async function toml(): Promise<Linter.Config[]> {
  const { default: pluginToml } = await import('eslint-plugin-toml');

  return [
    ...scopePreset(pluginToml.configs.standard, {
      languageFiles: ['**/*.toml'],
    }),
    {
      files: ['**/*.toml'],
      rules: {
        '@stylistic/spaced-comment': 'off',
      },
    },
  ];
}
