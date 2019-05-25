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

    const xMin = d3.min(dataset.info[0].value, (d) => {
      return d.date;
    });

    const xMax = d3.max(dataset.info[0].value, (d) => {
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
    dataset.info.forEach((dataInfo)=>{
      this.appendData(dataInfo);
    });    
  }

  appendData(dataInfo)
  {
    const line = d3.line()
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
        .attr('id', `priceChart-${dataInfo.key}`)
        .attr('stroke', `${lineColor}`)
        .attr('stroke-width', '1.5')
        .attr('d', line);
  }

  plotLegend(dataset)
  {
    // console.log(dataset);
    const legendScale = d3.scaleBand()
                          .domain(dataset.info.map(d => {return d.key;}))
                          .range([20,this.ch]);
    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 40},${this._graphConfig.margins.top})`)
        .text('Graph Legend');

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