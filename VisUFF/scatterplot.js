
class ScatterPlot extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
    this.axiNameX = "";
    this.axiNameY = "";
    this.radius = 5
    this.strokeWidth = 1.5;
    this.ratio = 1; 
  }

  setAxiNameX(name)
  {
    this.axiNameX = name;
  }

  setAxiNameY(name)
  {
    this.axiNameY = name;
  }

  initAxis()
  {
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
  }

  brushed()
  {        
    var s = d3.event.selection,
        x0 = s[0][0],
        y0 = s[0][1],
        x1 = s[1][0],
        y1 = s[1][1];

    let nXScale = this.xAxis.scale();
    let nYScale = this.yAxis.scale();
    this.dataGroup
        .selectAll('circle')
        .style("stroke-width", (d) =>
        {
          if ((nXScale(d[0]) >= x0 && nXScale(d[0]) <= x1) && 
              (nYScale(d[1]) >= y0 && nYScale(d[1]) <= y1))
          { 
            return this.strokeWidth / this.ratio;
          }
          else 
          { 
            return 0;
          }
        });        
  }

  zoomed()
  {
    this.ratio = d3.event.transform.k;
    this.dataGroup.selectAll('circle')
        .attr("transform", d3.event.transform)
        .attr("r", this.radius / this.ratio);
    this.xAxisGroup.call(this.xAxis.scale(d3.event.transform.rescaleX(this.xScale)));
    this.yAxisGroup.call(this.yAxis.scale(d3.event.transform.rescaleY(this.yScale)));
  }

  initEvents()
  {
    const extent = [[this._graphConfig.margins.left, this._graphConfig.margins.top], [this.cw, this.ch]];
    this.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", this.zoomed.bind(this));
    
    this.mainSVG
        .call(this.zoom);

    this.brush = d3.brush()
        .extent([[0, 0], [this.cw, this.ch]])
        .on("start brush", this.brushed.bind(this));

    this.dataGroup
        .append("g")
        .attr("class", "brush")
        .attr('width', this.cw)
        .call(this.brush);   
  }

  configureAxis(dataset)
  {
    // Configurando eixoX
    this.xScale
        .domain([dataset.xMinValue, dataset.xMaxValue])
        .range([0, this.cw]);
    this.yScale
        .domain([dataset.yMinValue-5, dataset.yMaxValue+5])
        .range([this.ch, 0]);
    this.cScale
        .domain(dataset.makes)
        .range(randomColor(dataset.makes.length));

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

    if (this.axiNameX.length > 0)
    {
      this.mainSVG
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", this._graphConfig.margins.left + this.cw + 3*this.axiNameX.length)
          .attr("y", this._graphConfig.margins.top + this.ch + 30)
          .text(this.axiNameX);
    }

    if (this.axiNameY.length > 0)
    {
      this.mainSVG
          .append("text")
          .attr("class", "y label")
          // .attr("text-anchor", "end")
          .attr("x", this._graphConfig.margins.left)
          .attr("y", this._graphConfig.margins.top - 10)
          .text(this.axiNameY );
    }

  }

  showDataset(dataset)
  {
    this.dataGroup
        .selectAll('circle')
        .data(dataset.info)
        .enter()
        .append('circle')
        .attr('cx', (d) => {return this.xScale(d[0]);})
        .attr('cy', (d) => {return this.yScale(d[1]);})
        .attr('r', this.radius)
        .style('fill', (d) => {return this.cScale(d[2]);} )
        .style('stroke-width',0);
  }

  plotLegend(dataset)
  {
    const legendScale = d3.scaleBand()
          .domain(dataset.makes)
          .range([20,this.ch]);
    
    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 30},${this._graphConfig.margins.top})`)
        .text('Legenda');
    this.legendGroup
        .selectAll('circle')
        .data(dataset.makes)
        .enter()
        .append('circle')
        .attr('cx',`${10}`)
        .attr('cy', (d)=>{return legendScale(d);})
        .attr('r', this.radius)
        .style('fill', (d)=>{return this.cScale(d)})
        .style('stroke-width',0);
    this.legendGroup
        .selectAll('text')
        .data(dataset.makes)
        .enter()
        .append('text')
        .attr('x',`${10+10}`)
        .attr('y', (d)=>{return legendScale(d)+4;})
        .text((d)=>{return d;});;
  }

}