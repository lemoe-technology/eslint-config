import type { Linter } from 'eslint';

import type { PrettierOptions, UserOptions } from './types.ts';

import { base } from './configs/base.ts';
import { imports } from './configs/imports.ts';
import { jsonc } from './configs/jsonc.ts';
import { node } from './configs/node.ts';
import { prettier } from './configs/prettier.ts';
import { stylistic } from './configs/stylistic.ts';
import { tailwind } from './configs/tailwind.ts';
import { test } from './configs/test.ts';
import { toml } from './configs/toml.ts';
import { typescript } from './configs/typescript.ts';
import { vue } from './configs/vue.ts';
import { yaml } from './configs/yaml.ts';

const DEFAULT_OPTIONS = {
  typescript: true,
  node: false,
  vue: false,
  jsonc: true,
  yaml: true,
  toml: false,
  test: false,
  prettier: {
    markdown: true,
    html: false,
    css: false,
  },
} satisfies UserOptions;

const PRETTIER_ALL: PrettierOptions = { markdown: true, html: true, css: true };

/**
 * Assembles the ESLint flat config from the given options.
 *
 * @example
 * ```ts
 * export default defineConfig({ vue: true });
 * ```
 */
export async function defineConfig(options: UserOptions = {}, ...userConfigs: Linter.Config[]): Promise<Linter.Config[]> {
  const configs: Linter.Config[] = [];

  configs.push(...base());

  configs.push(...stylistic());

  configs.push(...imports());

  const typescriptOption = options.typescript ?? DEFAULT_OPTIONS.typescript;
  if (typescriptOption !== false) {
    configs.push(...typescript(
      typeof typescriptOption === 'object' ? typescriptOption.tsconfigRootDir : undefined,
    ));
  }

  if (options.node ?? DEFAULT_OPTIONS.node) {
    configs.push(...await node());
  }

  const vueOption = options.vue ?? DEFAULT_OPTIONS.vue;
  if (vueOption !== false) {
    configs.push(...await vue());

    const tailwindOption = typeof vueOption === 'object' ? vueOption.tailwind : true;
    if (tailwindOption !== false) {
      configs.push(...await tailwind(
        typeof tailwindOption === 'object' ? tailwindOption.cssConfigPath : undefined,
      ));
    }
  }

  if (options.jsonc ?? DEFAULT_OPTIONS.jsonc) {
    configs.push(...await jsonc());
  }

  if (options.yaml ?? DEFAULT_OPTIONS.yaml) {
    configs.push(...await yaml());
  }

  if (options.toml ?? DEFAULT_OPTIONS.toml) {
    configs.push(...await toml());
  }

  if (options.test ?? DEFAULT_OPTIONS.test) {
    configs.push(...await test());
  }

  const prettierOption = options.prettier ?? DEFAULT_OPTIONS.prettier;
  if (prettierOption !== false) {
    configs.push(...prettier(
      prettierOption === true
        ? PRETTIER_ALL
        : { ...DEFAULT_OPTIONS.prettier, ...prettierOption },
    ));
  }

  configs.push(...userConfigs);

  return configs;
}
