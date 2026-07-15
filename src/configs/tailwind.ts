import type { Linter } from 'eslint';

const DEFAULT_CSS_CONFIG_PATH = 'src/styles/main.css';

export async function tailwind(cssConfigPath: string = DEFAULT_CSS_CONFIG_PATH): Promise<Linter.Config[]> {
  const { default: tailwindPlugin } = await import('eslint-plugin-tailwindcss');

  return [
    {
      plugins: {
        // @ts-expect-error - eslint-plugin-tailwindcss uses @typescript-eslint/utils types, which is not compatible with eslint@10 plugin types.
        tailwindcss: tailwindPlugin,
      },
      settings: {
        tailwindcss: {
          cssConfigPath,
        },
      },
    },
    {
      files: ['**/*.vue'],
      settings: {
        tailwindcss: {
          attributes: ['class'],
        },
      },
      rules: {
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'error',
        'tailwindcss/important-modifier-suffix': 'error',
        'tailwindcss/no-contradicting-classname': 'error',
      },
    },
  ];
}
