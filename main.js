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
graphObject.dims = {width:800, height:600};
graphObject.margins = {top:50, bottom:50, left:50, right:50};
graphObject.axisOptions = AxisOptions.BOTTOMLEFT;
graphObject.ticksOptions = TicksOptions.RIGHT;
graphObject.xLabel = "";
graphObject.yLabel = "";
graphObject.graphLegendOption = true; // Analyse Options
graphObject.allowZoom = true;
graphObject.allowBrush = true;
// graphObject.dataset = [[10,40],[20,30],[30,5],[40,20],[50, 70]];

const divHistogramGraph = d3.select("#HistogramGraph");

const histogramGraph = new HistogramGroup(divHistogramGraph, graphObject);


let histogramDataset = [
  {
    "Rio de janeiro" : {
      "<10" : 100,
      ">10<20" : 200,
      ">20<30": 120,
      ">30<40": 80,
      ">40<50": 700,
      ">50<60": 450,
      ">60": 220
    }
  },
  {
    "São Paulo" : {
      "<10" : 100,
      ">10<20" : 200,
      ">20<30": 300,
      ">30<40": 250,
      ">40<50": 80,
      ">50<60": 350,
      ">60": 300
    }
  }
];
function readJson(data, error)
{
  histogramGraph.plotDataset(data);
}

d3.json("datasets/histogramData.json").then(readJson);
  

}

window.onload = main;
