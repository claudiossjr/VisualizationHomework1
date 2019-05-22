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
    this.initAxis();
    this.initEvents();
    this.initGraph();
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
    this.dataArea = this.mainSVG.append('g')
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

  initAxis()
  {
    throw new Error("Init Axis Not Implemented.");
  }

  initEvents()
  {
    throw new Error("Init Events Not Implemented.");
  }

  initGraph()
  {
    throw new Error("Init Graph Not Implemented.");
  }

  preprocessDataset(dataset)
  {
    throw new Error("Preprocess Not Implemented.");
  }

  plotDataset(dataset)
  {
    throw new Error("PlotDataset Not Implemented.");
  }

  updateDataset(nDataset)
  {
    this._graphConfig.dataset = nDataset;
    // Atualizar visualização 
  }

}
