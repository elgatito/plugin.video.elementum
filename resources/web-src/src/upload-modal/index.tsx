import React from 'react';
import { Button, Dropdown, Form, Icon, Modal } from 'semantic-ui-react';
import { t } from '../i18n';
import { kodiOptions, useKodi } from '../kodi';

function UploadTorrentModal(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [uri, setUri] = React.useState('');
  const [file, setFile] = React.useState<File>();
  const { kodis, selectedKodi } = useKodi();
  // Kodi to play on, unset means the one chosen in the header
  const [kodi, setKodi] = React.useState<string>();
  const playKodi = kodi ?? selectedKodi?.host;

  async function addTorrent(path: string, additionalData?: [name: string, value: string][]) {
    const formData = new FormData();
    formData.append('uri', uri);
    formData.append('file', file ?? 'null');
    additionalData?.forEach((x) => formData.append(x[0], x[1]));

    await fetch(path, {
      method: 'POST',
      body: formData,
    });
    setOpen(false);
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {
        setKodi(undefined);
        setOpen(true);
      }}
      open={open}
      trigger={
        <Button icon labelPosition="left" floated="right" primary>
          <Icon name="download" />
          {t('addTorrent')}
        </Button>
      }
    >
      <Modal.Header>{t('addTorrent')}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input placeholder={t('torrentUrl')} onChange={(e) => setUri(e.target.value)} />
            <Form.Input type="file" accept=".torrent" onChange={(e) => setFile(e.target.files?.item(0) ?? undefined)} />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content={t('cancel')} color="red" onClick={() => setOpen(false)} />
        {/* "All files" is a variant of Add, as a menu it leaves room for Kodi choice in one line */}
        <Button.Group color="blue">
          <Button content={t('add')} icon="download" onClick={() => addTorrent('/torrents/add')} />
          <Dropdown
            className="button icon"
            floating
            trigger={<></>}
            options={[
              { key: 'all', icon: 'download', text: t('addAllFiles'), onClick: () => void addTorrent('/torrents/add', [['all', '1']]) },
            ]}
          />
        </Button.Group>
        {/* Kodi choice belongs to Play, keep them together when buttons wrap */}
        <span className="kodi-play">
          <Dropdown
            selection
            compact
            options={kodiOptions(kodis)}
            value={playKodi}
            // Only the name fits next to the buttons, the list shows full details
            text={kodis.find((k) => k.host === playKodi)?.name || playKodi}
            title={kodiOptions(kodis).find((o) => o.value === playKodi)?.text}
            onChange={(_event, data) => setKodi(String(data.value))}
          />
          <Button
            content={t('play')}
            icon="play"
            color="green"
            onClick={() => addTorrent(playKodi ? `/playuri?kodi=${encodeURIComponent(playKodi)}` : '/playuri')}
          />
        </span>
      </Modal.Actions>
    </Modal>
  );
}

export default UploadTorrentModal;
