
import { RideMeta, Position3D, PointData, BoundedPath } from './models'
import { Knex } from 'knex'

// const fetchPositions = async (query: object ): Promise<Path> =>
// {
//     const db: Knex<any, unknown[]> = knex(DATABASE_CONFIG);
//     const res = await db
//         .select( [ 'lat', 'lon' ] )
//         .from( { public: 'Measurements' } )
//         .where( query )
//     return res.map( (msg: any) => {
//         return {lat: msg.lat, lng: msg.lon }
//     } )
// }

export const getAccelerationData = async (db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<Position3D[]> =>
{
    const res = await db
            .select( [ 'message' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': 'acc.xyz' } );

    return res.map( (msg: any) => {
        const data = JSON.parse(msg.message)
        return { x: data['acc.xyz.x'], y: data['acc.xyz.y'], z: data['acc.xyz.z'] }
    } )
}

export const getTest = async ( db: Knex<any, unknown[]>, [tripId]: [string] ): Promise<any> => {
    tripId = '2857262b-71db-49df-8db6-a042987bf0eb' // '004098a1-5146-4516-a8b7-ff98c13950aa'
    // const tag = 'acc.xyz'
    const res = await db
            .select( '*' )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId } )
            .whereNot( { "T": 'acc.xyz' })
            .limit(100_000)
    console.log(res);

    return res;
}


export const getMeasurementData = async ( db: Knex<any, unknown[]>, [tripId, measurement]: [string, string] ): Promise<BoundedPath> =>
{
    const res = await db
            .select( [ 'message', 'lat', 'lon', 'Created_Date' ] )
            .from( { public: 'Measurements' } )
            .where( { 'FK_Trip': tripId, 'T': measurement } )
            .whereNot( { 'lat': null, 'lon': null } )

    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    const path = res
        .map( (msg: any) => {
            const json = JSON.parse(msg.message)
            const value = json['obd.rpm.value'];
            const time = new Date(msg.Created_Date).getTime()

            minX = Math.min(minX, time);
            maxX = Math.max(maxX, time);
            minY = Math.min(minY, value)
            maxY = Math.max(maxY, value)

            return { lat: msg.lat, lng: msg.lon, value, metadata: { timestamp: time } } as PointData
        } )
        .sort( (a: PointData, b: PointData) =>
            a.metadata.timestamp - b.metadata.timestamp
        )

    return { path, bounds: { minX, maxX, minY, maxY } }
}

export const getRides = async (db: Knex<any, unknown[]>): Promise<RideMeta[]> => {
    const res: RideMeta[] = await db
        .select( '*' )
        .from( { public: 'Trips' } )
        .whereNot( 'TaskId', 0 )
        .orderBy('TaskId')

    return res
}