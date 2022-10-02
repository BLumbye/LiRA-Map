import { FC, useState } from "react";
import { FiSettings} from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi'
import useMeasPopup from "./MeasPopup";
import Checkbox from "../Checkbox";
import MetaData from "./MetaData";

import { DEFAULT_COLOR } from "../../assets/properties";

import { useMeasurementsCtx } from "../../context/MeasurementsContext";
import { RideMeta } from "../../models/models";
import { Measurement, RideMeasurement } from "../../models/properties";
import { RendererName } from "../../models/renderers";
import { addMeasurement, editMeasurement, deleteMeasurement } from "../../queries/measurements";

import '../../css/ridedetails.css'


type Props = {
    metas: RideMeta[];
};

const RideDetails: FC<Props> = ( {metas } ) => {

	const { measurements, setMeasurements } = useMeasurementsCtx()
	const [ addChecked, setAddChecked ] = useState<boolean>(false)
	
	const popup = useMeasPopup()

	const openEditMeasurement = (e: any, i: number) => {
		e.preventDefault()
		e.stopPropagation()
		
		const m = measurements[i]

		popup.fire( 
			(newMeasurement: RideMeasurement) => {
				const temp = measurements
					.map( (m: RideMeasurement, j: number) => i === j ? newMeasurement : m )
				setMeasurements( temp )
				editMeasurement(newMeasurement, i)
			}, 
			{ name: m.name, tag: m.queryMeasurement, renderer: m.rendererName, color: m.color || DEFAULT_COLOR } 
		)
	}

	const openDeleteMeasurement = (e: any, i: number) => {
		e.preventDefault()

		const m = measurements[i]

		const temp = measurements

		const index = measurements.indexOf(m)


		if (index > -1) { // only splice array when item is found
			temp.splice(index, 1); // 2nd parameter means remove one item only
		}

		setMeasurements(temp)

	}

	const getMeasurementsContent = (m: Measurement, i: number): JSX.Element => {
		return <div className="checkbox-container">
			<div className="checkbox-title">{m.name} <p className="checkbox-subtitle">- {m.rendererName}</p></div>
			<FiSettings className="edit-meas-btn btn" onClick={(e) => openEditMeasurement(e, i)} strokeWidth={1}/>
			<FiTrash2 className="delete-meas-btn btn" onClick={(e) => openDeleteMeasurement(e,i)} strokeWidth={1}/>
		</div>
	}

	const showAddMeasurement = () => {
		setAddChecked(true) 
		popup.fire( 
			(newMeasurement: RideMeasurement ) => {
				setAddChecked(false) 
				// update the state in RideDetails
				setMeasurements( prev => [...prev, newMeasurement])
				// and add the measurement to the measurements.json file
				addMeasurement(newMeasurement);
			},
			{ name: '', tag: '', renderer: RendererName.circles, color: '#bb55dd' } 
		)
	}

    const measurementClicked = (measIndex: number, isChecked: boolean) => {        
        const temp = [...measurements]
        temp[measIndex].isActive = isChecked
        setMeasurements(temp)
    }

    return (
		<div className="meta-data">
			{
				measurements.map( (m: Measurement, i: number) =>
					<Checkbox 
						key={`ride-md-checkbox-${i}`}
						className='ride-metadata-checkbox'
						html={getMeasurementsContent(m, i)}
						onClick={(isChecked) => measurementClicked(i, isChecked)} />
				)
			}

			<Checkbox 
				className='ride-metadata-checkbox md-checkbox-add'
				html={<div>+</div>}
				forceState={addChecked}
				onClick={showAddMeasurement} />
			
			
			{ metas.map( (meta: RideMeta, i: number) =>
				<MetaData md={meta} key={`ride-md-${meta.TaskId}-${i}`}></MetaData>
			) }
        </div>
  )
}

export default RideDetails;