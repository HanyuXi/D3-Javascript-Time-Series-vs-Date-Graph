/*var data = ["1995-12-17T00:00:00","1995-12-18T00:00:00","1995-12-19T00:00:00","1995-12-20T00:00:00","1995-12-21T00:00:00","1995-12-22T00:00:00"];
var data2 = []
data.forEach(function(i){
    data2.push(new Date(i))
})*/
//Parse the data

//console.log(window.shabi.timegraph_results.time)
var data = {date:[],time:[]}
var rescue = {date:[],time:[]}
var technique_score = window.shabi.timegraph_results.technique_score
//Controller Data
//I used Python Flask as my backend so I named a variable shabi to take the data passed from python through Jinja2
//.timegraph is just the dictionary key name.

var data2 = {date:window.shabi.timegraph_results.date, time:window.shabi.timegraph_results.time}
data2.time.forEach(function(d){
  d = "1995-12-17T"+d
  time_interval = new Date(d)
  data.time.push(new Date(1900,1,1,time_interval.getHours(),time_interval.getMinutes(),time_interval.getSeconds()))
})

data2.date.forEach(function(i){
    data.date.push(new Date(i))
})

time_array = data.time
date_array = data.date
//Controller

console.log(technique_score)
//Rescue Data
//Parse the data
var data3 = {date:["12-16","12-16"], time:["2018-02-23T01:45:00", "2018-02-23T03:45:00"]}
data3.date.forEach(function(i){
    rescue.date.push(new Date(i))
})

data3.time.forEach(function(i){
   //data.time.push(moment({hour: new Date(i).getHours(), minute: new Date(i).getMinutes(), seconds: new Date(i).getSeconds()}).toDate())
   time_interval2 = new Date(i)

rescue.time.push(new Date(1900,1,1,time_interval2.getHours(),time_interval2.getMinutes(),time_interval2.getSeconds()))
})
time_array2 = rescue.time
date_array2 = rescue.date

colordata = [
        {offset: "0%", color: "#FF0000"},
        {offset: "25%", color: "#0021FF"},
        {offset: "50%", color: "#2c7bb6"},
        {offset: "75%", color: "#00FFBC"},
        {offset: "100%", color: "A6FF00"}
      ]

console.log(time_array)
console.log(date_array)
// margin right is the colorscale
var margin = {top: 10, right: 160, bottom: 30, left: 80},
    width = 660 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var y = d3.scaleTime()
    .domain([new Date(1900,1,1,0,0,0),new Date(1900,1,1,23,59,59)])
    .range([0, height]);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(d3.timeHour,3)
    .tickFormat(d3.timeFormat('%H:%M'));

var x = d3.scaleTime()
    .domain([d3.min(date_array),d3.max(date_array)])
    //.domian(d3.extent(data.date))
    .range([0,width]);
//It's for the legend
var colorscale = d3.scaleLinear()
    .domain([0,100])
    .range(["#FF0000",
        "#0021FF",
        "#00FFBC",
       "#A6FF00"
      ])
var legendaxis = d3.svg.axis
var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(d3.timeDay,1)
    .tickFormat(d3.timeFormat('%m/%d'))

var svg = d3.select("#timeseries").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var legend = svg.append('defs')
    .append('linearGradient')
    .attr("id", "legend1")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")

var legendText = svg.selectAll('text').data(colordata)
    .enter()
    .append("text")
    .attr("x",535)
    .attr("y", function(d,i){
        return 40*i+9;
    })
    .text(function(d){
        return d.offset;
    })
//Color gradient
legend.selectAll('stop')
  .data(colordata)
  .enter()
  .append('stop')
  .style('stop-color',function(d) { return d.color; })
  .attr('offset' , function(d) { return d.offset; });


//draw the graph
svg.append('rect')
  .attr("transform", "translate(0,0)")
  .attr('x', 480)
  .attr('y', 10)
  .attr('width', 50)
  .attr('height', 150)
  .style('fill', "url(#legend1)");

    
svg.selectAll(".dot")
        .data(time_array)
        .enter().append("circle")
        .attr("r" , 6.5)
        .style("fill", function(d,i){return colorscale(technique_score[i])})
        .attr("cx", function(d,i) { return x(date_array[i]);})
        .attr("cy", function(d,i) { return y(time_array[i]);});
svg.append("g")
    //.attr("class", "x axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);
    svg.append("g")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);
 

svg.selectAll(".dot")
        .data(time_array2)
        .enter().append("circle")
        .attr("r" , 7.5)
        .style("fill", "red")
        .attr("cx", function(d,i) { return x(date_array2[i]);})
        .attr("cy", function(d,i) { return y(time_array2[i]);});



// gridlines in x axis function
function make_x_gridlines() {       
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {       
    return d3.axisLeft(y)
        .ticks(5)
}
 // add the X gridlines
  svg.append("g")           
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")           
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

