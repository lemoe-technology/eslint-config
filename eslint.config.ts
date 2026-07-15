import type { Linter } from 'eslint';

import { defineConfig } from './src/defineConfig.ts';
import { presetNodeOptions } from './src/presetNode.ts';

const config: Linter.Config[] = await defineConfig({
  ...presetNodeOptions,
  test: true,
});

export default config;
