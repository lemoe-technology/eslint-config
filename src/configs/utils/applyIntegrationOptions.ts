import type { Linter } from 'eslint';

import type { IntegrationOptions } from '../../types.ts';

export function applyIntegrationOptions(configs: Linter.Config[], option: IntegrationOptions | undefined): Linter.Config[] {
  if (typeof option !== 'object') {
    return configs;
  }

  const { files, ignores, rules } = option;

  if (files === undefined && ignores === undefined && rules === undefined) {
    return configs;
  }

  return configs.map((config) => {
    if (config.rules === undefined) {
      return config;
    }

    return {
      ...config,
      ...(files !== undefined ? { files } : {}),
      ...(ignores !== undefined ? { ignores } : {}),
      rules: { ...config.rules, ...rules },
    };
  });
}
