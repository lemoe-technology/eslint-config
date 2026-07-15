import type { Linter } from 'eslint';

import type { UserOptions } from './types.ts';

import { defineConfig } from './defineConfig.ts';

export const presetOptions: Readonly<UserOptions> = {};

export const preset: () => Promise<Linter.Config[]> = async () => defineConfig(presetOptions);
