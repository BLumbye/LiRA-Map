import { FC, useEffect, useState } from "react";

import { RideMeta } from '../../assets/models'

import '../../css/ridedetails.css'


type Props = {
    md: RideMeta,
};

type Elt = {
    i: number,
    key: string,
    value: string,
    isSublist?: boolean
}


const DATE_MD = [
    "StartTimeUtc",
    "EndTimeUtc"
]

const POSITION_MD = [
    "StartPositionDisplay",
    "EndPositionDisplay"
]

const BANNED_MD = [
    "Fully_Imported",
    "Fully_RouteAnnotated",
    "Description",
    "ChangeLog"
]

const formatDate = (val: string) => {
    const date = new Date(val)
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
        + '  ' + date.getHours() + ':' + date.getMinutes()
}


//print all necessary meta info with a map function here
const MetaData: FC<Props> = ( { md } ) => {

    const [elts, setElts] = useState<Elt[]>([])

    const getMDelt = ( {i, key, value, isSublist }: Elt) => {        
        return <div className={`ride-metadata-elt ${isSublist ? 'sublist-elt' : ''}`} key={'metadata-' + i}>
            <b>{key}</b><br></br>{value} 
        </div>
    }

    useEffect(() => {
        const newElts: Elt[] = Object.entries(md)
            .filter( (elt) => !BANNED_MD.includes(elt[0]) )
            .flatMap( (elt, i) => {
                const [key, value] = elt;

                if ( POSITION_MD.includes(key) )
                {
                    const baseElt = {i: i, key: key, value: '' };
                    
                    let positions: [string, any][] = [];
                    try { positions = Object.entries(JSON.parse(value)) }
                    catch(e) { }                    

                    const mappedPos = positions
                        .map( (pos: [string, any], j) => { 
                            return { i: i * 3000 + j + 3000, key: pos[0], value: pos[1], isSublist: true }
                        } )
                    return [ baseElt, ...mappedPos];
                    
                }
                else if ( DATE_MD.includes(key))
                    return { i: i, key: key, value: formatDate(value) }

                return { i: i, key: key, value: value }
            } )
        
        setElts(newElts);
    }, [md])

    return (
        <>
		<div className="ride-metadata-separation"></div>
        <div className="ride-metadata-list" >
            { elts.map( (elt) => getMDelt(elt)) }
        </div>
        </>
    )
    
}

export default MetaData;