'use strict';


function main()
{

  const axisType = AxisOptions.TOPLEFT;
// axisType = AxisOptions.TOPRIGHT;
// axisType = AxisOptions.BOTTOMLEFT;
// axisType = AxisOptions.BOTTOMRIGHT;

const ticksType = TicksOptions.DOWN;
// ticksType = TicksOptions.UPPER;
// ticksType = TicksOptions.RIGHT;

const graphObject = {};
graphObject.dims = {width:600, height:400};
graphObject.legendWidth = 80;
graphObject.margins = {top:50, bottom:50, left:50, right:(50 + graphObject.legendWidth)};
graphObject.axisOptions = AxisOptions.BOTTOMLEFT;
graphObject.ticksOptions = TicksOptions.RIGHT;
graphObject.xLabel = "";
graphObject.yLabel = "";
graphObject.allowLegend = true; // Analyse Options
graphObject.allowZoom = true;
graphObject.allowBrush = true;
// graphObject.dataset = [[10,40],[20,30],[30,5],[40,20],[50, 70]];

const divHistogramGraph = d3.select("#HistogramGraph");
const histogramGraph = new HistogramGroup(divHistogramGraph, graphObject);
d3.json("datasets/histogramData.json").then((data, error)=>{
  histogramGraph.plotDataset(data);
});

const divScatterPlot = d3.select('#ScatterPlot');
const scatterPlot = new ScatterPlot(divScatterPlot,graphObject);
d3.csv("datasets/scatterPlotData.csv").then((data,error) => {
  scatterPlot.plotDataset(data);
});


const divTimesSeries = d3.select('#TimeSeries');
const timeSeries = new TimeSeries(divTimesSeries,graphObject);
d3.json("datasets/petr3.json").then((data,error) => {
  timeSeries.plotDataset(data);
});

}

window.onload = main;
