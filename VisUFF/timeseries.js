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