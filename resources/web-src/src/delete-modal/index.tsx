import React, { useState } from 'react';
import { Button, Checkbox, Message, Modal, Popup } from 'semantic-ui-react';
import { ITorrent } from '../dataStructure';

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
    torrents.map((t) => fetch(`/torrents/delete/${t.id}?torrent=true&files=${deleteFiles}`));
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
              <Button content="Delete" disabled={!hasSelectedTorrent} onClick={(_, _data) => setOpen(true)} />
            </div>
          }
          content="Select a torrent first"
          disabled={hasSelectedTorrent}
          closeOnTriggerClick={false}
          inverted
        />
      }
    >
      <Modal.Header>{torrents.length === 1 ? `Delete ${torrents[0].name}` : `Delete ${torrents.length} torrents?`} </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Are you sure you want to delete
          {torrents.length === 1 ? (
            <>
              <b> {torrents[0].name}</b>?
            </>
          ) : (
            <>
              <> these {torrents.length} torrents?</>
              <ol>
                {torrents.map((t) => (
                  <li>
                    <b>{t.name}</b>
                  </li>
                ))}
              </ol>
            </>
          )}
          <Message negative>
            <Checkbox label="Also delete files" onChange={(e, data) => setDeleteFiles(data.checked ?? false)} />
          </Message>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="No" icon="undo" onClick={() => setOpen(false)} />
        <Button content="Yes" icon="trash" color="red" onClick={() => deleteSelectedTorrent()} />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteTorrentModal;
