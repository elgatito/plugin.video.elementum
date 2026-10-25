import React, { FC, useEffect, useReducer } from 'react';
import { StrictTableHeaderCellProps, Table } from 'semantic-ui-react';
import { orderBy } from 'lodash-es';
import DeleteTorrentModal from '../delete-modal';
import UploadTorrentModal from '../upload-modal';
import TorrentListItem from './torrent';
import { ITorrent } from '../dataStructure';
import { t } from '../i18n';

interface ITorrentListProps {
  torrents: ITorrent[];
  activeTorrents: ITorrent[];
  onSetActiveTorrents: React.Dispatch<React.SetStateAction<ITorrent[]>>;
}

type LodashSortOrder = 'asc' | 'desc' | undefined;

interface State {
  column: keyof ITorrent | null;
  data: ITorrent[];
  order: LodashSortOrder;
}

type Action =
  | { type: 'CHANGE_SORT'; column: keyof ITorrent }
  | { type: 'UPDATE_TORRENTS'; torrents: ITorrent[]; onSetActiveTorrents: React.Dispatch<React.SetStateAction<ITorrent[]>> };

const initialState: State = {
  column: null,
  data: [],
  order: undefined,
};

function sortReducer(state: State, action: Action): State {
  const orderByColumn = (torrents: ITorrent[], column: string, order: NonNullable<LodashSortOrder>) =>
    orderBy(torrents, [column, 'added_time'], [order, 'asc']);

  switch (action.type) {
    case 'CHANGE_SORT': {
      let newDirection: LodashSortOrder;
      let { column } = action;

      if (state.column === action.column) {
        // Cycle sort order: ascending -> descending -> default (sort by the default field) -> ascending
        switch (state.order) {
          case 'asc':
            newDirection = 'desc';
            break;
          case 'desc':
            column = 'added_time';
            newDirection = 'asc';
            break;
          case undefined:
            newDirection = 'asc';
            break;
        }
      } else {
        newDirection = 'asc';
      }

      return {
        ...state,
        column,
        data: orderByColumn(state.data, column, newDirection),
        order: newDirection,
      };
    }
    case 'UPDATE_TORRENTS': {
      const { torrents, onSetActiveTorrents } = action;
      onSetActiveTorrents((activeTorrents) => activeTorrents.flatMap((at) => torrents.find((t) => t.id === at.id) ?? []));
      return {
        ...state,
        data: state.column && state.order ? orderByColumn(torrents, state.column, state.order) : torrents,
      };
    }
  }
}

const TorrentList: FC<ITorrentListProps> = ({ torrents, activeTorrents, onSetActiveTorrents }: ITorrentListProps) => {
  const [state, dispatch] = useReducer(sortReducer, initialState);
  const { column, data, order } = state;

  useEffect(() => {
    dispatch({ type: 'UPDATE_TORRENTS', torrents, onSetActiveTorrents });
  }, [torrents, onSetActiveTorrents]);

  const getSortOrder = (columnName: keyof ITorrent): StrictTableHeaderCellProps['sorted'] => {
    if (column !== columnName) return undefined;

    switch (order) {
      case 'asc':
        return 'ascending';
      case 'desc':
        return 'descending';
      case undefined:
        return undefined;
    }
  };

  const changeColumnSortOrder = (columnName: keyof ITorrent) => dispatch({ type: 'CHANGE_SORT', column: columnName });

  return (
    <>
      <Table compact="very" size="small" stackable fixed singleLine selectable sortable>
        <Table.Header className="mobile-hidden">
          <Table.Row>
            <Table.HeaderCell width="11" sorted={getSortOrder('name')} onClick={() => changeColumnSortOrder('name')}>
              {t('name')}
            </Table.HeaderCell>
            <Table.HeaderCell width="4" sorted={getSortOrder('size_bytes')} onClick={() => changeColumnSortOrder('size_bytes')}>
              {t('sizeStatus')}
            </Table.HeaderCell>
            <Table.HeaderCell width="5" sorted={getSortOrder('ratio')} onClick={() => changeColumnSortOrder('ratio')}>
              {t('ratios')}
            </Table.HeaderCell>
            <Table.HeaderCell width="5" sorted={getSortOrder('download_rate')} onClick={() => changeColumnSortOrder('download_rate')}>
              {t('rates')}
            </Table.HeaderCell>
            <Table.HeaderCell width="5" sorted={getSortOrder('seeders')} onClick={() => changeColumnSortOrder('seeders')}>
              {t('seedsPeers')}
            </Table.HeaderCell>
            <Table.HeaderCell width="3" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((t) => (
            <TorrentListItem
              key={t.id}
              torrent={t}
              onSetActiveTorrents={onSetActiveTorrents}
              isSelected={activeTorrents.some((at) => at.id === t.id)}
            />
          ))}
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan={11}>
              <UploadTorrentModal />
              <DeleteTorrentModal torrents={activeTorrents} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default TorrentList;
