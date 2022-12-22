import React, { FC, useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { TripsOptions } from '../../models/models';
import { DeviceProperties } from '../../models/properties';
import { getDevices } from '../../queries/devices';
import Checkbox from '../Checkbox';
import { useMetasCtx } from '../../context/MetasContext';

/** @author Benjamin Lumbye s204428, Mads Møller s184443, Martin Nielsen s174971 */
const OptionsSelector: FC = () => {
  const { tripOptions, setTripOptions } = useMetasCtx();
  const [availableDevices, setDevice] = useState<DeviceProperties[]>();

  useEffect(() => {
    getDevices((data: DeviceProperties[]) => {
      setDevice(data);
    });
  }, []);

  /** @author Mads Møller s184443, Martin Nielsen s174971 */
  const deviceOptions = availableDevices?.map((device) => ({
    value: device.DeviceId.toString(),
    label: device.DeviceId.toString(),
  }));

  const onChange = (key: keyof TripsOptions) => {
    return function <T>(value: T) {
      const temp = { ...tripOptions } as any;
      temp[key] = value;
      setTripOptions(temp);
    };
  };

  return (
    <div className="rides-options">
      <Checkbox
        className="ride-sort-cb"
        html={<div>Night mode {tripOptions.nightMode ? 'On' : 'Off'}</div>}
        onClick={onChange('nightMode')}
        tooltip="Turn on to only show trips that took place between 20:00 and 06:00."
      />
      <label>
        <span>TaskID</span>
        <input
          className="ride-search-input"
          placeholder="TaskID"
          value={tripOptions.taskId}
          onChange={(e) => onChange('taskId')(e.target.value)}
        />
      </label>
      <label>
        <span>Min Distance Km</span>
        <input
          className="ride-search-input"
          placeholder="Min Distance Km"
          value={tripOptions.minDistanceKm}
          onChange={(e) => onChange('minDistanceKm')(e.target.value)}
        />
      </label>
      <label>
        <span>Max Distance Km</span>
        <input
          className="ride-search-input"
          placeholder="Max Distance Km"
          value={tripOptions.maxDistanceKm}
          onChange={(e) => onChange('maxDistanceKm')(e.target.value)}
        />
      </label>
      <label>
        <span>Start City</span>
        <input
          className="ride-search-input"
          placeholder="Start City"
          value={tripOptions.startCity}
          onChange={(e) => onChange('startCity')(e.target.value)}
        />
      </label>
      <label>
        <span>Destination City</span>
        <input
          className="ride-search-input"
          placeholder="Destination City"
          value={tripOptions.endCity}
          onChange={(e) => onChange('endCity')(e.target.value)}
        />
      </label>
      <label>
        <span>Devices</span>
        <Select
          className="react-select-combobox-filter"
          placeholder="Devices.."
          isMulti
          onChange={onChange('deviceId')}
          options={deviceOptions}
        />
      </label>
      <label>
        <span>From</span>
        <DatePicker
          onChange={onChange('startDate')}
          value={tripOptions.startDate}
          className="options-date-picker"
          format="dd/MM/y"
        />
      </label>
      <label>
        <span>To</span>
        <DatePicker
          onChange={onChange('endDate')}
          value={tripOptions.endDate}
          className="options-date-picker"
          format="dd/MM/y"
        />
      </label>
      <Checkbox
        className="ride-sort-cb"
        html={<div>Sort {tripOptions.reversed ? '▼' : '▲'}</div>}
        onClick={onChange('reversed')}
      />
    </div>
  );
};

export default OptionsSelector;
