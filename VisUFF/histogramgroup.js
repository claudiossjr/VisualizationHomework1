class HistogramGroup extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }
  
  initAxis()
  {
    console.log("Initializing Axis");
    this.xScale = d3.scaleBand();
    this.xStepScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
  }

  initGraph()
  {
    console.log("Criando Grupo Histograma");
  }
  
  initEvents()
  {
  
  }

  plotDataset(dataset)
  {
    console.log("Plotting Dataset.");
    // console.log(dataset.dataset);
    this.preprocessDataset(dataset);
    console.log(dataset);
    this.configureAxis(dataset);
    this.showDataset(dataset);
  }

  preprocessDataset(data)
  {
    console.log("Start Preprocessing.");
    let minValue = 0;
    let maxValue = 0;
    data.states = data.dataset.map(element => {
      return element.state;
    });

    data.dataset.forEach((element) => {
      data.classes.forEach((classElem) => {
        // console.log(element.data[classElem]);
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
    });

    data.minValue = minValue;
    data.maxValue = maxValue;

    // console.log("MinValue", minValue);
    // console.log("MaxValue", maxValue);
  }

  configureAxis(dataset)
  {
    // ### InitAxis Domain and Value
    // Create xScale
    this.xScale
        .domain(dataset.states)
        .range([0,this.cw])
        .paddingInner(.5)
        .paddingOuter(0)
        .round(true);

    this.barWidth = Math.round((this.xScale.bandwidth()/dataset.classes.length)-this.xScale.paddingInner());
    this.xStepScale
        .domain(dataset.classes)
        .range([0,this.xScale.bandwidth()])
        .paddingInner(.5)
        .paddingOuter(0);

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
        .range(['yellow', 'brown', 'black', 'red', 'green', 'blue', 'gray']);

  }

  showDataset(dataset)
  {
    this.stateArea = this.dataArea
        .selectAll('.state')
        .data(dataset.dataset)
        .enter()
        .append('g')
        .attr('class','state')
        .attr('transform', (data) => {return `translate(${this.xScale(data.state)},0)`;});
    
    this.appendBars(this.stateArea);
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


