import React, { FC } from "react";
import { FiSettings } from "react-icons/fi";
import { Measurement } from "../../models/properties";
import Checkbox from "../Checkbox";


interface ICheckboxHTML {
    meas: MeasP roperties;
    editMeasurement: (e: React.MouseEvent) => void;
}

const CheckboxHTML: FC<ICheckboxHTML> = ( { meas, editMeasurement } ) => {
    const { name, rendererName } = meas;

    return (
        <div className="checkbox-container">
            <div className="checkbox-text">
                <div className="checkbox-title">{name}</div>
                <p className="checkbox-subtitle">- {rendererName}</p>
            </div>
            <FiSettings className="edit-meas-btn btn" onClick={editMeasurement} strokeWidth={1}/>
        </div>
    )
}
    
interface IMeasCheckbox {
    meas: Measurement;
    editMeasurement: (e: React.MouseEvent) => void;
    selectMeasurement: (isChecked: boolean) => void; 
}

const MeasCheckbox: FC<IMeasCheckbox> = ( { meas, editMeasurement, selectMeasurement } ) => {
    return (
        <Checkbox 
            className='ride-metadata-checkbox'
            html={<CheckboxHTML meas={meas} editMeasurement={editMeasurement} />}
            onClick={selectMeasurement} />
    )
}

export default MeasCheckbox;