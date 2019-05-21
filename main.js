'use strict';

const axisType = AxisOptions.TOPLEFT;
// axisType = AxisOptions.TOPRIGHT;
// axisType = AxisOptions.BOTTOMLEFT;
// axisType = AxisOptions.BOTTOMRIGHT;

const ticksType = TicksOptions.DOWN;
// ticksType = TicksOptions.UPPER;
// ticksType = TicksOptions.RIGHT;

const graphObject = {};
graphObject.dims = {width:800, height:600};
graphObject.margins = {top:25, bottom:25, left:25, right:25};
graphObject.axisOptions = AxisOptions.BOTTOMLEFT;
graphObject.ticksOptions = TicksOptions.RIGHT;
graphObject.xLabel = "";
graphObject.yLabel = "";
graphObject.graphLegendOption = true; // Analyse Options
graphObject.allowZoom = true;
graphObject.allowBrush = true;
graphObject.dataset = [[10,40],[20,30],[30,5],[40,20],[50, 70]];

const divHistogramGraph = d3.select("#HistogramGraph");

const histogramGraph = new Histogram(divHistogramGraph, graphObject);
