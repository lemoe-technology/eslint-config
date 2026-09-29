import type { Linter } from 'eslint';

import pluginComments from '@eslint-community/eslint-plugin-eslint-comments/configs';

import { scopePreset } from './utils/scopePreset.ts';

export function comments(): Linter.Config[] {
  return [
    ...scopePreset([pluginComments.recommended]),
    {
      rules: {
        '@eslint-community/eslint-comments/require-description': 'error',
      },
    },
  ];
}
