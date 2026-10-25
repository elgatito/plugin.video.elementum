import prettyBytes from 'pretty-bytes';
import React, { useEffect, useState } from 'react';
import { Grid, GridColumn, GridRow, List, Tab } from 'semantic-ui-react';
import { ITorrent } from '../dataStructure';
import { getRefreshRate } from '../Services/settings';
import { t } from '../i18n';
import PieceMap from './piece-map';

interface ITorrentInfoItemProps {
  torrent: ITorrent;
}

interface Tree {
  [key: string]: Tree;
}

const getFileTree = (files: string[][]): Tree => {
  const tree: Tree = {};

  files.forEach((f) => {
    let parentNode = tree;

    for (let i = 0; i < f.length; i += 1) {
      const pathChunk = f[i];

      if (!(pathChunk in parentNode)) {
        parentNode[pathChunk] = {};
      }

      parentNode = parentNode[pathChunk];
    }
  });

  return tree;
};

const renderFileTree = (files: string[][]): JSX.Element => {
  const renderTree = (tree: Tree): JSX.Element[] =>
    Object.keys(tree).map((k) => {
      const isFolder = Object.keys(tree[k]).length > 0;

      return (
        <List.List key={k}>
          <List.Item>
            <List.Icon name={isFolder ? 'folder' : 'file'} />
            <List.Content>
              {isFolder ? <List.Header>{k}</List.Header> : <List.Description>{k}</List.Description>}
              {renderTree(tree[k])}
            </List.Content>
          </List.Item>
        </List.List>
      );
    });

  const fileTree = getFileTree(files);
  return (
    <List>
      <List.Item>
        <List.Content>{renderTree(fileTree)}</List.Content>
      </List.Item>
    </List>
  );
};

const TorrentInfo = ({ torrent }: ITorrentInfoItemProps): JSX.Element => {
  const [filesList, setFilesList] = useState<string[]>([]);
  const [piecesList, setPiecesList] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const getInfo = async () => {
      const regexp = new RegExp('Files.+?:\\s+(?<files>.+?)\\n\\n.+?Pieces:\\s+(?<pieces>.+?)\\n\\n', 'gs');
      const response = await fetch(`/info?torrentid=${torrent.id}&pieces=true&trackers=false`);
      const info = await response.text();
      const match = regexp.exec(info);
      if (!match || !match.groups) return;

      const { files, pieces } = match.groups;
      setFilesList(files.split('\n').map((f) => f.trim()));
      setPiecesList(
        pieces
          .split('\n')
          .map((p) => p.trim())
          .join(''),
      );

      setLoading(false);
    };

    void getInfo();
    const intervalHandle = setInterval(() => void getInfo(), getRefreshRate());
    return () => clearInterval(intervalHandle);
  }, [torrent.id]);

  const panes = [
    {
      menuItem: { key: 'general', content: t('general') },
      render: () => (
        <Tab.Pane>
          <Grid>
            <GridRow>
              <GridColumn>
                <div>
                  <b>{t('name')}:</b> {torrent.name}
                </div>
                <div>
                  <b>{t('size')}:</b> {torrent.size}
                </div>
                <div>
                  <b>{t('completed')}:</b> {torrent.progress.toFixed(2)}%
                </div>
                <div>
                  <b>{t('seedTime')}:</b> {torrent.seeding_time}
                </div>
                <div>
                  <b>{t('seedTimeLimit')}:</b> {torrent.seed_time_limit}s
                </div>
                <div>
                  <b>{t('totalDownload')}:</b> {prettyBytes(torrent.total_download)}
                </div>
                <div>
                  <b>{t('totalUpload')}:</b> {prettyBytes(torrent.total_upload)}
                </div>
              </GridColumn>
            </GridRow>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'files', content: t('files') },
      render: () => (
        <Tab.Pane loading={loading}>
          <Grid>
            <GridRow>
              <GridColumn>{renderFileTree(filesList.map((f) => f.split('/')))}</GridColumn>
            </GridRow>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'pieces', content: t('pieces') },
      render: () => (
        <Tab.Pane loading={loading}>
          <PieceMap pieces={piecesList} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Tab panes={panes} />
    </>
  );
};

export default TorrentInfo;
