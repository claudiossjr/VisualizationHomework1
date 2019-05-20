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
graphObject.margins = {top:10, bottom:10, left:10, right:10};
graphObject.axisOptions = AxisOptions.BOTTOMLEFT;
graphObject.ticksOptions = TicksOptions.RIGHT;
graphObject.xLabel = "";
graphObject.yLabel = "";
graphObject.graphLegendOption = true; // Analyse Options
graphObject.allowZoom = true;
graphObject.allowBrush = true;

const divHistogramGraph = d3.select("#HistogramGraph");

const histogramGraph = new Histogram(divHistogramGraph, graphObject);
