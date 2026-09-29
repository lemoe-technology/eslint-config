import type { Linter } from 'eslint';

import pluginPackageJson from 'eslint-plugin-package-json';

import { scopePreset } from './utils/scopePreset.ts';

export function packageJson(): Linter.Config[] {
  return [
    ...scopePreset([pluginPackageJson.configs.recommended], {
      languageFiles: ['**/package.json'],
    }),
    ...scopePreset([pluginPackageJson.configs.stylistic], {
      languageFiles: ['**/package.json'],
    }),
    {
      files: ['**/package.json'],
      rules: {
        'package-json/require-description': ['error', { ignorePrivate: true }],
        'package-json/require-sideEffects': 'off',
      },
    },
  ];
}
