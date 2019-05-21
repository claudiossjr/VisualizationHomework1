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
    this.xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,this.cw]);
    this.yScale = d3.scaleLinear()
        .domain([0,100])
        .range([this.ch,0]);
    
    // Axis Group
    this.xAxisGroup = this.mainSVG.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(${this._graphConfig.margins.left}, ${this._graphConfig.margins.top + this.ch})`);
    this.xAxis = d3.axisBottom(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxisGroup = this.mainSVG.append('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${this._graphConfig.margins.left}, ${this._graphConfig.margins.top})`)
    this.yAxis = d3.axisLeft(this.yScale);
    this.yAxisGroup.call(this.yAxis);

    // init anotherComponents
  }

  updateDataset(nDataset)
  {
    this._graphConfig.dataset = nDataset;
    // Atualizar visualização 
  }

  initEvents()
  {
    throw new Error("Events Not Implemented");
  }

  initGraph()
  {
    throw new Error("Init Graph Not Implemented");
  }

  plotDataset()
  {
    throw new Error("Plot Not Implemented");
  }

}

class Histogram extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }

  initGraph()
  {
    console.log("Criando Histograma");
    // this.mainSVG.selectAll("p")
    //     .data(this._graphConfig.dataset)
    //     .enter()
    //     .append("p")
    //     .text((d) => {return `text-${d}`});
  }

  initEvents()
  {
  
  }

  initGraph()
  {
    this.appendBar();
  }

  plotDataset()
  {
    
  }

  appendBar()
  {
    console.log(this);
    this.dataArea
        .selectAll('rect')
        .data(this._graphConfig.dataset)
        .enter()
        .append('rect')
        .attr('calue', (d) => {return `${d[0]},${d[1]}`})
        .attr('x', (d) => {return this.xScale(d[0]); })
        .attr('y', (d) => {return this.yScale(d[1]);})
        .attr('width', (d) => {return this.xScale(1);})
        .attr('height', (d) => {return this.ch - this.yScale(d[1]);})
        .style('stroke', 'gray')        
        .style('fill', (d) => { return "rgb(125,19,255)"; });
  }

}

class ScatterPlot extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }

  initGraph()
  {
    console.log("Criando ScatterPlot");
    // this.mainSVG.selectAll("p")
    //     .data(this._graphConfig.dataset)
    //     .enter()
    //     .append("p")
    //     .text((d) => {return `text-${d}`});
  }

}

class TimeSeries extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }
  
  initGraph()
  {
    console.log("Criando TimeSeries");
    // this.mainSVG.selectAll("p")
    //     .data(this._graphConfig.dataset)
    //     .enter()
    //     .append("p")
    //     .text((d) => {return `text-${d}`});
  }

}