import React, { FC, useState } from 'react';
import DatePicker from 'react-date-picker';
import { TripsOptions, SearchOptions } from '../../models/models';
import Checkbox from '../Checkbox';

const defaultOptions: TripsOptions = {
  search: '',
  startDate: new Date('2020-01-01'),
  endDate: new Date(),
  reversed: false,
  distanceKm: 0,
};

const deafaultSearchOptions: SearchOptions = {
  search: '',
  distanceKm: 0,
};

let choice: keyof TripsOptions = 'search';
interface IOptionsSelector {
  onChange: (options: TripsOptions, key: keyof TripsOptions) => void;
}

const OptionsSelector: FC<IOptionsSelector> = ({ onChange }) => {
  const [options, setOptions] = useState<TripsOptions>(defaultOptions);

  const _onChange = (key: keyof TripsOptions, choice: keyof TripsOptions) => {
    return function <T>(value: T) {
      const temp = { ...options } as any;
      temp[key] = value;
      console.log(key);
      setOptions(temp);
      onChange(temp, choice);
    };
  };

  return (
    <div className="rides-options">
      <select
        onChange={(o) => {
          choice = o.target.value as keyof TripsOptions;
          console.log(choice);
        }}
      >
        {Object.keys(deafaultSearchOptions).map((key, _) => {
          return (
            <option value={key} key={key}>
              {key}
            </option>
          );
        })}
      </select>
      <input
        className="ride-search-input"
        placeholder="Search.."
        value={options.search}
        onChange={(e) => _onChange('search', choice)(e.target.value)}
      />

      <DatePicker
        onChange={_onChange('startDate', choice)}
        value={options.startDate}
        className="options-date-picker"
      />
      <DatePicker
        onChange={_onChange('endDate', choice)}
        value={options.endDate}
        className="options-date-picker"
      />

      <Checkbox
        className="ride-sort-cb"
        html={<div>Sort {options.reversed ? '▼' : '▲'}</div>}
        onClick={_onChange('reversed', choice)}
      />
    </div>
  );
};

export default OptionsSelector;
