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

function randomColor(numberOfClasses)
{
  let colors = [];
  for(let i = 0; i < numberOfClasses; i++)
  {
    colors.push(`rgba(${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)}, ${Math.ceil((0.1+Math.random())*0.7)})`);
  }
  return colors;
}

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
    this.initAxis();
    this.initEvents();
    if(this._graphConfig.allowLegend)
      this.initLegend();
  }

  initSVGs()
  {
    // init SVG
    this.mainSVG = this._myDiv.append('svg')
        .attr('width',  this._graphConfig.dims.width)
        .attr('height', this._graphConfig.dims.height);

    // init DataGroupArea
    this.cw = this._graphConfig.dims.width   - this._graphConfig.margins.left  -  this._graphConfig.margins.right;
    this.ch = this._graphConfig.dims.height  - this._graphConfig.margins.top   -  this._graphConfig.margins.bottom;
    this.dataGroup = this.mainSVG.append('g')
        .attr('width',this.cw)
        .attr('height',this.ch)
        .attr('transform', `translate(${this._graphConfig.margins.left}, ${this._graphConfig.margins.top})`);

    // init axisGroup
    this.xScale = undefined;
    // d3.scaleLinear()
    //     .domain([0,100])//['Rio de Janeiro', 'São Paulo'])
    //     .range([0,this.cw]);
    this.yScale = undefined;
    // d3.scaleLinear()
    //     .domain([0,100])
    //     .range([this.ch,0]);
    
    // Axis Group
    this.xAxisGroup = undefined;

    this.yAxisGroup = undefined;
    

    // init anotherComponents
  }

  initLegend()
  {
    this.legendGroup = this.mainSVG
        .append('g')
        .attr('width',`${this._graphConfig.legendWidth}`)
        .attr('height',`${this.ch}`)
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 40},${this._graphConfig.margins.top})`);
  }

  initAxis()
  {
    throw new Error("Init Axis Not Implemented.");
  }

  initEvents()
  {
    throw new Error("Init Events Not Implemented.");
  }

  preprocessDataset(dataset)
  {
    throw new Error("Preprocess Dataset Not Implemented.");
  }

  configureAxis(dataset)
  {
    throw new Error("Axis Not Configured.");
  }

  showDataset(dataset)
  {
    throw new Error("ShowDataset not implemented.");
  }

  plotLegend(dataset)
  {
    throw new Error("PlotLegend Not Implemented.");
  }

  plotLegend(dataset)
  {
    throw new Error("Plot Legend Not Implemented");
  }

  plotDataset(dataset)
  {
    this.preprocessDataset(dataset);
    this.configureAxis(dataset);
    this.showDataset(dataset);
    if (this._graphConfig.allowLegend)
    {
      this.plotLegend(dataset);
    }
  }
}
