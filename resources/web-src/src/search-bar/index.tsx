import React, { FC, useReducer, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Grid,
  Icon,
  Item,
  ItemGroup,
  Modal,
  Search,
  SearchResultProps,
  Statistic,
} from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';
import { t } from '../i18n';
import { KodiLabel, ProviderIcon, ProviderTag } from '../kodi-label';

const debounceWaitTime = 500;

type TorrentType = 'Movies' | 'TvShows' | 'General';
// Function, so labels are translated at render time, in the current language
const torrentTypes = (): DropdownItemProps[] => [
  {
    text: t('movies'),
    value: 'Movies',
    icon: 'film',
  },
  {
    text: t('tvShows'),
    value: 'TvShows',
    icon: 'tv',
  },
  {
    text: t('general'),
    value: 'General',
    icon: 'magnet',
  },
];

type Action =
  | { type: 'CleanQuery' }
  | { type: 'StartSearch'; query: string }
  | { type: 'OpenItem' }
  | { type: 'UpdateQuery'; query: string }
  | { type: 'FinishSearch'; results: ResultView[] }
  | { type: 'UpdateSelection'; selection: string };

type MediaType = 'movie' | 'tvshow' | 'season' | 'episode';
interface Info {
  plotoutline: string;
  tagline: string;
  code: string;
  year: number;
  rating: number;
  genre: string[];
  date: Date;
  mediatype: MediaType;
}

interface Art {
  thumb: string;
}

interface Result {
  label: string;
  // Torrent provider, like "[COLOR FFFFDE00]RuTor[/COLOR]"
  label2?: string;
  // Torrent provider icon URL
  icon?: string;
  info: Info;
  art: Art;
  path: string;
  is_playable: boolean;
}

interface ResultView {
  title: string;
  tagline: string;
  description: string;
  year: number;
  rating: number;
  genre: string[];
  date: Date;
  image: string;
  path: string;
  mediatype: MediaType;
  key: string;
  isTorrent: boolean;
  source?: string;
  icon?: string;
}

interface State {
  loading: boolean;
  results: ResultView[];
  value: string;
  searched: boolean;
}

const initialState: State = {
  loading: false,
  results: [],
  value: '',
  searched: false,
};

function queryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CleanQuery':
      return initialState;
    case 'StartSearch':
      return { ...state, loading: true, value: action.query };
    case 'OpenItem':
      // Previous level results are not related anymore, keep only searching message
      return { ...state, loading: true, results: [], searched: false };
    case 'UpdateQuery':
      return { ...state, value: action.query, results: [], searched: false };
    case 'FinishSearch':
      return { ...state, loading: false, results: action.results, searched: true };
    case 'UpdateSelection':
      return { ...state, value: action.selection };
  }
}

const resultRenderer = (item: SearchResultProps) => {
  const result = item as ResultView;
  if (result.isTorrent) {
    return (
      <ItemGroup>
        <Item className="torrent">
          <ProviderIcon icon={result.icon} />
          <Item.Content>
            <Item.Header>
              <KodiLabel text={result.title} />
            </Item.Header>
            <Item.Meta>
              <ProviderTag text={result.source} /> <KodiLabel text={result.tagline} />
            </Item.Meta>
          </Item.Content>
        </Item>
      </ItemGroup>
    );
  }

  return (
    <ItemGroup>
      <Item>
        {result.image && <Item.Image size="small" src={result.image} />}
        <Item.Content>
          <Item.Header>
            <KodiLabel text={result.title} />
          </Item.Header>
          <Item.Meta>
            <KodiLabel text={result.tagline} />
          </Item.Meta>
          <Item.Description>{result.description}</Item.Description>
          {result.mediatype !== 'season' && result.genre && (
            <Item.Extra>{`${result.rating} - ${result.genre?.join(', ')} - ${result.date?.toString() ?? result.year ?? '-'}`}</Item.Extra>
          )}
        </Item.Content>
      </Item>
    </ItemGroup>
  );
};

function getSearchType(torrentType: TorrentType): string {
  switch (torrentType) {
    case 'Movies':
      return 'movies';
    case 'TvShows':
      return 'shows';
    case 'General':
      return '.';
  }
}

// Torrent links lead to playback or download, not to the next level of items
const isTorrentPath = (path: string) => /^plugin:\/\/plugin\.video\.elementum\/(play|download)\?/.test(path);

async function querySearchResults(url: string, dispatch: React.Dispatch<Action>): Promise<number> {
  const response = await fetch(url);
  // Empty response means the item was handed to Kodi (e.g. playback started)
  const items = ((await response.json().catch(() => ({}))).items ?? []) as Result[];

  dispatch({
    type: 'FinishSearch',
    results: items
      .filter((i) => i.info !== undefined)
      .map((i) => ({
        image: i.art?.thumb,
        key: `${i.info.code}-${i.label}`,
        description: i.info.plotoutline,
        title: i.label,
        tagline: i.info.tagline,
        year: i.info.year,
        date: i.info.date,
        genre: i.info.genre,
        rating: i.info.rating,
        mediatype: i.info.mediatype,
        path: i.path,
        isTorrent: isTorrentPath(i.path),
        source: i.label2,
        icon: i.icon,
      })),
  });
  return items.length;
}

interface IStatisticsProps {
  /**
   * Total download rate in kB/s
   */
  totalDownloadRate: number;

  /**
   * Total upload rate in kB/s
   */
  totalUploadRate: number;

  /**
   * Active torrents
   */
  active: number;

  /**
   * Finished torrents
   */
  finished: number;

  /**
   * Total torrents
   */
  total: number;
}

const Statistics: FC<IStatisticsProps> = ({ totalDownloadRate, totalUploadRate, active, finished, total }: IStatisticsProps) => {
  const [torrentType, setTorrentType] = useState<TorrentType>('Movies');
  const searcRef = useRef<any>();
  const [state, dispatch] = useReducer(queryReducer, initialState);
  const { loading, results, value, searched } = state;
  const [torrent, setTorrent] = useState<ResultView>();

  const debounceSearchChange = useDebouncedCallback(async (query: string) => {
    const searchType = getSearchType(torrentType);

    await querySearchResults(`/${searchType}/search?q=${encodeURIComponent(query)}`, dispatch);
  }, debounceWaitTime);

  // General search runs all providers, so it is started explicitly with Enter or search icon, not on each keypress
  const runGeneralSearch = async () => {
    if (value.trim().length === 0) return;

    dispatch({
      type: 'StartSearch',
      query: value,
    });
    if ((await querySearchResults(`/search?q=${encodeURIComponent(value)}`, dispatch)) > 0) {
      searcRef.current.open();
    }
  };

  const handleQueryChange = async (query: string) => {
    if (query.trim().length === 0) {
      dispatch({
        type: 'CleanQuery',
      });
      return;
    }

    if (torrentType === 'General') {
      dispatch({
        type: 'UpdateQuery',
        query,
      });
      return;
    }

    dispatch({
      type: 'StartSearch',
      query,
    });

    await debounceSearchChange(query);
  };

  const handleResultSelect = async (data: ResultView): Promise<void> => {
    const path = data.path.replace('plugin://plugin.video.elementum/', '');
    const url = `/${path}${path.includes('?') ? '&' : '?'}external=1`;

    // Torrent link, let user choose what to do with it
    if (data.isTorrent) {
      setTorrent(data);
      return;
    }

    // Daemon returns either next level items (seasons, episodes, torrent links) or starts playback in Kodi
    dispatch({ type: 'OpenItem' });
    // Search closes results after selection, keep them open with searching message, as providers can take a while
    window.setTimeout(() => {
      searcRef.current?.open();
    });
    if ((await querySearchResults(url, dispatch)) === 0) {
      searcRef.current?.close();
    }
  };

  const handleTorrentAction = async (download: boolean): Promise<void> => {
    if (!torrent) return;
    const path = torrent.path.replace('plugin://plugin.video.elementum/', '');
    setTorrent(undefined);

    if (download) {
      const uri = new URLSearchParams(path.split('?')[1]).get('uri') ?? '';
      await fetch(`/torrents/add?uri=${encodeURIComponent(uri)}`);
    } else {
      await fetch(`/${path.replace(/^download\?/, 'play?')}&external=1`);
    }
  };

  const handleTorrentTypeChange = (torrentTypeValue: TorrentType) => {
    setTorrentType(torrentTypeValue);
    dispatch({
      type: 'CleanQuery',
    });
  };

  return (
    <>
      <Grid stackable columns="3">
        <Grid.Row verticalAlign="middle">
          <Grid.Column floated="left">
            <Search
              fluid
              placeholder={t('search')}
              noResultsMessage={loading ? t('searching') : t('noResults')}
              loading={loading}
              results={results}
              value={value}
              onSearchChange={(_, data) => handleQueryChange(data.value ?? '')}
              resultRenderer={resultRenderer}
              onResultSelect={(_, data) => handleResultSelect(data.result)}
              ref={searcRef}
              minCharacters={3}
              showNoResults={loading || torrentType !== 'General' || searched}
              input={{
                icon: torrentType === 'General' ? { name: 'search', link: true, onClick: runGeneralSearch } : 'search',
                // With results shown Enter belongs to Search component for selecting a highlighted result
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' && torrentType === 'General' && results.length === 0) void runGeneralSearch();
                },
                action: (
                  <Dropdown
                    fluid
                    selection
                    options={torrentTypes()}
                    defaultValue={torrentType}
                    onChange={(_, data) => handleTorrentTypeChange(data.value as TorrentType)}
                  />
                ),
              }}
            />
          </Grid.Column>
          <Grid.Column width="4">
            <Statistic.Group widths="3" size="tiny">
              <Statistic>
                <Statistic.Value>{active}</Statistic.Value>
                <Statistic.Label>{t('active')}</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{finished}</Statistic.Value>
                <Statistic.Label>{t('finished')}</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{total}</Statistic.Value>
                <Statistic.Label>{t('total')}</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
          <Grid.Column floated="right">
            <Statistic.Group widths="2" size="tiny">
              <Statistic>
                <Statistic.Value>
                  <Icon name="arrow down" size="small" />
                  {` ${totalDownloadRate.toFixed(1)} kB/s`}
                </Statistic.Value>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  <Icon name="arrow up" size="small" />
                  {` ${totalUploadRate.toFixed(1)} kB/s`}
                </Statistic.Value>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal size="small" open={torrent !== undefined} onClose={() => setTorrent(undefined)}>
        <Modal.Header>
          <KodiLabel text={torrent?.title} />
        </Modal.Header>
        <Modal.Content>
          <ProviderIcon icon={torrent?.icon} /> <ProviderTag text={torrent?.source} /> <KodiLabel text={torrent?.tagline} />
        </Modal.Content>
        <Modal.Actions>
          <Button content={t('cancel')} color="red" onClick={() => setTorrent(undefined)} />
          <Button
            content={t('download')}
            labelPosition="left"
            icon="download"
            color="blue"
            onClick={() => void handleTorrentAction(true)}
          />
          <Button
            content={t('playInKodi')}
            labelPosition="left"
            icon="play"
            color="green"
            onClick={() => void handleTorrentAction(false)}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Statistics;
