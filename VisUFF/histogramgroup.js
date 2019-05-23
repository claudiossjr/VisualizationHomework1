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
  
  initEvents()
  {
  
  }

  preprocessDataset(data)
  {
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;
    data.states = data.dataset.map(element => {
      return element.state;
    });

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

    data.minValue = minValue *0.7;
    data.maxValue = maxValue;
  }

  configureAxis(dataset)
  {
    // ### InitAxis Domain and Value
    // Create xScale
    this.xScale
        .domain(dataset.states)
        .range([0,this.cw])
        .paddingInner(.05)
        .paddingOuter(.02)
        .round(true);

    this.barWidth = Math.round((this.xScale.bandwidth()/dataset.classes.length)-this.xScale.paddingInner());
    this.xStepScale
        .domain(dataset.classes)
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
        .domain(dataset.classes)
        .range(randomColor(dataset.classes.length));

  }

  showDataset(dataset)
  {
    this.stateArea = this.dataGroup
        .selectAll('.state')
        .data(dataset.dataset)
        .enter()
        .append('g')
        .attr('class','state')
        .attr('transform', (data) => {return `translate(${this.xScale(data.state)},0)`;});
    
    this.appendBars(this.stateArea);
  }

  plotLegend(dataset)
  {

    const legendScale = d3.scaleBand()
                          .domain(dataset.classes)
                          .range([20,this.ch]);

    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 30},${this._graphConfig.margins.top})`)
        .text('Graph Legend');
    this.legendGroup
        .selectAll('rect')
        .data(dataset.classes)
        .enter()
        .append('rect')
        .attr('x',`${10}`)
        .attr('y', (d)=>{return legendScale(d);})
        .attr('width', `${20}`)
        .attr('height', `${20}`)
        .style('fill', (d)=>{return this.cScale(d)});
    this.legendGroup
        .selectAll('text')
        .data(dataset.classes)
        .enter()
        .append('text')
        .attr('x',`${10+30}`)
        .attr('y', (d)=>{return legendScale(d)+13;})
        .text((d)=>{return d;});
  }

  appendBars(groupArea)
  {
    this.stateArea
        .selectAll('rect')
        .data((data)=> {return data.data})
        .enter()
        .append('rect')
        .attr('width', this.barWidth)
        .attr('height', (d) => {return this.ch - this.yScale(d[1])})
        .attr('x', (d) => {return this.xStepScale(d[0]);})
        .attr('y', (d) => {return this.yScale(d[1]);})
        .style('fill', (d) => {return this.cScale(d[0]);});
  }

}


