
import { FC, useEffect, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Palette } from '../../models/graph';
import { HotlineOptions, HotlinePalette, Node, WayConditions } from '../../models/path';
import { useGraph } from '../../context/GraphContext';
import { palette, width } from '../../assets/properties';
import LeafletDistHotline from '../../assets/hotline/LeafletDistHotline';
import ArrowHead from '../Map/Renderers/ArrowHead';
import DistHotline from '../../assets/hotline/renderers/DistHotline';
import { Measurement } from '../../models/properties';

interface RCRendererProps {
    nodes: Node[][];
    conditions: WayConditions[];
    properties: Measurement;
    onClick: () => void
}

const toHotlinePalette = (pal: Palette, maxY: number): HotlinePalette => {
    return pal.reduce( (obj, cur) => {
        const { offset, color, stopValue } = cur
        const key: number = stopValue ? Math.max(0, Math.min(1, stopValue / maxY)) : offset
        return {...obj, [key]: color}
      }, {} as HotlinePalette )
}

const RCHotline: FC<RCRendererProps> = ( { nodes, conditions, properties, onClick  } ) => {

    const { dotHoverIndex, minY, maxY } = useGraph()

    const map = useMapEvents({})

    const [hotline, setHotline] = useState<DistHotline>()
    
    const options: HotlineOptions = useMemo( () => { 
        const p = palette(properties)
        const min = p[0].stopValue            || minY || 0
        const max = p[p.length - 1].stopValue || maxY || 1

        const hotlinePal = toHotlinePalette(p, max)
        
        return {
            weight: width(undefined, properties),
            outlineWidth: 0,
            palette: hotlinePal,
            min: min,
            max: max,
        } 
    }, [properties, minY, maxY] )


    useEffect( () => {
        if ( hotline === undefined ) return;
        console.log(dotHoverIndex);
        hotline.setHover(dotHoverIndex)
    }, [dotHoverIndex])

    useEffect( () => {
        if ( hotline === undefined ) return;
        console.log('CONDITIONS UPDATE');
        hotline.setConditions(conditions)
    }, [conditions])

    useEffect( () => {
        if ( nodes.length === 0 ) return;

        const [polyline, _hotline] = LeafletDistHotline( nodes, conditions, options )
        
        polyline.addTo(map)

        setHotline(_hotline)

        return () => { 
            polyline.remove()
            map.removeLayer(polyline);
        }
    }, [map])


    // const origin = path[path.length - 2]
    // const end = path[path.length - 1]
    return null // <ArrowHead key={Math.random()} origin={origin} end={end} />;
}

export default RCHotline;