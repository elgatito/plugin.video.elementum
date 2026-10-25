import React, { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { KodiProvider } from './kodi';
import HeaderMenu from './menu';
import SearchBar from './search-bar';
import TorrentList from './torrents-list';
import TorrentInfo from './torrent-info';
import { ITorrent, StatusCode } from './dataStructure';
import 'semantic-ui-css/semantic.min.css';
import './style.css';
import { getRefreshRate } from './Services/settings';

function App(): JSX.Element {
  const [torrents, setTorrents] = useState<ITorrent[]>([]);
  const [activeTorrents, setActiveTorrents] = useState<ITorrent[]>([]);

  useEffect(() => {
    const getList = async () => {
      const response = await fetch('/torrents/list');
      const fetchedTorrents = (await response.json()) as ITorrent[];
      setTorrents((t) => (isEqual(t, fetchedTorrents) ? t : fetchedTorrents));
    };

    void getList();
    const intervalHandle = setInterval(() => void getList(), getRefreshRate());
    return () => clearInterval(intervalHandle);
  }, []);

  return (
    <KodiProvider>
      <HeaderMenu />
      <div className="app">
        <SearchBar
          totalDownloadRate={torrents.reduce((rate, item) => rate + item.download_rate, 0)}
          totalUploadRate={torrents.reduce((rate, item) => rate + item.upload_rate, 0)}
          active={torrents.filter((t) => t.status_code !== StatusCode.StatusFinished).length}
          finished={torrents.filter((t) => t.status_code === StatusCode.StatusFinished).length}
          total={torrents.length}
        />
        <TorrentList torrents={torrents} onSetActiveTorrents={setActiveTorrents} activeTorrents={activeTorrents} />
        {activeTorrents.length > 0 && <TorrentInfo torrent={activeTorrents[activeTorrents.length - 1]} />}
      </div>
    </KodiProvider>
  );
}

export default App;
