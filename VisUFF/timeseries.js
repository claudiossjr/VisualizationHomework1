class TimeSeries extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
  }

  initAxis()
  {
    this.xScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
    this.infoToLookUp = ['open','high','low', 'closure'];
    // Include Volume as a differente line
  }

  initEvents()
  {
    
  }

  preprocessDataset(dataset)
  {
    let yMin = Number.MAX_VALUE;
    let yMax = Number.MIN_VALUE;

    dataset.info = [];

    this.infoToLookUp.filter((d)=>{ return d !== "volume"})
        .forEach((data) => {
      
      const tempArray = [];
      for(let key in dataset.TimeSeries)
      {
        const stepInfo = dataset.TimeSeries[key];
        const info = Number.parseFloat(stepInfo[data]);
        const date = new Date(key);
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

      dataset.info.push({"key":data, "value": tempArray});
    });
    console.log(dataset);
    console.log(dataset.info[0]);

    // Find data intervals
    const xMin = d3.min(dataset.info[0].value.date, (d) => {
      return d.date;
    });

    const xMax = d3.max(dataset.info[0].value.date, (d) => {
      return d.date;
    });

    dataset.xMinValue = xMin;
    dataset.xMaxValue = xMax;

    dataset.yMinValue = yMin;
    dataset.yMaxValue = yMax;

  }

  configureAxis(dataset)
  {
    // configure Scales
    this.xScale
        .domain([dataset.xMinValue, dataset.xMaxValue])
        .range([0, this.cw]);

    this.yScale
        .domain([dataset.yMinValue, dataset.yMaxValue])
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
        .domain(this.infoToLookUp)
        .range(randomColor(this.infoToLookUp.length));
  }

  showDataset(dataset)
  {
    // generates close price line chart when called
    const line = d3
    .line()
    .x(d => {
      return xScale(d['date']);
    })
    .y(d => {
      return yScale(d['close']);
    });
    // Append the path and bind data
    svg
    .append('path')
    .data(dataset.info)
    .style('fill', 'none')
    .attr('id', 'priceChart')
    .attr('stroke', (d)=>{return this.cScale();})
    .attr('stroke-width', '1.5')
    .attr('d', line);
  }

  plotLegend(dataset)
  {

  }

}