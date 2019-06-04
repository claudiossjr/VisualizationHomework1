class HistogramGroup extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }
  
  initAxis()
  {
    this.xScale = d3.scaleBand();
    this.xStepScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
  }
  
  zoomed()
  {
    this.xScale.range([0, this.cw].map(d => d3.event.transform.applyX(d)));
    this.xStepScale.range([0, this.xScale.bandwidth()]);
    this.dataGroup
        .selectAll(".state")
        .attr('transform', (data) => {return `translate(${this.xScale(data.class)},0)`;});
    let nGroup = this.dataGroup.selectAll('.state').size();
    let nBar = this.dataGroup.selectAll(".barInfo").size();
    let barPerGroup = nBar/nGroup;
    let nBarWidth = this.xScale.bandwidth() / barPerGroup;
    this.dataGroup
        .selectAll(".barInfo")
        .attr("x", (d) => {return this.xStepScale(d.subClass)})
        .attr("width", nBarWidth);
    this.xAxisGroup.call(this.xAxis);
  }

  brushed()
  {        
    var s = d3.event.selection,
        x0 = s[0],
        x1 = s[1];

    this.dataGroup
        .selectAll('.barInfo')
        .style("stroke-width", (d) =>
        {
          const xPositionIni = this.xScale(d.class) + this.xStepScale(d.subClass);
          const xPositionEnd = this.xScale(d.class) + this.xStepScale(d.subClass) + this.barWidth;
          if ((xPositionIni >= x0 && xPositionIni <= x1) || (xPositionEnd >= x0 && xPositionEnd <= x1) || (xPositionIni <= x0 && xPositionEnd >= x1) && (Math.abs(x0 - x1) > 1  ))
          { 
            return 1.5;
          }
          else 
          { 
            return 0;
          }
        });        
  }

  initEvents()
  {
    
    const extent = [[0, 0], [this.cw, this.ch]];
    this.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", this.zoomed.bind(this));
    
    this.mainSVG
        .call(this.zoom);
  
    this.brush = d3.brushX()
        .extent([[0, 0], [this.cw, this.ch]])
        .on("start brush", this.brushed.bind(this));

    this.dataGroup
        .append("g")
        .attr("class", "brush")
        .call(this.brush);   

  }


  configureAxis(dataset)
  {
    // ### InitAxis Domain and Value
    // Create xScale
    this.xScale
        .domain(dataset.classes)
        .range([0,this.cw])
        .paddingInner(.1)
        .paddingOuter(.05)
        .round(true);

    this.barWidth = Math.round((this.xScale.bandwidth()/dataset.subClasses.length)-this.xScale.paddingInner());
    this.xStepScale
        .domain(dataset.subClasses)
        .range([0,this.xScale.bandwidth()]);

    // Create yScale
    const yDomain = [dataset.minValue, dataset.maxValue];
    this.yScale.domain(yDomain)
        .range([this.ch, 0]);

    // Create and PlotAxiGroup
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
    
    this.cScale
        .domain(dataset.subClasses)
        .range(randomColor(dataset.subClasses.length));

    if (this._graphConfig.xLabel.length > 0)
    {
      this.mainSVG
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", this._graphConfig.margins.left + this.cw + 3*this._graphConfig.xLabel.length)
          .attr("y", this._graphConfig.margins.top + this.ch + 15)
          .text(this._graphConfig.xLabel);
    }

    if (this._graphConfig.yLabel.length > 0)
    {
      this.mainSVG
          .append("text")
          .attr("class", "y label")
          // .attr("text-anchor", "end")
          .attr("x", this._graphConfig.margins.left)
          .attr("y", this._graphConfig.margins.top - 10)
          .text(this._graphConfig.yLabel );
    }

  }

  showDataset(dataset)
  {
    this.stateArea = this.dataGroup
        .selectAll('.state')
        .data(dataset.dataset)
        .enter()
        .append('g')
        .attr('class','state')
        .attr('transform', (data) => {return `translate(${this.xScale(data.class)},0)`;});
    
    this.appendBars();
  }

  plotLegend(dataset)
  {

    const legendScale = d3.scaleBand()
                          .domain(dataset.subClasses)
                          .range([20,this.ch]);

    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 30},${this._graphConfig.margins.top})`)
        .text('Legenda');
    this.legendGroup
        .selectAll('rect')
        .data(dataset.subClasses)
        .enter()
        .append('rect')
        .attr('x',`${10}`)
        .attr('y', (d)=>{return legendScale(d);})
        .attr('width', `${20}`)
        .attr('height', `${20}`)
        .style('fill', (d)=>{return this.cScale(d)});
    this.legendGroup
        .selectAll('text')
        .data(dataset.subClasses)
        .enter()
        .append('text')
        .attr('x',`${10+30}`)
        .attr('y', (d)=>{return legendScale(d)+13;})
        .text((d)=>{return d;});
  }

  appendBars()
  {
    this.stateArea
        .selectAll('rect')
        .data((data) => { return data.info; })
        .enter()
        .append('rect')
        .attr('class','barInfo')
        .attr('width', this.barWidth)
        .attr('height', (d) => {return this.ch - this.yScale(d.value)})
        .attr('x', (d) => {return this.xStepScale(d.subClass);})
        .attr('y', (d) => {return this.yScale(d.value);})
        .style('fill', (d) => {return this.cScale(d.subClass);})
        .style('stroke-width',0);
  }

}


