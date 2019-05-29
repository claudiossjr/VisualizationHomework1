
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

  brushed()
  {        
    var s = d3.event.selection,
        x0 = s[0][0],
        y0 = s[0][1],
        x1 = s[1][0],
        y1 = s[1][1];

    this.dataGroup
        .selectAll('circle')
        .style("stroke-width", (d) =>
        {
          if ((this.xScale(d[this.axiNameX]) >= x0 && this.xScale(d[this.axiNameX]) <= x1) && 
              (this.yScale(d[this.axiNameY]) >= y0 && this.yScale(d[this.axiNameY]) <= y1))
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
    this.brush = d3.brush()
        .extent([[0, 0], [this.cw, this.ch]])
        .on("start brush", this.brushed.bind(this));

    this.dataGroup
        .append("g")
        .attr("class", "brush")
        .attr('width', this.cw)
        .call(this.brush);   
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

    // x Axi xAxiValue
    dataset.forEach((data)=>{
      const xAxiValue = Number(data[this.axiNameX]);
      if (xAxiValue < minValue)
      {
        minValue = xAxiValue;
      }
      if (xAxiValue > maxValue)
      {
        maxValue = xAxiValue;
      }
    });

    dataset.xMinValue = Math.round(minValue * 0.8);
    dataset.xMaxValue = maxValue;

    minValue = Number.MAX_VALUE;
    maxValue = Number.MIN_VALUE;

    // y Axi yAxiValue
    dataset.forEach((data) => {
      const yAxiValue = Number(data[this.axiNameY]);
      if (yAxiValue < minValue)
      {
        minValue = yAxiValue;
      }
      if (yAxiValue > maxValue)
      {
        maxValue = yAxiValue;
      }
    });

    dataset.yMinValue = Math.round(minValue * 0.8);
    dataset.yMaxValue = maxValue;
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
  }

  showDataset(dataset)
  {
    this.dataGroup
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => {return this.xScale(d[this.axiNameX]);})
        .attr('cy', (d) => {return this.yScale(d[this.axiNameY]);})
        .attr('r', 5)
        .style('fill', (d) => {return this.cScale(d.Make);} )
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