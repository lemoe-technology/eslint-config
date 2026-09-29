import type { Linter } from 'eslint';

interface ScopeOptions {
  languageFiles?: string[];
  ruleFiles?: string[];
}

export function scopePreset(preset: Linter.Config[], { languageFiles, ruleFiles = languageFiles }: ScopeOptions = {}): Linter.Config[] {
  const part = (config: object): Linter.Config | undefined => {
    const entries = Object.entries(config)
      .filter(([, value]) => value !== undefined);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  };

  return preset.flatMap((block) => {
    const parts: Linter.Config[] = [];

    const { name, files, ignores, plugins, language, languageOptions, rules, processor, ...rest } = block;

    const pluginPart = part({ plugins, ...rest });
    if (pluginPart) {
      parts.push(pluginPart);
    }

    if (language !== undefined || languageOptions !== undefined || processor !== undefined) {
      const languagePart = part({ language, languageOptions, processor, ignores });

      if (languagePart !== undefined) {
        const targetFiles = languageFiles ?? files;

        parts.push(targetFiles !== undefined ? { ...languagePart, files: targetFiles } : languagePart);
      }
    }

    if (rules !== undefined || ignores !== undefined) {
      const rulesPart = part({ rules, ignores });

      if (rulesPart !== undefined) {
        const targetFiles = ruleFiles ?? files;

        parts.push(targetFiles !== undefined ? { ...rulesPart, files: targetFiles } : rulesPart);
      }
    }

    return parts;
  });
}
