
class ScatterPlot extends BaseGraph
{
  constructor(divHistogram, graphConfig)
  {
    super(divHistogram, graphConfig);
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
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.cScale = d3.scaleOrdinal();
  }

  initEvents()
  {
    
  }

  preprocessDataset(dataset)
  {
    dataset.makes = dataset.map((data) => {
      return data.Make;
    });

    dataset.makes = dataset.makes.filter((data, index) => {
      return dataset.makes.indexOf(data) === index;
    });

    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;

    // x Axi Horsepower
    dataset.forEach((data)=>{
      const horsepower = Number(data[this.axiNameX]);
      if (horsepower < minValue)
      {
        minValue = horsepower;
      }
      if (horsepower > maxValue)
      {
        maxValue = horsepower;
      }
    });

    dataset.xMinValue = Math.round(minValue * 0.8);
    dataset.xMaxValue = maxValue;

    minValue = Number.MAX_VALUE;
    maxValue = Number.MIN_VALUE;

    // y Axi Cylinders
    dataset.forEach((data) => {
      const cylinders = Number(data[this.axiNameY]);
      if (cylinders < minValue)
      {
        minValue = cylinders;
      }
      if (cylinders > maxValue)
      {
        maxValue = cylinders;
      }
    });

    dataset.yMinValue = Math.round(minValue * 0.8);
    dataset.yMaxValue = maxValue;

    // const horsepowerList = dataset.map((data)=>{
    //   return Number(data.Horsepower);
    // });
    // console.log(horsepowerList);

    
    // console.log(dataset.makes);
    // console.log(dataset);
  }

  configureAxis(dataset)
  {
    // Configurando eixoX
    this.xScale
        .domain([dataset.xMinValue, dataset.xMaxValue])
        .range([0, this.cw]);
    this.yScale
        .domain([dataset.yMinValue, dataset.yMaxValue])
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
  }

  showDataset(dataset)
  {
    this.graphArea = this.dataGroup
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => {return this.xScale(d[this.axiNameX]);})
        .attr('cy', (d) => {return this.yScale(d[this.axiNameY]);})
        .attr('r', 5)
        .style('fill', (d) => {return this.cScale(d.Make);} )
  }

  plotLegend(dataset)
  {
    const legendScale = d3.scaleBand()
          .domain(dataset.makes)
          .range([20,this.ch]);
    
    this.mainSVG
        .append('text')
        .attr('transform', `translate(${this._graphConfig.dims.width - this._graphConfig.margins.right + 30},${this._graphConfig.margins.top})`)
        .text('Graph Legend');
    this.legendGroup
        .selectAll('circle')
        .data(dataset.makes)
        .enter()
        .append('circle')
        .attr('cx',`${10}`)
        .attr('cy', (d)=>{return legendScale(d);})
        .attr('r', 5)
        .style('fill', (d)=>{return this.cScale(d)})
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