import type { Linter } from 'eslint';

export interface RuleBlockOptions {
  /**
   * Replaces the file globs of the rule blocks.
   */
  files?: string[];

  /**
   * Replaces the ignores of the rule blocks.
   */
  ignores?: string[];

  /**
   * @example
   * ```ts
   * js: {
   *   rules: {
   *     'no-console': 'off',
   *   },
   * }
   * ```
   */
  rules?: Linter.RulesRecord;
}

export type IntegrationOptions<T extends RuleBlockOptions = RuleBlockOptions> = boolean | T;

export interface TypeScriptOptions extends RuleBlockOptions {
  /**
   * Absolute path to the project root, passed through to typescript-eslint's parserOptions.
   *
   * Only needed when tsconfig auto-discovery is ambiguous — typescript-eslint errors in that case (e.g. monorepos).
   */
  tsconfigRootDir?: string;
}

export interface TailwindOptions extends RuleBlockOptions {
  /**
   * Path to the Tailwind v4 CSS entry.
   *
   * @defaultValue `'src/styles/main.css'`
   */
  cssConfigPath?: string;
}

export interface VueOptions extends RuleBlockOptions {
  /**
   * @defaultValue `true`
   */
  tailwind?: IntegrationOptions<TailwindOptions>;
}

export interface PrettierOptions {
  /**
   * @defaultValue `true`
   */
  markdown?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  html?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  css?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  scss?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  less?: IntegrationOptions;
}

export interface UserOptions {
  /**
   * @defaultValue `true`
   */
  js?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  comments?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  regexp?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  stylistic?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  imports?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  packageJson?: RuleBlockOptions;

  /**
   * @defaultValue `true`
   */
  typescript?: IntegrationOptions<TypeScriptOptions>;

  /**
   * @defaultValue `false`
   */
  node?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  vue?: IntegrationOptions<VueOptions>;

  /**
   * @defaultValue `true`
   */
  jsonc?: IntegrationOptions;

  /**
   * @defaultValue `true`
   */
  yaml?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  toml?: IntegrationOptions;

  /**
   * @defaultValue `false`
   */
  test?: IntegrationOptions;

  /**
   * When set to `true`, it will enable all formatters.
   *
   * @defaultValue `{ markdown: true, html: false, css: false }`
   */
  prettier?: boolean | PrettierOptions;
}
