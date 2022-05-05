import L from 'leaflet'
import { useEffect } from 'react';

import { opacity, weight, width } from '../../../assets/properties';
import { useGraph } from '../../../context/GraphContext';
import { PointData } from '../../../models/path';
import { Renderer } from '../../../models/renderers';
import useCanvas from '../Hooks/useCanvas';

const getColor = (val: any, defaultColor: string | undefined, i: number): string => {
    if ( val < 0 )
        return defaultColor || 'orange';

    const red: number = Math.min(val * 2, 1) * 255;
    const green: number = (val < 0.5 ? val +  0.5 : 2 - val * 2) * 255;                 
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
    // return `rgb(${i * 255}, 0, 0)`
}


const Hotpoints: Renderer = ( { path, properties, onClick } ) => { 

    const [map, canvas] = useCanvas();
    const { minY, maxY } = useGraph()

    useEffect(() => {
        path.forEach( (p: PointData, i: number) => {
            const mappedValue: number = ((p.value || -9999) - (minY || 0)) / ((maxY || 1) - (minY || 0))
            return L.circle( [p.lat, p.lng], { 
                renderer: canvas, 
                radius: width(p.properties, properties),
                color: getColor(mappedValue, properties.color, i / path.length),
                weight: weight(p.properties, properties),
                opacity: opacity(p.properties, properties)
            } ).on("click", onClick(i)).addTo(map);
        } )
    }, [])

    return <></>;
}

export default Hotpoints