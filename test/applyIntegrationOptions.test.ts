import type { Linter } from 'eslint';

import { describe, expect, it } from 'vitest';

import type { TypeScriptOptions } from '../src/types.ts';

import { applyIntegrationOptions } from '../src/configs/utils/applyIntegrationOptions.ts';

describe(applyIntegrationOptions, () => {
  const plugin = { rules: {} };

  const configs: Linter.Config[] = [
    { plugins: { demo: plugin } },
    { files: ['**/*.ts'], languageOptions: { ecmaVersion: 2022 } },
    { files: ['**/*.ts'], ignores: ['**/*.gen.ts'], rules: { 'demo/a': 'error', 'demo/b': 'error' } },
  ];

  it('returns the same array when no rule-block field is present', () => {
    const option: TypeScriptOptions = { tsconfigRootDir: '/project' };

    expect(applyIntegrationOptions(configs, undefined))
      .toBe(configs);
    expect(applyIntegrationOptions(configs, option))
      .toBe(configs);
  });

  it('replaces files and ignores on rule blocks only', () => {
    const [pluginPart, languagePart, rulePart] = applyIntegrationOptions(configs, {
      files: ['src/**'],
      ignores: ['src/vendor/**'],
    });

    expect(pluginPart)
      .toStrictEqual({ plugins: { demo: plugin } });
    expect(languagePart)
      .toStrictEqual({ files: ['**/*.ts'], languageOptions: { ecmaVersion: 2022 } });
    expect(rulePart)
      .toMatchObject({ files: ['src/**'], ignores: ['src/vendor/**'] });
    expect(rulePart?.rules)
      .toStrictEqual({ 'demo/a': 'error', 'demo/b': 'error' });
  });

  it('clears existing ignores with an empty array', () => {
    const [, , rulePart] = applyIntegrationOptions(configs, { ignores: [] });

    expect(rulePart?.ignores)
      .toStrictEqual([]);
  });

  it('merges rules key by key, user entries winning', () => {
    const [, , rulePart] = applyIntegrationOptions(configs, {
      rules: { 'demo/b': 'off', 'demo/c': 'warn' },
    });

    expect(rulePart?.rules)
      .toStrictEqual({ 'demo/a': 'error', 'demo/b': 'off', 'demo/c': 'warn' });
  });

  it('reads only the rule-block fields from a wider option object', () => {
    const option: TypeScriptOptions = { tsconfigRootDir: '/project', ignores: ['src/vendor/**'] };

    const [, , rulePart] = applyIntegrationOptions(configs, option);

    expect(rulePart)
      .not.toHaveProperty('tsconfigRootDir');
    expect(rulePart?.ignores)
      .toStrictEqual(['src/vendor/**']);
    expect(rulePart?.files)
      .toStrictEqual(['**/*.ts']);
  });
});
