import type { Linter } from 'eslint';

import stylisticPlugin from '@stylistic/eslint-plugin';

import { scopePreset } from './utils/scopePreset.ts';

export function stylistic(): Linter.Config[] {
  return [
    ...scopePreset([
      stylisticPlugin.configs.customize({
        semi: true,
        jsx: true,
        arrowParens: true,
        quoteProps: 'as-needed',
      }),
    ]),
    {
      rules: {
        '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],

        '@stylistic/array-bracket-newline': 'error',
        '@stylistic/array-element-newline': ['error', { multiline: true, consistent: true }],
        '@stylistic/curly-newline': ['error', { multiline: true, consistent: true }],
        '@stylistic/function-call-argument-newline': ['error', 'consistent'],
        '@stylistic/function-call-spacing': 'error',
        '@stylistic/function-paren-newline': ['error', 'consistent'],
        '@stylistic/jsx-self-closing-comp': 'error',
        '@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }],
        '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
        '@stylistic/semi-style': 'error',
        '@stylistic/switch-colon-spacing': 'error',
      },
    },
  ];
}
