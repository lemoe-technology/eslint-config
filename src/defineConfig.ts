import type { Linter } from 'eslint';

import type { PrettierOptions, UserOptions } from './types.ts';

import { base } from './configs/base.ts';
import { comments } from './configs/comments.ts';
import { imports } from './configs/imports.ts';
import { js } from './configs/js.ts';
import { jsonc } from './configs/jsonc.ts';
import { node } from './configs/node.ts';
import { packageJson } from './configs/packageJson.ts';
import { formatter, formatterKinds, prettier } from './configs/prettier.ts';
import { regexp } from './configs/regexp.ts';
import { stylistic } from './configs/stylistic.ts';
import { tailwind } from './configs/tailwind.ts';
import { test } from './configs/test.ts';
import { toml } from './configs/toml.ts';
import { typescript } from './configs/typescript.ts';
import { applyIntegrationOptions } from './configs/utils/applyIntegrationOptions.ts';
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
    scss: false,
    less: false,
  },
} satisfies UserOptions;

const PRETTIER_ALL: PrettierOptions = { markdown: true, html: true, css: true, scss: true, less: true };

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

  configs.push(...applyIntegrationOptions(js(), options.js));

  configs.push(...applyIntegrationOptions(comments(), options.comments));

  configs.push(...applyIntegrationOptions(regexp(), options.regexp));

  configs.push(...applyIntegrationOptions(stylistic(), options.stylistic));

  configs.push(...applyIntegrationOptions(imports(), options.imports));

  configs.push(...applyIntegrationOptions(packageJson(), options.packageJson));

  const typescriptOption = options.typescript ?? DEFAULT_OPTIONS.typescript;
  if (typescriptOption !== false) {
    configs.push(...applyIntegrationOptions(
      typescript(typeof typescriptOption === 'object' ? typescriptOption.tsconfigRootDir : undefined),
      typescriptOption,
    ));
  }

  const nodeOption = options.node ?? DEFAULT_OPTIONS.node;
  if (nodeOption !== false) {
    configs.push(...applyIntegrationOptions(await node(), nodeOption));
  }

  const vueOption = options.vue ?? DEFAULT_OPTIONS.vue;
  if (vueOption !== false) {
    configs.push(...applyIntegrationOptions(await vue(), vueOption));

    const tailwindOption = typeof vueOption === 'object' ? vueOption.tailwind : true;
    if (tailwindOption !== false) {
      configs.push(...applyIntegrationOptions(
        await tailwind(typeof tailwindOption === 'object' ? tailwindOption.cssConfigPath : undefined),
        tailwindOption,
      ));
    }
  }

  const jsoncOption = options.jsonc ?? DEFAULT_OPTIONS.jsonc;
  if (jsoncOption !== false) {
    configs.push(...applyIntegrationOptions(await jsonc(), jsoncOption));
  }

  const yamlOption = options.yaml ?? DEFAULT_OPTIONS.yaml;
  if (yamlOption !== false) {
    configs.push(...applyIntegrationOptions(await yaml(), yamlOption));
  }

  const tomlOption = options.toml ?? DEFAULT_OPTIONS.toml;
  if (tomlOption !== false) {
    configs.push(...applyIntegrationOptions(await toml(), tomlOption));
  }

  const testOption = options.test ?? DEFAULT_OPTIONS.test;
  if (testOption !== false) {
    configs.push(...applyIntegrationOptions(await test(), testOption));
  }

  const prettierOption = options.prettier ?? DEFAULT_OPTIONS.prettier;
  if (prettierOption !== false) {
    const optionsByKind = prettierOption === true
      ? PRETTIER_ALL
      : { ...DEFAULT_OPTIONS.prettier, ...prettierOption };

    const targetBlocks = formatterKinds.flatMap((kind) => {
      const option = optionsByKind[kind];

      if (option === false) {
        return [];
      }

      return applyIntegrationOptions(formatter(kind), option);
    });

    configs.push(...prettier(targetBlocks));
  }

  configs.push(...userConfigs);

  return configs;
}
