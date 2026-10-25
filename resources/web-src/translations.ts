import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { strings } from './src/i18n/strings';

const moduleId = 'virtual:translations';
const languageDir = path.resolve(import.meta.dirname, '../language');

const unescape = (s: string) => s.replace(/\\(.)/g, (_, c: string) => (c === 'n' ? '\n' : c));

// Reads only strings, used by Web UI, from add-on's strings.po files: { "ru": { 30719: "..." } }
function readTranslations(): Record<string, Record<number, string>> {
  const ids = new Set<number>(Object.values(strings));
  const ret: Record<string, Record<number, string>> = {};

  for (const dir of readdirSync(languageDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()) {
    const po = readFileSync(path.join(languageDir, dir, 'strings.po'), 'utf-8');
    const code = /^"Language: ([^\\]+)\\n"$/m.exec(po)?.[1].trim();
    if (!code) throw new Error(`No Language header in ${dir}/strings.po`);

    const messages: Record<number, string> = {};
    for (const [, id, msgid, msgstr] of po.matchAll(/^msgctxt "#(\d+)"\nmsgid "(.*)"\nmsgstr "(.*)"$/gm)) {
      // English file has empty msgstr, its text is msgid
      const text = unescape(msgstr || (code === 'en' ? msgid : ''));
      if (ids.has(Number(id)) && text) messages[Number(id)] = text;
    }
    // Kodi uses "ua" for Ukrainian, browsers use "uk"
    ret[code.replace('_', '-').replace(/^ua$/, 'uk')] = messages;
  }

  const missing = [...ids].filter((id) => !ret.en?.[id]);
  if (missing.length) throw new Error(`Web UI strings missing in English strings.po: ${missing.join(', ')}`);
  return ret;
}

export default function translations(): Plugin {
  return {
    name: 'elementum-translations',
    resolveId: (id) => (id === moduleId ? `\0${moduleId}` : undefined),
    load(id) {
      if (id !== `\0${moduleId}`) return;
      this.addWatchFile(languageDir);
      return `export default ${JSON.stringify(readTranslations())};`;
    },
  };
}
