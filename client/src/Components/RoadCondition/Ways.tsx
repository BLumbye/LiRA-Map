
import { FC, useEffect, useState } from 'react';
import { useZoom } from '../../context/ZoomContext';
import { MapConditions } from '../../models/path';
import { getWays } from '../../queries/conditions';
import RCHotline from './RCHotline';

interface IWays {
    onClick: (way_id: string, way_length: number) => () => void;
}

const Ways: FC<IWays> = ( { onClick } ) => {
    
    const { zoom } = useZoom();
    const [conditions, setConditions] = useState<MapConditions[]>([])

    useEffect( () => {
        fetchWays()
    }, [zoom] )

    const fetchWays = () => {
        const roadName = 'M3'
        const type = 'IRI';
        const z = Math.max(0, zoom - 12)
        
        getWays(roadName, type, z, (data: MapConditions[]) => {
            const { way_id, way_length, conditions } = data[1]
            console.log(conditions.length, data);
            setConditions( data )
            setTimeout( onClick(way_id, way_length), 100 )
        } )
    }
    return (
        <>
        {/* { conditions.map( ({way_id, way_length, nodes, conditions, properties}: MapConditions, i: number) => {
            return <RCHotline 
                key={`ml-path-${i}`}
                nodes={nodes}
                conditions={conditions}
                properties={properties}
                onClick={onClick(way_id, way_length)}
            />
        } ) }  */}
    
        {
            conditions.length > 0 
                ? <RCHotline 
                    way_ids={conditions.map(({way_id}) => way_id)}
                    way_lengths={conditions.map(({way_length}) => way_length)}
                    nodes={conditions.map(({nodes}) => nodes)}
                    conditions={conditions.map(({conditions}) => conditions)}
                    properties={conditions[0].properties}
                    onClick={onClick(conditions[0].way_id, conditions[0].way_length)}
                />
                : null
        }
        </>
    )
}

export default Ways;