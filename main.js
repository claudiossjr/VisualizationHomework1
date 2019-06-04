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
graphObject.margins = {top:50, bottom:100, left:50, right:(50 + graphObject.legendWidth)};
graphObject.axisOptions = AxisOptions.BOTTOMLEFT;
graphObject.ticksOptions = TicksOptions.RIGHT;
graphObject.xLabel = "Estados Atingidos";
graphObject.yLabel = "Quantidade de Casos";
graphObject.allowLegend = true; // Analyse Options
graphObject.allowZoom = true;
graphObject.allowBrush = true;

const divHistogramGraph = d3.select("#HistogramGraph");
const histogramGraph = new HistogramGroup(divHistogramGraph, graphObject);
d3.json("datasets/histogramData.json").then((data, error)=>{
  
  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;

  let nData = {};

  nData.classes = data.dataset.map(element => {
    return element.state;
  });

  nData.subClasses = data.classes;

  data.dataset.forEach((element) => {
    element.data.forEach((elemItem) => {
      const classElemValue = elemItem[1];
      if (classElemValue < minValue)
      {
        minValue = classElemValue;
      }

      if (classElemValue > maxValue)
      {
        maxValue = classElemValue;
      }
    });
  });

  nData.minValue = minValue *0.7;
  nData.maxValue = maxValue;

  nData.dataset = data.dataset.map((element) => {
    let dataPreprocessed = element.data.map((things)=>{
      return {"class": element.state, "subClass":things[0], "value":things[1] }
    });
    return {"class": element.state, "info":dataPreprocessed};
  });
  
  histogramGraph.plotDataset(nData);

});

const divScatterPlot = d3.select('#ScatterPlot');
const scatterPlot = new ScatterPlot(divScatterPlot,graphObject);
d3.csv("datasets/scatterPlotData.csv").then((dataset,error) => {
  const axiNameX = "MidPrice";
  const axiNameY = "Horsepower";
  scatterPlot.setAxiNameX("MidPrice");
  scatterPlot.setAxiNameY("Horsepower");

  let nData = {};

  nData.makes = dataset.map((data) => {
    return data.Make;
  });

  nData.makes = nData.makes.filter((data, index) => {
    return nData.makes.indexOf(data) === index;
  });

  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;

  // x Axi xAxiValue
  dataset.forEach((data)=>{
    const xAxiValue = Number(data[axiNameX]);
    if (xAxiValue < minValue)
    {
      minValue = xAxiValue;
    }
    if (xAxiValue > maxValue)
    {
      maxValue = xAxiValue;
    }
  });

  nData.xMinValue = Math.round(minValue * 0.8);
  nData.xMaxValue = maxValue;

  minValue = Number.MAX_VALUE;
  maxValue = Number.MIN_VALUE;

  // y Axi yAxiValue
  dataset.forEach((data) => {
    const yAxiValue = Number(data[axiNameY]);
    if (yAxiValue < minValue)
    {
      minValue = yAxiValue;
    }
    if (yAxiValue > maxValue)
    {
      maxValue = yAxiValue;
    }
  });

  nData.yMinValue = Math.round(minValue * 0.8);
  nData.yMaxValue = maxValue;


  nData.info = dataset.map((line)=>{
    return [+line[axiNameX],+line[axiNameY], line.Make];
  });

  scatterPlot.plotDataset(nData);
});


const divTimesSeries = d3.select('#TimeSeries');
const timeSeries = new TimeSeries(divTimesSeries,graphObject);
d3.json("datasets/petr3.json").then((dataset,error) => {

  let nData = {};

  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;

  nData.info = [];
  nData.infoToLookUp = ['open','high','low', 'closure'];
  nData.infoToLookUp.filter((d)=>{ return d !== "volume"})
      .forEach((data) => {
    
    const tempArray = [];
    for(let key in dataset.TimeSeries)
    {
      const stepInfo = dataset.TimeSeries[key];
      const info = Number.parseFloat(stepInfo[data]);
      const arrDate = parseDate(key);
      const date = new Date(arrDate[0],arrDate[1]-1,arrDate[2], arrDate[3],arrDate[4], arrDate[5]);
      tempArray.push({"date":date, "price":info});
    }
    
    const arrayMin = d3.min(tempArray, (d) => {
      return d.price;
    });

    const arrayMax = d3.max(tempArray, (d) => {
      return d.price;
    });

    if(arrayMin < yMin)
    {
      yMin = arrayMin;
    }

    if(arrayMax > yMax)
    {
      yMax = arrayMax;
    }

    nData.info.push({"key":data, "value": tempArray});
  });

  const xMin = d3.min(nData.info[0].value, (d) => {
    return d.date;
  });

  const xMax = d3.max(nData.info[0].value, (d) => {
    return d.date;
  });

  nData.xMinValue = xMin;
  nData.xMaxValue = xMax;

  nData.yMinValue = yMin;
  nData.yMaxValue = yMax;

  console.log(nData);
  // timeSeries.setAxiNameX();
  timeSeries.setAxiNameY("Preços");
  timeSeries.plotDataset(nData);
});

}

window.onload = main;
