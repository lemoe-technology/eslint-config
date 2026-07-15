export interface TypeScriptOptions {
  /**
   * Absolute path to the project root, passed through to typescript-eslint's parserOptions.
   *
   * Only needed when tsconfig auto-discovery is ambiguous — typescript-eslint errors in that case (e.g. monorepos).
   */
  tsconfigRootDir?: string;
}

export interface TailwindOptions {
  /**
   * Path to the Tailwind v4 CSS entry.
   *
   * @defaultValue `'src/styles/main.css'`
   */
  cssConfigPath?: string;
}

export interface VueOptions {
  /**
   * @defaultValue `true`
   */
  tailwind?: boolean | TailwindOptions;
}

export interface PrettierOptions {
  /**
   * @defaultValue `true`
   */
  markdown?: boolean;

  /**
   * @defaultValue `false`
   */
  html?: boolean;

  /**
   * @defaultValue `false`
   */
  css?: boolean;
}

export interface UserOptions {
  /**
   * @defaultValue `true`
   */
  typescript?: boolean | TypeScriptOptions;

  /**
   * @defaultValue `false`
   */
  node?: boolean;

  /**
   * @defaultValue `false`
   */
  vue?: boolean | VueOptions;

  /**
   * @defaultValue `true`
   */
  jsonc?: boolean;

  /**
   * @defaultValue `true`
   */
  yaml?: boolean;

  /**
   * @defaultValue `false`
   */
  toml?: boolean;

  /**
   * @defaultValue `false`
   */
  test?: boolean;

  /**
   * When set to `true`, it will enable all formatters.
   *
   * @defaultValue `{ markdown: true, html: false, css: false }`
   */
  prettier?: boolean | PrettierOptions;
}
