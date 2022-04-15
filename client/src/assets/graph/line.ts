

import * as d3 from 'd3'

import { getColors } from "./color";
import Dots from "./dots";
import Path from "./path";

import { Axis, GraphData, SVG } from "../../models/graph";

const grey = '#aab'


class Line {

    path: Path;
    dots: Dots;

    constructor(svg: SVG, label: string) {
        this.path = new Path(svg, label)
        this.dots = new Dots(svg, label)
    }

    add(data: GraphData, axis: [Axis, Axis], color: string) {
        this.path.add(data, axis, color)
        this.dots.add(data, axis, color)
        return this;
    }

    static rem(svg: SVG, label: string) {
        const line = new Line(svg, label)
        line.path.rem()
        line.dots.rem()
    }
}


export const addLine = ( 
    svg: SVG, 
    data: GraphData, 
    axis: [Axis, Axis],
    label: string,
    i: number 
) =>  {
    const colors = getColors(0)
    const color = colors[i % colors.length]

    const line = new Line(svg, label)
        .add(data, axis, color)

    const mouseOverLine = () => {
        line.path.allMouseOver()
        line.dots.mouseOver()
        line.path.mouseOver(3)	
    }

    const mouseOutLine = () => {
        line.path.allMouseOut()
        line.dots.mouseOut(color)
        line.path.mouseOut(color)
    }

    line.path.onMouseOver( mouseOverLine )
    line.path.onMouseOut( mouseOutLine )
    line.dots.onMouseOver( mouseOverLine )
    line.dots.onMouseOut( mouseOutLine )
}

export const remLine = (svg: SVG, label: string) => {
    Line.rem(svg, label)
}