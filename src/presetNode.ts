import type { Linter } from 'eslint';

import type { UserOptions } from './types.ts';

import { defineConfig } from './defineConfig.ts';

export const presetNodeOptions: Readonly<UserOptions> = {
  node: true,
};

export const presetNode: () => Promise<Linter.Config[]> = async () => defineConfig(presetNodeOptions);
