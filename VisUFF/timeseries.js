class TimeSeries extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    //graphConfig.margins.left = 10;
    super(divHistogram, graphConfig);
    this.idleTimeout = null;
    this.axiNameX = "";
    this.axiNameY = "";
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
    this.xScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
    
  }

  brushed()
  {        
    let s = d3.event.selection;
    
    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(s){
      if(Math.abs(s[0]-s[1]) <= 1) s = this.xZoomScale.range(); 
      const minDate = this.xZoomScale.invert(s[0]);
      const maxDate = this.xZoomScale.invert(s[1]);
      // console.log(minDate, maxDate);
      this.xScale.domain([ minDate, maxDate ]);
      this.xAxis = d3.axisBottom(this.xScale);
      this.xAxisGroup.call(this.xAxis);

      this.dataGroup
          .selectAll('path')
          .attr('d', this.line);

    }   
  }

  initEvents()
  {
    this.brush = d3.brushX()
        .extent([[0, 0], [this.cw, 50]])
        .on("start brush", this.brushed.bind(this));

    this.mainSVG
        .append("g")
        .attr("class", "brush")
        .attr('width', this.cw)
        .attr('height', 30)
        .attr('transform', `translate(${this._graphConfig.margins.left},${this._graphConfig.dims.height - this._graphConfig.margins.bottom + 30})`)
        .call(this.brush);   
  }

  configureAxis(dataset)
  {
    // configure Scales
    this.xScale
        .domain([dataset.xMinValue, dataset.xMaxValue])
        .range([0, this.cw]);

    this.yScale
        .domain([dataset.yMinValue-1, dataset.yMaxValue+1])
        .range([this.ch, 0]);
    
    this.xAxisGroup = this.mainSVG.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(${this._graphConfig.margins.left}, ${this._graphConfig.margins.top + this.ch})`);
    this.xAxis = d3.axisBottom(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxisGroup = this.mainSVG.append('g')
        .attr('class', 'yAxis')
        .attr('transform', `translate(${this._graphConfig.margins.left + this.cw}, ${this._graphConfig.margins.top})`)
    this.yAxis = d3.axisRight(this.yScale);
    this.yAxisGroup.call(this.yAxis);

    this.cScale
        .domain(dataset.infoToLookUp)
        .range(['rgba(255,0,0,0.7)','rgba(0,255,0,0.7)','rgba(0,0,255,0.7)','rgba(0,0,0,0.7)']);

    this.xZoomScale = d3.scaleTime()
        .domain([dataset.xMinValue, dataset.xMaxValue])
        .range([0, this.cw]);

    this.xAxisGroupZoom = this.mainSVG.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(${this._graphConfig.margins.left}, ${this._graphConfig.margins.top + this.ch + (this._graphConfig.margins.bottom/2)})`);
    this.xZoomAxis = d3.axisBottom(this.xZoomScale);
    this.xAxisGroupZoom.call(this.xZoomAxis);

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
          .attr("x", this._graphConfig.margins.left + this.cw)
          .attr("y", this._graphConfig.margins.top - 10)
          .text(this.axiNameY );
    }

  }

  showDataset(dataset)
  {
    dataset.info.forEach((dataInfo)=>{
      this.appendData(dataInfo);
    });    
  }

  appendData(dataInfo)
  {
    this.line = d3.line()
    .x((d) => {
      return this.xScale(d.date);
    })
    .y((d) => {
      return this.yScale(d.price);
    });

    const lineColor = this.cScale(dataInfo.key);
    this.dataGroup
        .append('path')
        .data([dataInfo.value])
        .attr('class', 'draphInfo')
        .attr('id', `priceChart-${dataInfo.key}`)
        .attr('stroke', `${lineColor}`)
        .attr('stroke-width', '1.5')
        .attr('d', this.line);
  }

  plotLegend(dataset)
  {
    const legendScale = d3.scaleBand()
                          .domain(dataset.info.map(d => {return d.key;}))
                          .range([20,this.ch]);
    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 40},${this._graphConfig.margins.top})`)
        .text('Legenda');

    this.legendGroup
        .selectAll('rect')
        .data(dataset.info.map(d => {return d.key;}))
        .enter()
        .append('rect')
        .attr('x',`${10}`)
        .attr('y', (d)=>{return legendScale(d);})
        .attr('width', `${5}`)
        .attr('height', `${5}`)
        .style('fill', (d)=>{return this.cScale(d)})
    this.legendGroup
        .selectAll('text')
        .data(dataset.info.map(d => {return d.key;}))
        .enter()
        .append('text')
        .attr('x',`${10 + 10}`)
        .attr('y', (d)=>{return legendScale(d) + 5;})
        .text((d) => { return d;});
  }

}