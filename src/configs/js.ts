import type { Linter } from 'eslint';

import eslintJs from '@eslint/js';

export function js(): Linter.Config[] {
  return [
    eslintJs.configs.recommended,
    {
      rules: {
        // replaced by unused-imports/no-unused-vars
        'no-unused-vars': 'off',
        'use-isnan': ['error', { enforceForIndexOf: true }],
        'valid-typeof': ['error', { requireStringLiterals: true }],

        // bug prevention
        'array-callback-return': ['error', { checkForEach: true }],
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'no-constructor-return': 'error',
        'no-invalid-this': 'error',
        'no-multi-assign': 'error',
        'no-new': 'error',
        'no-param-reassign': 'error',
        'no-return-assign': ['error', 'always'],
        'no-promise-executor-return': 'error',
        'no-self-compare': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unreachable-loop': 'error',
        'prefer-promise-reject-errors': 'error',
        'require-await': 'error',

        // dangerous APIs
        'no-array-constructor': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-proto': 'error',

        // redundant
        'accessor-pairs': 'error',
        'no-extra-bind': 'error',
        'no-lone-blocks': 'error',
        'no-object-constructor': 'error',
        'no-undef-init': 'error',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',

        // modern syntax
        'dot-notation': 'error',
        'logical-assignment-operators': 'error',
        'no-multi-str': 'error',
        'no-var': 'error',
        'one-var': ['error', 'never'],
        'object-shorthand': 'error',
        'operator-assignment': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-const': ['error', { destructuring: 'all' }],
        'prefer-exponentiation-operator': 'error',
        'prefer-numeric-literals': 'error',
        'prefer-object-spread': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'symbol-description': 'error',

        // control flow
        'consistent-return': 'error',
        curly: 'error',
        'default-case-last': 'error',
        'no-else-return': 'error',
        'no-labels': 'error',
        'no-nested-ternary': 'error',
        'no-sequences': 'error',
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': 'error',

        // misc
        'arrow-body-style': 'error',
        'new-cap': ['error', { capIsNew: false }],
      },
    },
  ];
}
