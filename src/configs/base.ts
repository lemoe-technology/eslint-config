import type { Linter } from 'eslint';

import gitignore from 'eslint-config-flat-gitignore';
import globals from 'globals';

export function base(): Linter.Config[] {
  return [
    gitignore({ strict: false }),

    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'error',
      },
    },

    {
      files: ['**/*.jsx'],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ];
}
