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

| Option       | Type                                                               | Default                                       |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------- |
| `typescript` | `boolean \| { tsconfigRootDir?: string }`                          | `true`                                        |
| `node`       | `boolean`                                                          | `false`                                       |
| `vue`        | `boolean \| { tailwind?: boolean \| { cssConfigPath?: string } }`  | `false`                                       |
| `jsonc`      | `boolean`                                                          | `true`                                        |
| `yaml`       | `boolean`                                                          | `true`                                        |
| `toml`       | `boolean`                                                          | `false`                                       |
| `test`       | `boolean`                                                          | `false`                                       |
| `prettier`   | `boolean \| { markdown?: boolean, html?: boolean, css?: boolean }` | `{ markdown: true, html: false, css: false }` |

## License

[MIT](./LICENSE) License © 2026-Present [Lemoe](https://github.com/lemoe2021)
