


export interface LatLng {
	lat: number;
	lng: number;
}

export interface PointData extends LatLng {
	properties?: PointProperties;
	value?: number;
	metadata?: any;
}

export type Path = PointData[]

export interface Bounds {
    minX: number;
    maxX: number;
	minY: number;
    maxY: number;
}

export enum RendererName {
    circle = 'circle',
    circles = 'circles',
    rectangles = 'rectangles',
    line = 'line',
    hotline = 'hotline',
    hotpoints = 'hotpoints'
}

// Rendering properties of a single point belonging to a Path
// If an attribute is defined for a point, it overwrites the properties for the path
export interface PointProperties {
	// Color of a point or the entire path
	color?: string;
	// Radius or largeness of a point or the entire path
	width?: number;
	// Weight (boldness) of a point or the entire path
	weight?: number;
	// Opacity (between 0 and 1) of a point or the entire path
	opacity?: number;
}

// Rendering properties of an entire Path
export interface PathProperties extends PointProperties {
	// The name of the renderer to use - see ./renderers for the list of names
	rendererName: RendererName;
	// Weight will depend on the value - the dilatationFactor will control how big a weight
	// grows depending on the value.
	// 	< 1 -> shrinks
	//  > 1 -> grows
	//  == 1 -> stays the same
	dilatationFactor?: number;
}

export interface Measurement extends PathProperties {
	rendererName: RendererName;
	query: string;
	queryMeasurement: string,
	name: string;
	// Needs to be specified if the points have a value attached to them
	hasValue?: boolean;
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


export type Position3D = {
	x: number;
	y: number;
	z: number;
}