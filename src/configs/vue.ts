import type { Linter } from 'eslint';

import { mergeProcessors } from 'eslint-merge-processors';
import globals from 'globals';
import tses from 'typescript-eslint';

import { scopePreset } from './utils/scopePreset.ts';

export async function vue(): Promise<Linter.Config[]> {
  const { default: vuePlugin } = await import('eslint-plugin-vue');
  const { default: processorVueBlocks } = await import('eslint-processor-vue-blocks');

  return [
    ...scopePreset(vuePlugin.configs['flat/recommended-error'], {
      languageFiles: ['**/*.vue'],
    }),
    {
      files: ['**/*.vue'],
      languageOptions: {
        globals: {
          ...globals.vue,
        },
        parserOptions: {
          parser: tses.parser,
          extraFileExtensions: ['.vue'],
        },
      },
      processor: mergeProcessors([
        vuePlugin.processors['.vue'] as Linter.Processor,
        processorVueBlocks({
          blocks: {
            styles: true,
            customBlocks: true,
          },
        }),
      ]),
    },
    {
      files: ['**/*.vue'],
      rules: {
        'vue/attributes-order': ['error', { alphabetical: true }],
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/multi-word-component-names': 'off',
        'vue/require-default-prop': 'off',

        'vue/block-tag-newline': ['error', { singleline: 'always', multiline: 'always' }],
        'vue/component-api-style': 'error',
        // compatible with auto-imports
        'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false }],
        'vue/component-options-name-casing': 'error',
        'vue/custom-event-name-casing': ['error', 'kebab-case'],
        'vue/define-emits-declaration': ['error', 'type-literal'],
        'vue/define-macros-order': [
          'error',
          {
            order: ['definePage', 'defineOptions', 'defineProps', 'defineModel', 'defineEmits', 'defineSlots'],
            defineExposeLast: true,
          },
        ],
        'vue/define-props-declaration': 'error',
        'vue/define-props-destructuring': ['error', { destructure: 'only-when-assigned' }],
        'vue/no-duplicate-attr-inheritance': 'error',
        'vue/no-duplicate-class-names': 'error',
        'vue/no-empty-component-block': 'error',
        'vue/no-import-compiler-macros': 'error',
        'vue/no-ref-object-reactivity-loss': 'error',
        'vue/no-restricted-v-bind': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-text': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/prefer-define-options': 'error',
        'vue/require-explicit-slots': 'error',
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-single-event-payload': 'error',
        'vue/prefer-true-attribute-shorthand': 'error',
        'vue/prefer-use-template-ref': 'error',
        'vue/prefer-v-model': 'error',
        'vue/slot-name-casing': ['error', 'kebab-case'],
        'vue/v-for-delimiter-style': ['error', 'of'],

        // eslint
        'vue/dot-notation': 'error',
        'vue/eqeqeq': ['error', 'always', { null: 'ignore' }],
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-sparse-arrays': 'error',
        'vue/no-useless-concat': 'error',
        'vue/object-shorthand': 'error',
        'vue/prefer-template': 'error',

        // stylistic
        'vue/array-bracket-newline': 'error',
        'vue/array-bracket-spacing': 'error',
        'vue/array-element-newline': ['error', { multiline: true, consistent: true }],
        'vue/arrow-spacing': 'error',
        'vue/block-spacing': 'error',
        'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/comma-spacing': 'error',
        'vue/comma-style': 'error',
        'vue/dot-location': ['error', 'property'],
        'vue/func-call-spacing': 'error',
        'vue/key-spacing': 'error',
        'vue/keyword-spacing': 'error',
        'vue/multiline-ternary': ['error', 'always-multiline'],
        'vue/no-extra-parens': ['error', 'functions'],
        'vue/object-curly-newline': ['error', { multiline: true, consistent: true }],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/quote-props': ['error', 'as-needed'],
        'vue/space-in-parens': 'error',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': 'error',
        'vue/template-curly-spacing': 'error',
      },
    },
  ];
}
