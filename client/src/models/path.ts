// Represents a point containing (lat, lng) coordinates, 

import { LatLng } from "./models";
import { Measurement, PathProperties, PointProperties } from "./properties";
import { PathEventHandler } from "./renderers";

// rendering properties, and optionally, a value and some metadata (like timestamp)
export interface PointData extends LatLng {
	properties?: PointProperties;
	value?: number;   	   			
	metadata?: any;
}

// A Path is a collection of points
export type Path = PointData[]

export interface Bounds {
    minX?: number;
    maxX?: number;
	minY?: number;
    maxY?: number; 
}


// Props passed to the Path and EventPath components
export interface PathProps {
	path: Path;
	bounds?: Bounds;
	properties: PathProperties;
	metadata?: {[key: string]: any}
	onClick?: PathEventHandler
}

// used for queries
export interface BoundedPath {
	path: Path;
	bounds?: Bounds;
}

// This interface is used as a type for server's response
// for instance, JSON files follow this format
export interface JSONProps extends BoundedPath {
	properties: Measurement;
	metadata?: {[key: string]: any}
}



export type HotlinePalette = { [key: number]: string } 

export interface HotlineOptions {
	min?: number;
	max?: number;
	zoomRange: [number, number]; // TODO: remove
	weight?: number;
	weightFunc?: (a: number, b: number) => number;
	outlineWidth?: number;
	palette?: HotlinePalette;
	onclick?: (e: any) => void;
}
