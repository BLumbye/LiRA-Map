/** @author Benjamin Lumbye s204428, Usama Mir s134187 */

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Loading from '../Components/Loading';
import { RideMeta, TripsOptions } from '../models/models';
import { getRides } from '../queries/rides';

interface ContextProps {
  metas: RideMeta[];
  selectedMetas: RideMeta[];
  setSelectedMetas: Dispatch<SetStateAction<RideMeta[]>>;
  focusedMeta: number;
  setFocusedMeta: Dispatch<SetStateAction<number>>;
  defaultTripOptions: TripsOptions;
  tripOptions: TripsOptions;
  setTripOptions: Dispatch<SetStateAction<TripsOptions>>;
}

const MetasContext = createContext({} as ContextProps);

const defaultTripOptions: TripsOptions = {
  taskId: '',
  startDate: new Date('2020-01-01'),
  endDate: new Date(),
  reversed: false,
  minDistanceKm: undefined,
  maxDistanceKm: undefined,
  startCity: '',
  endCity: '',
  deviceId: [],
  nightMode: false,
};

export const MetasProvider = ({ children }: any) => {
  const [metas, setMetas] = useState<RideMeta[]>([]);
  const [selectedMetas, setSelectedMetas] = useState<RideMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedMeta, setFocusedMeta] = useState(-1); // -1 is none, 0 is all, other value is specific trip
  const [tripOptions, setTripOptions] = useState(defaultTripOptions);

  // fetch the metadata of all the rides
  useEffect(
    () =>
      getRides((data) => {
        setMetas(data);
        setLoading(false);
      }),
    [],
  );

  return (
    <MetasContext.Provider
      value={{
        metas,
        selectedMetas,
        setSelectedMetas,
        focusedMeta,
        setFocusedMeta,
        defaultTripOptions,
        tripOptions,
        setTripOptions,
      }}
    >
      {children}
      <Loading loading={loading} />
    </MetasContext.Provider>
  );
};

export const useMetasCtx = () => useContext(MetasContext);
