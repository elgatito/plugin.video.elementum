import React, { createContext, useContext, useEffect, useState } from 'react';
import { DropdownItemProps } from 'semantic-ui-react';
import { setKodiLanguage, t } from '../i18n';

export interface KodiHost {
  host: string;
  name: string;
  local: boolean;
  // Kodi UI language, like "pl_pl"
  language: string;
}

interface IKodiContext {
  kodis: KodiHost[];
  // Kodi chosen in the header, daemon uses it for all Web UI requests
  selectedKodi?: KodiHost;
  selectKodi: (host: string) => void;
}

const KodiContext = createContext<IKodiContext>({ kodis: [], selectKodi: () => {} });

const kodiCookie = 'kodi';
const getKodiCookie = () =>
  decodeURIComponent(
    document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${kodiCookie}=`))
      ?.split('=')[1] ?? '',
  );

export const KodiProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [kodis, setKodis] = useState<KodiHost[]>([]);
  const [kodi, setKodi] = useState(getKodiCookie);
  const [languageKey, setLanguageKey] = useState(0);

  // Daemon falls back to the local Kodi, if chosen one is not connected anymore
  const findSelected = (list: KodiHost[], host: string) => list.find((k) => k.host === host) ?? list.find((k) => k.local);

  // Page follows selected Kodi's language, unless user has chosen own one
  const followLanguage = (selected?: KodiHost) => {
    if (selected && setKodiLanguage(selected.language)) setLanguageKey((k) => k + 1);
  };

  useEffect(() => {
    const getKodis = async () => {
      const response = await fetch('/kodis');
      const list = (await response.json()) as KodiHost[];
      setKodis(list);
      followLanguage(findSelected(list, getKodiCookie()));
    };
    void getKodis();
  }, []);

  const selectKodi = (host: string) => {
    document.cookie = `${kodiCookie}=${encodeURIComponent(host)}; path=/; max-age=31536000; SameSite=Lax`;
    setKodi(host);
    followLanguage(findSelected(kodis, host));
  };

  const selectedKodi = findSelected(kodis, kodi);

  return (
    <KodiContext.Provider value={{ kodis, selectedKodi, selectKodi }}>
      {/* Texts are not React state, so the page is re-created to show them in the new language */}
      <React.Fragment key={languageKey}>{children}</React.Fragment>
    </KodiContext.Provider>
  );
};

export const useKodi = (): IKodiContext => useContext(KodiContext);

export const kodiOptions = (kodis: KodiHost[]): DropdownItemProps[] =>
  kodis.map((k) => ({
    key: k.host,
    value: k.host,
    text: `${k.name ? `${k.name} - ` : ''}${k.host}${k.local ? ` (${t('local')})` : ''}`,
  }));
