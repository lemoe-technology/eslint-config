import type { Linter } from 'eslint';

export async function node(): Promise<Linter.Config[]> {
  const { default: nodePlugin } = await import('eslint-plugin-n');

  return [
    {
      plugins: {
        n: nodePlugin,
      },
      rules: {
        'n/no-deprecated-api': 'error',
        'n/process-exit-as-throw': 'error',
        'n/prefer-node-protocol': 'error',
        'n/no-unpublished-bin': 'error',
      },
    },
  ];
}
