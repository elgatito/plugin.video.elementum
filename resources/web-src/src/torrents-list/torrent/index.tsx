import React from 'react';
import isEqual from 'react-fast-compare';
import {
  Button,
  ButtonProps,
  Icon,
  Label,
  Progress,
  Statistic,
  StatisticGroup,
  StatisticLabel,
  StatisticValue,
  Table,
} from 'semantic-ui-react';
import { ITorrent, StatusCode } from '../../dataStructure';
import { t } from '../../i18n';

interface ITorrentListItemProps {
  torrent: ITorrent;
  isSelected: boolean;
  onSetActiveTorrents: React.Dispatch<React.SetStateAction<ITorrent[]>>;
}

const TorrentListItem = ({ torrent, isSelected, onSetActiveTorrents }: ITorrentListItemProps): JSX.Element => {
  const isActive = torrent.status_code !== StatusCode.StatusFinished && torrent.status_code !== StatusCode.StatusPaused;

  const onResumePause = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
    event.stopPropagation();
    const { active } = data;
    const action = active ? 'pause' : 'resume';

    await fetch(`/torrents/${action}/${torrent.id}`);
  };

  const onPlay = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, _data: ButtonProps) => {
    event.stopPropagation();
    await fetch(`/playuri?resume=${torrent.id}`);
  };

  /**
   * Select a torrent from the torrent list.
   * By default it sets active torrents to the last clicked torrent element,
   * but it also supports multiselect using Ctrl-key. In this case normal rules apply:
   * if a torrent wasn't previously selected - add it to the list of selected torrents,
   * otherwise - remove it from the list.
   */
  const onClick = (event: React.MouseEvent) => {
    if (!event.ctrlKey) {
      onSetActiveTorrents(isSelected ? [] : [torrent]);
    } else {
      onSetActiveTorrents((activeTorrents) => {
        const activeTorrentIndex = activeTorrents.findIndex((t) => t.id === torrent.id);
        if (activeTorrentIndex === -1) {
          return [...activeTorrents, torrent];
        }
        return activeTorrents.filter((_, i) => i !== activeTorrentIndex);
      });
    }
  };

  return (
    <>
      <Table.Row onClick={onClick} active={isSelected}>
        <Table.Cell>
          <span title={torrent.name}>{torrent.name}</span>
          <Progress percent={torrent.progress} title={`${torrent.progress.toFixed(2)}%`} autoSuccess indicating={isActive} size="tiny" />
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Label color={isActive ? 'green' : undefined}>
            {torrent.size}
            <Label.Detail>{torrent.status}</Label.Detail>
          </Label>
        </Table.Cell>
        <Table.Cell>
          <StatisticGroup size="mini" widths="2">
            <Statistic value={torrent.ratio.toFixed(2)} label={t('seedRatio')} />
            <Statistic value={`${torrent.time_ratio.toFixed(2)}`} label={t('timeRatio')} />
          </StatisticGroup>
        </Table.Cell>
        <Table.Cell>
          <StatisticGroup widths="2" size="mini">
            <Statistic>
              <StatisticValue>
                <Icon name="arrow down" size="small" />
                {` ${torrent.download_rate.toFixed(2)}`}
              </StatisticValue>
              <StatisticLabel>kB/s</StatisticLabel>
            </Statistic>
            <Statistic>
              <StatisticValue>
                <Icon name="arrow up" size="small" />
                {` ${torrent.upload_rate.toFixed(2)}`}
              </StatisticValue>
              <StatisticLabel>kB/s</StatisticLabel>
            </Statistic>
          </StatisticGroup>
        </Table.Cell>
        <Table.Cell>
          <StatisticGroup widths="2" size="mini">
            <Statistic value={`${torrent.seeders} / ${torrent.seeders_total}`} label={t('activeTotal')} />
            <Statistic value={`${torrent.peers} / ${torrent.peers_total}`} label={t('activeTotal')} />
          </StatisticGroup>
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Button.Group basic fluid size="tiny">
            <Button icon={isActive ? 'pause' : 'download'} toggle active={isActive} onClick={onResumePause} />
            <Button icon="play" onClick={onPlay} title={t('playInKodi')} />
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default React.memo(TorrentListItem, isEqual);
