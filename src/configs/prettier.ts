import type { Linter } from 'eslint';
import type { Options } from 'prettier';

import formatPlugin from 'eslint-plugin-format';

import type { PrettierOptions } from '../types.ts';

interface FormatTarget {
  files: string[];
  parser: string;
  extraPrettierOptions?: Omit<Partial<Options>, 'parser'>;
}

const htmlTargets: FormatTarget[] = [{ files: ['**/*.html'], parser: 'html' }];

const cssTargets: FormatTarget[] = [
  { files: ['**/*.css'], parser: 'css' },
  { files: ['**/*.scss'], parser: 'scss' },
  { files: ['**/*.less'], parser: 'less' },
];

const markdownTargets: FormatTarget[] = [
  {
    files: ['**/*.md'],
    parser: 'markdown',
    extraPrettierOptions: {
      embeddedLanguageFormatting: 'off',
    },
  },
];

export function prettier(options: PrettierOptions = {}): Linter.Config[] {
  const targets = [
    ...(options.html ? htmlTargets : []),
    ...(options.css ? cssTargets : []),
    ...(options.markdown ? markdownTargets : []),
  ];

  if (targets.length === 0) {
    return [];
  }

  return [
    {
      plugins: {
        format: formatPlugin,
      },
    },
    ...targets.map(({ files, parser, extraPrettierOptions }): Linter.Config => ({
      files,
      languageOptions: {
        parser: formatPlugin.parserPlain,
      },
      rules: {
        'format/prettier': [
          'error',
          {
            singleQuote: true,
            printWidth: 120,
            parser,
            ...extraPrettierOptions,
          } satisfies Partial<Options>,
        ],
      },
    })),
  ];
}
