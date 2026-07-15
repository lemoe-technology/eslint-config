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
    expect(names).not.toContain('package-json');
    expect(names).not.toContain('yml');
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

  it('can disable prettier entirely', async () => {
    const names = pluginNames(await defineConfig({ prettier: false }));

    expect(names).not.toContain('format');
  });

  it('appends user configs at the end', async () => {
    const userConfig: Linter.Config = { name: 'user', rules: { eqeqeq: 'off' } };
    const configs = await defineConfig({}, userConfig);

    expect(configs.at(-1))
      .toStrictEqual(userConfig);
  });
});
