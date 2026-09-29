# @lemoe-technology/eslint-config

ESLint config.

## Install

```bash
pnpm add -D eslint @stylistic/eslint-plugin @lemoe-technology/eslint-config
```

`@stylistic/eslint-plugin` is required by eslint-plugin-vue.

### presetVue

```bash
pnpm add -D tailwindcss
```

## Preset

| Preset       | Options           |
| ------------ | ----------------- |
| `preset`     | TypeScript        |
| `presetNode` | TypeScript + Node |
| `presetVue`  | TypeScript + Vue  |

```ts
import { preset } from '@lemoe-technology/eslint-config';

export default preset();
```

### TypeScript

In a monorepo, the project path must be specified.

```ts
import { defineConfig } from '@lemoe-technology/eslint-config';

export default defineConfig({
  typescript: {
    tsconfigRootDir: import.meta.dirname,
  },
});
```

## Customization

```ts
import { defineConfig } from '@lemoe-technology/eslint-config';

export default defineConfig({
  typescript: true,
  node: false,
  vue: false,
  jsonc: true,
  yaml: true,
  toml: false,
  test: false,
  prettier: { markdown: true, html: false, css: false },
});
```

### Options

| Option        | Default                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `js`          | `true`                                                                  |
| `comments`    | `true`                                                                  |
| `regexp`      | `true`                                                                  |
| `stylistic`   | `true`                                                                  |
| `imports`     | `true`                                                                  |
| `packageJson` | `true`                                                                  |
| `typescript`  | `true`                                                                  |
| `node`        | `false`                                                                 |
| `vue`         | `false`                                                                 |
| `jsonc`       | `true`                                                                  |
| `yaml`        | `true`                                                                  |
| `toml`        | `false`                                                                 |
| `test`        | `false`                                                                 |
| `prettier`    | `{ markdown: true, html: false, css: false, scss: false, less: false }` |

### Rule Block Options

```ts
import { defineConfig } from '@lemoe-technology/eslint-config';

export default defineConfig({
  js: {
    ignores: ['**/scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
});
```

Keep file extensions in `files` globs (`docs/**/*.md`, not `docs/**`).

```ts
import { defineConfig } from '@lemoe-technology/eslint-config';

export default defineConfig({
  prettier: {
    markdown: {
      files: ['docs/**/*.md'],
    },
  },
});
```

#### Default `files`

| Integration         | `files`                                 |
| ------------------- | --------------------------------------- |
| `js`                |                                         |
| `comments`          |                                         |
| `regexp`            |                                         |
| `stylistic`         |                                         |
| `imports`           |                                         |
| `packageJson`       | `**/package.json`                       |
| `node`              |                                         |
| `typescript`        | `**/*.ts`, `**/*.tsx`, `**/*.vue`       |
| `vue`               | `**/*.vue`                              |
| `test`              | `**/*.{test,spec}.?(c\|m)[jt]s?(x)`     |
| `jsonc`             | `**/*.json`, `**/*.jsonc`, `**/*.json5` |
| `yaml`              | `**/*.yaml`, `**/*.yml`                 |
| `toml`              | `**/*.toml`                             |
| `prettier.markdown` | `**/*.md`                               |
| `prettier.html`     | `**/*.html`                             |
| `prettier.css`      | `**/*.css`                              |
| `prettier.scss`     | `**/*.scss`                             |
| `prettier.less`     | `**/*.less`                             |

## License

[MIT](./LICENSE) License © 2026-Present [Lemoe](https://github.com/lemoe2021)
