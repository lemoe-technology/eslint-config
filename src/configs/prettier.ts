import type { Linter } from 'eslint';
import type { Options } from 'prettier';

import formatPlugin from 'eslint-plugin-format';

import type { PrettierOptions } from '../types.ts';

type FormatterKind = keyof PrettierOptions;

interface TargetOptions {
  files: string[];
  parser: string;
  extraPrettierOptions?: Omit<Partial<Options>, 'parser'>;
}

const targets: Record<FormatterKind, TargetOptions[]> = {
  html: [{ files: ['**/*.html'], parser: 'html' }],
  css: [{ files: ['**/*.css'], parser: 'css' }],
  scss: [{ files: ['**/*.scss'], parser: 'scss' }],
  less: [{ files: ['**/*.less'], parser: 'less' }],
  markdown: [
    {
      files: ['**/*.md'],
      parser: 'markdown',
      extraPrettierOptions: {
        embeddedLanguageFormatting: 'off',
      },
    },
  ],
};

export const formatterKinds = Object.keys(targets) as readonly FormatterKind[];

function targetBlock({ files, parser, extraPrettierOptions }: TargetOptions): Linter.Config {
  return {
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
  };
}

export function formatter(kind: FormatterKind): Linter.Config[] {
  return targets[kind].map(targetBlock);
}

export function prettier(targetBlocks: Linter.Config[]): Linter.Config[] {
  if (targetBlocks.length === 0) {
    return [];
  }

  return [
    {
      plugins: {
        format: formatPlugin,
      },
    },
    ...targetBlocks,
  ];
}
