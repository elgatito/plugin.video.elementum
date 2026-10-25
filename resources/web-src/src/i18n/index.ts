import translations from 'virtual:translations';
import { StringKey, strings } from './strings';

const languageSettingName = 'language';
// Language of the selected Kodi, remembered so the page starts in it before Kodi list is loaded
const kodiLanguageName = 'kodiLanguage';

export const languages = Object.keys(translations);

// Empty value means automatic language
export const getLanguageSetting = (): string => window.localStorage.getItem(languageSettingName) ?? '';

export const saveLanguageSetting = (language: string): void => {
  window.localStorage.setItem(languageSettingName, language);
};

// First supported one: exact match ("pt-BR"), then same base language ("pt" for "pt_pt"), English otherwise
function pickLanguage(wanted: string[]): string {
  for (const w of wanted.filter(Boolean).map((l) => l.toLowerCase().replace('_', '-'))) {
    const exact = languages.find((l) => l.toLowerCase() === w);
    const base = languages.find((l) => l.split('-')[0] === w.split('-')[0]);
    if (exact ?? base) return (exact ?? base)!;
  }
  return 'en';
}

let kodiLanguage = window.localStorage.getItem(kodiLanguageName) ?? '';

// Language used without user's own choice: selected Kodi's one, then browser's one
export const automaticLanguage = (): string => pickLanguage([kodiLanguage, ...navigator.languages]);

const detectLanguage = () => (getLanguageSetting() ? pickLanguage([getLanguageSetting()]) : automaticLanguage());

export let language = detectLanguage();
document.documentElement.lang = language;

// Returns true, if used language has changed and the page should be rendered again
export const setKodiLanguage = (code: string): boolean => {
  kodiLanguage = code;
  window.localStorage.setItem(kodiLanguageName, code);

  const previous = language;
  language = detectLanguage();
  document.documentElement.lang = language;
  return language !== previous;
};

export const languageName = (code: string): string => new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;

export const t = (key: StringKey, ...args: string[]): string =>
  args.reduce((s, arg) => s.replace('%s', arg), translations[language][strings[key]] ?? translations.en[strings[key]]);
