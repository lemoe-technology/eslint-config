import type { Linter } from 'eslint';

import pluginRegexp from 'eslint-plugin-regexp';

import { scopePreset } from './utils/scopePreset.ts';

export function regexp(): Linter.Config[] {
  return [
    ...scopePreset([pluginRegexp.configs['flat/recommended']]),
    {
      rules: {
        'regexp/grapheme-string-literal': 'error',
        'regexp/hexadecimal-escape': ['error', 'never'],
        'regexp/prefer-escape-replacement-dollar-char': 'error',
        'regexp/prefer-regexp-test': 'error',
        'regexp/require-unicode-regexp': 'error',
        'regexp/unicode-escape': ['error', 'unicodeCodePointEscape'],
      },
    },
  ];
}
