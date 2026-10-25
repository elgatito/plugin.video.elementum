import React, { useState } from 'react';
import { Button, Checkbox, Message, Modal, Popup } from 'semantic-ui-react';
import { ITorrent } from '../dataStructure';
import { t } from '../i18n';

interface ITorrentListProps {
  torrents: ITorrent[];
}

const DeleteTorrentModal = ({ torrents }: ITorrentListProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [deleteFiles, setDeleteFiles] = useState(false);
  const hasSelectedTorrent = torrents.length > 0;

  // TODO: handle response
  // TODO: update list after executing fetch
  function deleteSelectedTorrent() {
    void Promise.all(torrents.map((t) => fetch(`/torrents/delete/${t.id}?torrent=true&files=${deleteFiles}`)));
    setOpen(false);
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        <Popup
          trigger={
            <div style={{ display: 'inline-block' }}>
              <Button content={t('delete')} disabled={!hasSelectedTorrent} onClick={(_, _data) => setOpen(true)} />
            </div>
          }
          content={t('selectTorrentFirst')}
          disabled={hasSelectedTorrent}
          closeOnTriggerClick={false}
          inverted
        />
      }
    >
      <Modal.Header>{torrents.length === 1 ? t('deleteTorrent', torrents[0].name) : t('deleteSelectedTorrents')}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {t('deleteConfirmation')}
          <ol>
            {torrents.map((torrent) => (
              <li key={torrent.id}>
                <b>{torrent.name}</b>
              </li>
            ))}
          </ol>
          <Message negative>
            <Checkbox label={t('alsoDeleteFiles')} onChange={(e, data) => setDeleteFiles(data.checked ?? false)} />
          </Message>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content={t('no')} icon="undo" onClick={() => setOpen(false)} />
        <Button content={t('yes')} icon="trash" color="red" onClick={() => deleteSelectedTorrent()} />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteTorrentModal;
