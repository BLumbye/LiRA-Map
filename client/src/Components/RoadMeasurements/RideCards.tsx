import React, { FC, ReactNode, useMemo } from 'react';
import { AutoSizer, List, ListRowRenderer } from 'react-virtualized';
import Checkbox from '../Checkbox';

import { RideMeta } from '../../models/models';

import '../../css/ridecard.css';
import { useMetasCtx } from '../../context/MetasContext';
import { useMeasurementsCtx } from '../../context/MeasurementsContext';

/** @author Benjamin Lumbye s204428, Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */

interface CardsProps {
  showMetas: SelectMeta[];
  onClick: (meta: SelectMeta, i: number, isChecked: boolean) => void;
}

const Cards: FC<CardsProps> = ({ showMetas, onClick }) => {
  const { setFocusedMeta } = useMetasCtx();
  const { selectedMeasurements } = useMeasurementsCtx();

  /** @author Benjamin Lumbye s204428 */
  const onFocusClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    meta: SelectMeta,
  ) => {
    setFocusedMeta(meta.TaskId);
    e.preventDefault();
    e.stopPropagation();
  };

  const renderRow: ListRowRenderer = ({ index, key, style }): ReactNode => {
    const meta = showMetas[index];
    return (
      <div key={key} style={style}>
        <Checkbox
          forceState={meta.selected}
          className="ride-card-container"
          html={
            <div>
              {/** @author Mads Westermann s174508 */}
              {meta.selected && selectedMeasurements.length > 0 ? (
                <button
                  className="focus-trip-button"
                  onClick={(e) => onFocusClick(e, meta)}
                  title="Find trip on map"
                >
                  📍
                </button>
              ) : null}
              <b>{meta.TaskId}</b>
              <br></br>
              {new Date(meta.StartTimeUtc).toLocaleDateString()}
            </div>
          }
          onClick={(isChecked) => {
            onClick(meta, index, isChecked);
          }}
        />
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          width={width}
          height={height}
          rowHeight={61}
          rowRenderer={renderRow}
          rowCount={showMetas.length}
          className="ride-list"
        />
      )}
    </AutoSizer>
  );
};

interface SelectMeta extends RideMeta {
  selected: boolean;
}

const RideCards: FC = () => {
  const { metas, selectedMetas, setSelectedMetas, tripOptions } = useMetasCtx();

  const onClick = (md: SelectMeta, i: number, isChecked: boolean) => {
    return isChecked
      ? setSelectedMetas((prev) => [...prev, md])
      : setSelectedMetas((prev) =>
          prev.filter(({ TripId }) => md.TripId !== TripId),
        );
  };

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const taskIDFilter = (meta: RideMeta) =>
    tripOptions.taskId.length === 0 ||
    meta.TaskId.toString().includes(tripOptions.taskId);

  const nightModeFilter = (meta: RideMeta) => {
    const startTime = new Date(meta.StartTimeUtc).getHours();
    const endTime = new Date(meta.EndTimeUtc).getHours();
    return (
      !tripOptions.nightMode ||
      ((startTime >= 20 || startTime <= 6) && (endTime >= 20 || endTime <= 6))
    );
  };

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const minDistanceFilter = (meta: RideMeta) =>
    !tripOptions.minDistanceKm ||
    isNaN(tripOptions.minDistanceKm) ||
    meta.DistanceKm >= tripOptions.minDistanceKm;

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const maxDistanceFilter = (meta: RideMeta) =>
    !tripOptions.maxDistanceKm ||
    isNaN(tripOptions.maxDistanceKm) ||
    meta.DistanceKm <= tripOptions.maxDistanceKm;

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const startCityFilter = (meta: RideMeta) =>
    tripOptions.startCity.length === 0 ||
    (JSON.parse(meta.StartPositionDisplay).city !== null &&
      (JSON.parse(meta.StartPositionDisplay).city || '')
        .toLowerCase()
        .includes(tripOptions.startCity.toLowerCase()));

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const endCityFilter = (meta: RideMeta) =>
    tripOptions.endCity.length === 0 ||
    (JSON.parse(meta.EndPositionDisplay).city !== null &&
      (JSON.parse(meta.EndPositionDisplay).city || '')
        .toLowerCase()
        .includes(tripOptions.endCity.toLowerCase()));

  /** @author Martin Nielsen s174971, Usama Mir s134187 */
  const dateFilter = (meta: RideMeta) => {
    let startTime;
    let endTime;
    const date = new Date(meta.StartTimeUtc).getTime();
    tripOptions.startDate == null
      ? (startTime = 0)
      : (startTime = tripOptions.startDate.getTime());
    tripOptions.endDate == null
      ? (endTime = 0)
      : (endTime = tripOptions.endDate.getTime());
    return date >= startTime && date <= endTime;
  };

  /** @author Mads Møller s184443, Martin Nielsen s174971, Usama Mir s134187 */
  const deviceIdList = tripOptions.deviceId.map((obj: any) => obj.label);
  const deviceIdFilter = (meta: RideMeta) =>
    tripOptions.deviceId.length === 0 ||
    deviceIdList.includes(meta.FK_Device.toString());

  const filteredMetas = useMemo<SelectMeta[]>(() => {
    const filtered = metas
      .filter(
        (meta) =>
          taskIDFilter(meta) &&
          nightModeFilter(meta) &&
          minDistanceFilter(meta) &&
          maxDistanceFilter(meta) &&
          dateFilter(meta) &&
          startCityFilter(meta) &&
          endCityFilter(meta) &&
          deviceIdFilter(meta),
      )
      .map((meta: RideMeta) => {
        const selected = selectedMetas.some(
          ({ TripId }) => meta.TripId === TripId,
        );
        return { ...meta, selected };
      });
    return tripOptions.reversed ? filtered.reverse() : filtered;
  }, [metas, tripOptions, selectedMetas]);
  filteredMetas.sort((a, b) => (a.selected >= b.selected ? -1 : 1));

  return <Cards showMetas={filteredMetas} onClick={onClick} />;
};

export default RideCards;
