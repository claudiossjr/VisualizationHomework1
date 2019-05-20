var AxisOptions = {
  TOPLEFT: 1,
  TOPRIGHT: 2,
  BOTTOMLEFT: 3,
  BOTTOMRIGHT: 4
}

var TicksOptions = {
  UPPER: 1,
  DOWN: 2,
  RIGHT: 3
};

class BaseGraph
{
  constructor (divHistogram, graphConfig)
  {
    this._myDiv = divHistogram;
    this._graphConfig = graphConfig;
    this.initProperties();
  }

  initProperties()
  {
    this.initSVGs();
    this.initEvents();
  }

  initSVGs()
  {
    // init SVG
    this.mainSVG = this._myDiv.append('svg')
        .attr('width',  this._graphConfig.dims.width)
        .attr('height', this._graphConfig.dims.height);

    // init DataGroupArea
    const cw = this._graphConfig.dims.width   - this._graphConfig.margins.left  -  this._graphConfig.margins.right;
    const ch = this._graphConfig.dims.height  - this._graphConfig.margins.top   -  this._graphConfig.margins.bottom;
    this.dataArea = this.mainSVG.append('g')
        .attr('width',cw)
        .attr('height',ch);
    // init axisGroup
    // init anotherComponents
  }

  initEvents()
  {

  }

  plotDataset()
  {
    throw new Error("Not Implemented");
  }

}

class Histogram extends BaseGraph
{
}

class ScatterPlot extends BaseGraph
{

}

class TimeSeries extends BaseGraph
{

}