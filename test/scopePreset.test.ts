import type { ESLint, Linter } from 'eslint';

import { describe, expect, it } from 'vitest';

import { scopePreset } from '../src/configs/utils/scopePreset.ts';

const plugin: ESLint.Plugin = { rules: {} };

describe(scopePreset, () => {
  it('splits a full block into plugins, language and rules parts', () => {
    const [pluginsPart, languagePart, rulesPart] = scopePreset(
      [
        {
          plugins: { demo: plugin },
          languageOptions: { ecmaVersion: 2022 },
          rules: { 'demo/rule': 'error' },
        },
      ],
      { languageFiles: ['**/*.ts'], ruleFiles: ['**/*.ts', '**/*.vue'] },
    );

    expect(pluginsPart)
      .toStrictEqual({ plugins: { demo: plugin } });
    expect(languagePart)
      .toStrictEqual({ files: ['**/*.ts'], languageOptions: { ecmaVersion: 2022 } });
    expect(rulesPart)
      .toStrictEqual({ files: ['**/*.ts', '**/*.vue'], rules: { 'demo/rule': 'error' } });
  });

  it('registers plugins-only blocks without files', () => {
    const [part] = scopePreset([{ plugins: { demo: plugin } }], { languageFiles: ['**/*.ts'] });

    expect(part)
      .toStrictEqual({ plugins: { demo: plugin } });
  });

  it('passes plugins-only blocks through with their extra properties', () => {
    const block = { plugins: { demo: plugin }, settings: { demo: true } } satisfies Linter.Config;

    expect(scopePreset([block], { languageFiles: ['**/*.ts'] }))
      .toStrictEqual([block]);
  });

  it('scopes rules-only blocks with ruleFiles', () => {
    const [part] = scopePreset(
      [{ rules: { 'demo/rule': 'error' } }],
      { languageFiles: ['**/*.ts'], ruleFiles: ['**/*.ts', '**/*.vue'] },
    );

    expect(part)
      .toStrictEqual({ files: ['**/*.ts', '**/*.vue'], rules: { 'demo/rule': 'error' } });
  });

  it('keeps a processor with the language part even without language keys', () => {
    const [pluginPart, languagePart] = scopePreset(
      [{ plugins: { demo: plugin }, processor: 'demo/processor' }],
      { languageFiles: ['**/*.ts'] },
    );

    expect(pluginPart)
      .toStrictEqual({ plugins: { demo: plugin } });
    expect(languagePart)
      .toStrictEqual({ files: ['**/*.ts'], processor: 'demo/processor' });
  });

  it('keeps ignores on a scoped part when no rules exist', () => {
    const [pluginPart, scopedPart] = scopePreset(
      [{ plugins: { demo: plugin }, ignores: ['**/dist/**'] }],
      { languageFiles: ['**/*.ts'] },
    );

    expect(pluginPart)
      .toStrictEqual({ plugins: { demo: plugin } });
    expect(scopedPart)
      .toStrictEqual({ files: ['**/*.ts'], ignores: ['**/dist/**'] });
  });

  it('falls back to languageFiles when ruleFiles is omitted', () => {
    const [part] = scopePreset([{ rules: { 'demo/rule': 'error' } }], { languageFiles: ['**/*.ts'] });

    expect(part)
      .toStrictEqual({ files: ['**/*.ts'], rules: { 'demo/rule': 'error' } });
  });

  it('scopes ignores-only blocks with ruleFiles', () => {
    const [part] = scopePreset([{ ignores: ['**/dist'] }], { languageFiles: ['**/*.ts'] });

    expect(part)
      .toStrictEqual({ files: ['**/*.ts'], ignores: ['**/dist'] });
  });

  it('drops name and puts shared options on the unscoped part', () => {
    const [pluginPart, languagePart, rulesPart] = scopePreset(
      [
        {
          name: 'demo',
          plugins: { demo: plugin },
          languageOptions: { ecmaVersion: 2022 },
          rules: { 'demo/rule': 'error' },
          settings: { demo: true },
        },
      ],
      { languageFiles: ['**/*.ts'] },
    );

    expect(pluginPart)
      .toStrictEqual({ plugins: { demo: plugin }, settings: { demo: true } });
    expect(languagePart)
      .toStrictEqual({ files: ['**/*.ts'], languageOptions: { ecmaVersion: 2022 } });
    expect(rulesPart)
      .toStrictEqual({ files: ['**/*.ts'], rules: { 'demo/rule': 'error' } });
    expect(rulesPart).not.toHaveProperty('name');
  });
});
