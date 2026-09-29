import type { Linter } from 'eslint';

import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src/defineConfig.ts';

function pluginNames(configs: Linter.Config[]): string[] {
  return configs.flatMap((config) => Object.keys(config.plugins ?? {}));
}

function matchedFiles(configs: Linter.Config[]): string[] {
  return configs.flatMap((config) => config.files ?? [])
    .flat();
}

describe(defineConfig, () => {
  it('enables typescript, jsonc, yaml and markdown formatting by default', async () => {
    const names = pluginNames(await defineConfig());

    expect(names)
      .toContain('@typescript-eslint');
    expect(names)
      .toContain('jsonc');
    expect(names)
      .toContain('package-json');
    expect(names)
      .toContain('yml');
    expect(names)
      .toContain('format');
    expect(names).not.toContain('n');
    expect(names).not.toContain('vue');
    expect(names).not.toContain('tailwindcss');
    expect(names).not.toContain('toml');
    expect(names).not.toContain('vitest');
  });

  it('enables the node plugin on demand', async () => {
    const names = pluginNames(await defineConfig({ node: true }));

    expect(names)
      .toContain('n');
  });

  it('enables vue with tailwind by default', async () => {
    const names = pluginNames(await defineConfig({ vue: true }));

    expect(names)
      .toContain('vue');
    expect(names)
      .toContain('tailwindcss');
  });

  it('can disable tailwind while keeping vue', async () => {
    const names = pluginNames(await defineConfig({ vue: { tailwind: false } }));

    expect(names)
      .toContain('vue');
    expect(names).not.toContain('tailwindcss');
  });

  it('passes a custom tailwind cssConfigPath through', async () => {
    const configs = await defineConfig({ vue: { tailwind: { cssConfigPath: 'custom/entry.css' } } });
    const blocks = configs.filter(
      (config) => (config.settings?.tailwindcss as { cssConfigPath?: string } | undefined)?.cssConfigPath !== undefined,
    );

    expect(blocks)
      .toHaveLength(1);
    expect(blocks[0]?.settings)
      .toMatchObject({ tailwindcss: { cssConfigPath: 'custom/entry.css' } });
  });

  it('enables toml on demand', async () => {
    const names = pluginNames(await defineConfig({ toml: true }));

    expect(names)
      .toContain('toml');
  });

  it('enables the vitest plugin on demand', async () => {
    const names = pluginNames(await defineConfig({ test: true }));

    expect(names)
      .toContain('vitest');
  });

  it('can disable typescript, jsonc and yaml', async () => {
    const names = pluginNames(await defineConfig({ typescript: false, jsonc: false, yaml: false }));

    expect(names).not.toContain('@typescript-eslint');
    expect(names).not.toContain('jsonc');
    expect(names).not.toContain('yml');
  });

  it('keeps package-json rules when jsonc is disabled', async () => {
    const names = pluginNames(await defineConfig({ jsonc: false }));

    expect(names)
      .toContain('package-json');
  });

  it('scopes js rule blocks', async () => {
    const configs = await defineConfig({ js: { ignores: ['**/scripts/**'] } });

    const ruleBlocks = configs.filter((config) => config.rules !== undefined && 'eqeqeq' in config.rules);
    expect(ruleBlocks.length)
      .toBeGreaterThan(0);
    for (const block of ruleBlocks) {
      expect(block.ignores)
        .toStrictEqual(['**/scripts/**']);
    }
  });

  it('keeps regexp plugin registration global while scoping rules', async () => {
    const configs = await defineConfig({ regexp: { ignores: ['**/fixtures/**'] } });

    const pluginBlocks = configs.filter((config) => config.plugins !== undefined && 'regexp' in config.plugins);
    expect(pluginBlocks)
      .toHaveLength(1);
    expect(pluginBlocks[0]?.ignores)
      .toBeUndefined();

    const ruleBlock = configs.find((config) => config.rules !== undefined && 'regexp/require-unicode-regexp' in config.rules);
    expect(ruleBlock?.ignores)
      .toStrictEqual(['**/fixtures/**']);
  });

  it('merges packageJson rules', async () => {
    const configs = await defineConfig({
      packageJson: { rules: { 'package-json/require-sideEffects': 'error' } },
    });

    const ruleBlock = configs.find((config) => config.rules !== undefined && 'package-json/require-sideEffects' in config.rules);
    expect(ruleBlock?.rules?.['package-json/require-sideEffects'])
      .toBe('error');
  });

  it('enables all formatters with prettier: true', async () => {
    const files = matchedFiles(await defineConfig({ prettier: true }));

    expect(files)
      .toContain('**/*.md');
    expect(files)
      .toContain('**/*.html');
    expect(files)
      .toContain('**/*.css');
    expect(files)
      .toContain('**/*.scss');
    expect(files)
      .toContain('**/*.less');
  });

  it('merges partial prettier options with the defaults', async () => {
    const files = matchedFiles(await defineConfig({ prettier: { html: true } }));

    expect(files)
      .toContain('**/*.md');
    expect(files)
      .toContain('**/*.html');
    expect(files).not.toContain('**/*.css');
  });

  it('applies rule-block options per formatter', async () => {
    const configs = await defineConfig({
      prettier: {
        markdown: { files: ['docs/**/*.md'] },
        html: {},
      },
    });

    const targetFiles = configs
      .filter((config) => config.rules !== undefined && 'format/prettier' in config.rules)
      .map((config) => config.files);

    expect(targetFiles)
      .toContainEqual(['docs/**/*.md']);
    expect(targetFiles)
      .toContainEqual(['**/*.html']);
    expect(targetFiles)
      .not.toContainEqual(['**/*.md']);
    expect(targetFiles)
      .not.toContainEqual(['**/*.css']);
  });

  it('replaces scss formatter files', async () => {
    const configs = await defineConfig({ prettier: { scss: { files: ['packages/ui/**/*.scss'] } } });

    const targetFiles = configs
      .filter((config) => config.rules !== undefined && 'format/prettier' in config.rules)
      .map((config) => config.files);

    expect(targetFiles)
      .toContainEqual(['packages/ui/**/*.scss']);
    expect(targetFiles)
      .not.toContainEqual(['**/*.scss']);
    expect(targetFiles)
      .not.toContainEqual(['**/*.css']);
  });

  it('can disable prettier entirely', async () => {
    const names = pluginNames(await defineConfig({ prettier: false }));

    expect(names).not.toContain('format');
  });

  it('keeps node plugin registration global while scoping node rules', async () => {
    const configs = await defineConfig({ node: { ignores: ['**/client/**'] } });

    const pluginBlocks = configs.filter((config) => config.plugins !== undefined && 'n' in config.plugins);
    expect(pluginBlocks)
      .toHaveLength(1);
    expect(pluginBlocks[0]?.ignores)
      .toBeUndefined();

    const ruleBlock = configs.find((config) => config.rules !== undefined && 'n/prefer-node-protocol' in config.rules);
    expect(ruleBlock?.ignores)
      .toStrictEqual(['**/client/**']);
  });

  it('scopes typescript rule blocks but not the language block', async () => {
    const configs = await defineConfig({
      typescript: { tsconfigRootDir: '/project', ignores: ['**/fixtures/**'] },
    });

    const ruleBlocks = configs.filter(
      (config) => config.rules !== undefined && Object.keys(config.rules)
        .some((rule) => rule.startsWith('@typescript-eslint/')),
    );
    expect(ruleBlocks.length)
      .toBeGreaterThan(1);
    for (const block of ruleBlocks) {
      expect(block.ignores)
        .toStrictEqual(['**/fixtures/**']);
    }

    const languageBlock = configs.find(
      (config) => config.languageOptions?.parserOptions !== undefined
        && 'projectService' in (config.languageOptions.parserOptions as object),
    );
    expect(languageBlock?.ignores)
      .toBeUndefined();
    expect(languageBlock?.languageOptions?.parserOptions)
      .toMatchObject({ tsconfigRootDir: '/project' });
  });

  it('scopes vue rules while the processor block keeps its files', async () => {
    const configs = await defineConfig({ vue: { ignores: ['**/legacy/**'] } });

    const vueRuleBlocks = configs.filter(
      (config) => config.rules !== undefined && Object.keys(config.rules)
        .some((rule) => rule.startsWith('vue/')),
    );
    expect(vueRuleBlocks.length)
      .toBeGreaterThan(0);
    for (const block of vueRuleBlocks) {
      expect(block.ignores)
        .toStrictEqual(['**/legacy/**']);
    }

    const processorBlock = configs.find((config) => config.processor !== undefined);
    expect(processorBlock?.files)
      .toStrictEqual(['**/*.vue']);
  });

  it('appends user configs at the end', async () => {
    const userConfig: Linter.Config = { name: 'user', rules: { eqeqeq: 'off' } };
    const configs = await defineConfig({}, userConfig);

    expect(configs.at(-1))
      .toStrictEqual(userConfig);
  });
});
