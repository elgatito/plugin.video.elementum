import React, { useState } from 'react';
import { Menu, Image, Modal, Form, Label, Input, Button, Dropdown } from 'semantic-ui-react';
import { saveRefreshRate, getRefreshRate } from '../Services/settings';
import { automaticLanguage, getLanguageSetting, languageName, languages, saveLanguageSetting, t } from '../i18n';
import { kodiOptions, useKodi } from '../kodi';
import logo from '../static/logo.png';

const automaticValue = 'auto';

const HeaderMenu = (): JSX.Element => {
  const [refreshRateInSeconds, setRefreshRate] = useState<number>(() => getRefreshRate() / 1000);
  const [languageSetting, setLanguageSetting] = useState(getLanguageSetting);
  const { kodis, selectedKodi, selectKodi } = useKodi();
  const SaveSettings = (_event: unknown, _data: unknown) => {
    const refreshRate = refreshRateInSeconds < 1 ? 1 : refreshRateInSeconds;
    saveRefreshRate(refreshRate * 1000);
    saveLanguageSetting(languageSetting);
    window.location.reload();
  };

  const StartAll = () => {
    void fetch('/torrents/resume');
  };

  const PauseAll = () => {
    void fetch('/torrents/pause');
  };

  return (
    <Menu borderless style={{ border: 'none' }}>
      <Menu.Item header as="a" href="/web">
        <Image size="mini" src={logo} />
        Elementum
      </Menu.Item>
      <Dropdown item text={t('torrents')}>
        <Dropdown.Menu>
          <Dropdown.Item icon="download" text={t('startAll')} onClick={StartAll} />
          <Dropdown.Item icon="pause" text={t('pauseAll')} onClick={PauseAll} />
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Menu position="right">
        <Dropdown
          item
          icon={{ name: 'tv', style: { marginLeft: '0.5em' } }}
          text={selectedKodi?.name || selectedKodi?.host || 'Kodi'}
          value={selectedKodi?.host}
          options={kodiOptions(kodis)}
          onChange={(_event, data) => selectKodi(String(data.value))}
        />
        <Modal trigger={<Menu.Item>{t('settings')}</Menu.Item>} closeIcon>
          <Modal.Header content={t('settings')} />
          <Modal.Content>
            <Form>
              <Form.Group inline>
                <Form.Field>
                  <label htmlFor="refresh-rate">{t('refreshRate')}:</label>
                  <Input
                    type="number"
                    min="1"
                    labelPosition="right"
                    value={refreshRateInSeconds}
                    onChange={(_event, data) => setRefreshRate(Number(data.value))}
                  >
                    <input id="refresh-rate" />
                    <Label>{t('seconds')}</Label>
                  </Input>
                </Form.Field>
              </Form.Group>
              <Form.Group inline>
                <Form.Field>
                  <label htmlFor="language">{t('language')}:</label>
                  <Dropdown
                    id="language"
                    selection
                    // Dropdown treats empty value as no selection, so "automatic" needs its own value
                    value={languageSetting || automaticValue}
                    options={[
                      {
                        key: automaticValue,
                        value: automaticValue,
                        text: `${t('automatic')} (${languageName(automaticLanguage())})`,
                      },
                      ...languages.map((l) => ({ key: l, value: l, text: languageName(l) })),
                    ]}
                    onChange={(_event, data) => setLanguageSetting(data.value === automaticValue ? '' : String(data.value))}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={SaveSettings} positive>
              {t('save')}
            </Button>
          </Modal.Actions>
        </Modal>
      </Menu.Menu>
    </Menu>
  );
};

export default HeaderMenu;
