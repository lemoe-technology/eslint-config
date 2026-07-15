import type { Linter } from 'eslint';

import type { UserOptions } from './types.ts';

import { defineConfig } from './defineConfig.ts';

export const presetVueOptions: Readonly<UserOptions> = {
  vue: true,
  prettier: true,
};

export const presetVue: () => Promise<Linter.Config[]> = async () => defineConfig(presetVueOptions);
