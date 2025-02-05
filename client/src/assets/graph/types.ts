import { Selection } from 'd3';
import { FC } from 'react';
import { Color } from 'react-leaflet-hotline';
import { Bounds, Path } from '../../models/path';
import { PointData } from '../../models/path';

// SVG
export type SVG = d3.Selection<SVGGElement, unknown, null, undefined>;
export type SVGLayer = d3.Selection<d3.BaseType, unknown, null, undefined>;

// Axis
export interface IAxis {
  svg: SVG;
  axis: Axis | undefined;
  width: number;
  height: number;
  zoom: number;
  absolute?: boolean;
  time?: boolean;
}
export type ReactAxis = FC<IAxis>;
export type Axis = d3.ScaleLinear<number, number, never>;
export type GraphAxis = [Axis, Axis];

// Data format
export type GraphPoint = [number, number];
export type GraphData = GraphPoint[];
export interface Plot {
  pathData: Path;
  data: GraphData;
  bounds?: Bounds;
  label: string;
}

// Events
export interface DotHover {
  label: string;
  x: number;
}

// Options
export interface PathOptions {
  stroke?: string;
  strokeWidth?: number;
}
export interface DotsOptions {
  radius?: number;
  opacity?: number;
  fill?: string;
}

// Palette - Gradient
export type Gradient = Selection<
  SVGStopElement,
  Color,
  SVGLinearGradientElement,
  unknown
>;

// MinMax
export type MinMax = [number, number];
export type AddMinMaxFunc = (label: string, bounds: Required<Bounds>) => void;
export type RemMinMaxFunc = (label: string) => void;

// Callback
export type D3Callback = (event: any, d: GraphPoint) => void;

/** @author Benjamin Lumbye s204428, Mads Westermann s174508 */
// Markers map
export interface MarkerData {
  lat: number;
  lng: number;
  index: number;
}
export type MarkersRecord = Record<string, MarkerData>;

/** @author Benjamin Lumbye s204428, Mads Westermann s174508 */
export interface UseMarkersAction {
  taskID: number;
  measurementName: string;
  data: MarkerData;
  source: 'GRAPH' | 'MAP';
}
