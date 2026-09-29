import type { Linter } from 'eslint';

import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { ESLint } from 'eslint';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  defineConfig,
  preset,
  presetNode,
  presetNodeOptions,
  presetOptions,
  presetVue,
  presetVueOptions,
} from '../src/index.ts';

const FIXTURES_DIR = join(process.cwd(), 'test/fixtures');

const COMMON_FIXTURES = ['a.ts', 'b.tsx', 'a.jsx', 'a.json', 'a.yaml', 'a.md', 'package.json'];
const NODE_SCOPE_DIR = join(FIXTURES_DIR, 'node-scope');

describe('preset options', () => {
  it('exports the documented option sets', () => {
    expect(presetOptions)
      .toStrictEqual({});
    expect(presetNodeOptions)
      .toStrictEqual({ node: true });
    expect(presetVueOptions)
      .toStrictEqual({ vue: true, prettier: true });
  });
});

describe('default ignores', () => {
  it.concurrent('yaml: ignores lockfiles', async () => {
    const eslint = new ESLint({
      cwd: process.cwd(),
      overrideConfig: await presetNode(),
      overrideConfigFile: true,
    });

    await expect(eslint.isPathIgnored('pnpm-lock.yaml')).resolves
      .toBe(true);
    await expect(eslint.isPathIgnored('src/index.ts')).resolves
      .toBe(false);
  });

  it.concurrent('typescript: ignores .gen.d.ts', async () => {
    const eslint = new ESLint({
      cwd: process.cwd(),
      overrideConfig: await presetNode(),
      overrideConfigFile: true,
    });

    await expect(eslint.isPathIgnored('src/auto-imports.gen.d.ts')).resolves
      .toBe(true);
    await expect(eslint.isPathIgnored('src/env.d.ts')).resolves
      .toBe(false);
  });

  it.concurrent('test: ignores fixtures', async () => {
    const eslint = new ESLint({
      cwd: process.cwd(),
      overrideConfig: await defineConfig({ node: true, test: true }),
      overrideConfigFile: true,
    });

    await expect(eslint.isPathIgnored('test/fixtures/a.ts')).resolves
      .toBe(true);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Signal A — smoke: every preset must assemble and lint the file types it covers without crashing.
// No rule behavior is asserted.
// ---------------------------------------------------------------------------------------------------------------------

async function fixtureESLint(load: () => Promise<Linter.Config[]>): Promise<ESLint> {
  return new ESLint({
    cwd: FIXTURES_DIR,
    overrideConfig: await load(),
    overrideConfigFile: 'eslint.config.mjs',
  });
}

async function lintFixtures(load: () => Promise<Linter.Config[]>, files: string[]): Promise<ESLint.LintResult[]> {
  const eslint = await fixtureESLint(load);
  return eslint.lintFiles(files);
}

function countFatals(results: ESLint.LintResult[]): number {
  return results.reduce((total, result) => total + result.fatalErrorCount, 0);
}

describe('smoke: presets assemble and lint without crashing', () => {
  it.concurrent('preset', async () => {
    const results = await lintFixtures(preset, COMMON_FIXTURES);

    expect(results)
      .toHaveLength(COMMON_FIXTURES.length);
    expect(countFatals(results), 'preset')
      .toBe(0);
  });

  it.concurrent('presetNode', async () => {
    const results = await lintFixtures(presetNode, COMMON_FIXTURES);

    expect(results)
      .toHaveLength(COMMON_FIXTURES.length);
    expect(countFatals(results), 'presetNode')
      .toBe(0);
  });

  it.concurrent('presetVue', async () => {
    const files = [...COMMON_FIXTURES, 'a.vue', 'a.css', 'a.html'];
    const results = await lintFixtures(presetVue, files);

    expect(results)
      .toHaveLength(files.length);
    expect(countFatals(results), 'presetVue')
      .toBe(0);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Signal B — scoping: config for each fixture file must contain the rule namespaces of the languages that target it.
// ---------------------------------------------------------------------------------------------------------------------

const SCOPE_CONFIG_FILE = 'scope.generated.config.ts';
const SCOPE_CONFIG_PATH = join(FIXTURES_DIR, SCOPE_CONFIG_FILE);

const execFile = promisify(execFileCallback);

interface ScopeCase {
  file: string;
  expectNamespaces: string[];
  rejectNamespaces: string[];
}

const SCOPE_CASES: ScopeCase[] = [
  { file: 'a.ts', expectNamespaces: ['@typescript-eslint'], rejectNamespaces: ['toml', 'jsonc', 'yml', 'format', 'vue'] },
  { file: 'b.tsx', expectNamespaces: ['@typescript-eslint', '@stylistic'], rejectNamespaces: ['toml', 'jsonc', 'yml', 'format', 'vue'] },
  { file: 'a.jsx', expectNamespaces: ['@stylistic'], rejectNamespaces: ['@typescript-eslint', 'toml', 'jsonc', 'yml', 'format', 'vue'] },
  { file: 'a.vue', expectNamespaces: ['vue', '@typescript-eslint', 'tailwindcss'], rejectNamespaces: ['toml'] },
  { file: 'a.json', expectNamespaces: ['jsonc'], rejectNamespaces: ['@typescript-eslint', 'vue'] },
  { file: 'package.json', expectNamespaces: ['package-json'], rejectNamespaces: ['vue'] },
  { file: 'a.yaml', expectNamespaces: ['yml'], rejectNamespaces: ['@typescript-eslint', 'vue'] },
  { file: 'a.toml', expectNamespaces: ['toml'], rejectNamespaces: ['@typescript-eslint', 'vue'] },
  { file: 'a.md', expectNamespaces: ['format'], rejectNamespaces: ['@typescript-eslint', 'toml', 'vue'] },
  { file: 'a.css', expectNamespaces: ['format'], rejectNamespaces: ['vue'] },
  { file: 'a.html', expectNamespaces: ['format'], rejectNamespaces: ['vue'] },
  { file: 'a.spec.ts', expectNamespaces: ['vitest'], rejectNamespaces: ['toml', 'jsonc', 'format'] },
];

async function ruleNamespaces(file: string): Promise<Set<string>> {
  const { stdout } = await execFile(
    process.execPath,
    [
      join(process.cwd(), 'node_modules', 'eslint', 'bin', 'eslint.js'),
      '--config',
      SCOPE_CONFIG_FILE,
      '--print-config',
      file,
    ],
    { cwd: FIXTURES_DIR },
  );

  const config = JSON.parse(stdout) as Linter.Config;
  return new Set(
    Object.entries(config.rules ?? {})
      .map(([rule]) => {
        const separator = rule.indexOf('/');
        return separator === -1 ? rule : rule.slice(0, separator);
      }),
  );
}

describe('scoping: calculated configs match file types', () => {
  beforeAll(async () => {
    await writeFile(
      SCOPE_CONFIG_PATH,
      [
        '// Generated by presets.test.ts at run time; removed in afterAll.',
        'import { defineConfig } from \'../../src/index.ts\';',
        '',
        'export default await defineConfig({ vue: true, toml: true, prettier: true, test: true });',
        '',
      ].join('\n'),
    );
  });

  afterAll(async () => {
    await rm(SCOPE_CONFIG_PATH, { force: true });
  });

  it.concurrent('applies each language only to the files it targets', async () => {
    const namespacesByFile = new Map(
      await Promise.all(
        SCOPE_CASES.map(async (scopeCase) => [scopeCase.file, await ruleNamespaces(scopeCase.file)] as const),
      ),
    );

    for (const { file, expectNamespaces, rejectNamespaces } of SCOPE_CASES) {
      const namespaces = namespacesByFile.get(file);

      for (const namespace of expectNamespaces) {
        expect(namespaces, `${file} should carry ${namespace}`)
          .toContain(namespace);
      }
      for (const namespace of rejectNamespaces) {
        expect(namespaces, `${file} should not carry ${namespace}`).not.toContain(namespace);
      }
    }
  });
});

describe('scoping: node rules honour ignores', () => {
  beforeAll(async () => {
    await mkdir(join(NODE_SCOPE_DIR, 'client'), { recursive: true });
    await mkdir(join(NODE_SCOPE_DIR, 'server'), { recursive: true });
    await writeFile(join(NODE_SCOPE_DIR, 'client', 'a.js'), 'const fs = require(\'fs\');\n');
    await writeFile(join(NODE_SCOPE_DIR, 'server', 'a.js'), 'const fs = require(\'fs\');\n');
  });

  afterAll(async () => {
    await rm(NODE_SCOPE_DIR, { recursive: true, force: true });
  });

  it('keeps client files free of node rules while server files keep them', async () => {
    const eslint = new ESLint({
      cwd: NODE_SCOPE_DIR,
      overrideConfig: await defineConfig({ node: { ignores: ['**/client/**'] } }),
      overrideConfigFile: true,
    });

    const results = await eslint.lintFiles(['client/a.js', 'server/a.js']);
    const client = results[0]!;
    const server = results[1]!;

    expect(client.messages.filter((message) => message.ruleId?.startsWith('n/')))
      .toHaveLength(0);
    expect(server.messages.some((message) => message.ruleId === 'n/prefer-node-protocol'))
      .toBe(true);
  });

  it('calculateConfigForFile honours ignores for virtual paths', async () => {
    const eslint = new ESLint({
      cwd: process.cwd(),
      overrideConfig: await defineConfig({ node: { ignores: ['plugins/*/src/client/**'] } }),
      overrideConfigFile: true,
    });

    const client = (await eslint.calculateConfigForFile('plugins/foo/src/client/a.js')) as Linter.Config;
    const server = (await eslint.calculateConfigForFile('plugins/foo/src/server/a.js')) as Linter.Config;

    expect(Object.keys(client.rules ?? {})
      .filter((rule) => rule.startsWith('n/')))
      .toHaveLength(0);
    expect(Object.keys(server.rules ?? {})
      .some((rule) => rule.startsWith('n/')))
      .toBe(true);
  });
});
