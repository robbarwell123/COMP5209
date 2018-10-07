var chart = d3.select("#CONTENT").append("svg")
    .attr("width", 800)
    .attr("height", 800)
  .append("g")
  	.attr("transform", "translate(50, 50)");

var tree = d3.layout.tree()
	.size([800, 800]);

d3.json("GetOrgChart.php", function(data) {
  var nodes = tree.nodes(data); // create data nodes suitable for tree structure
  var links = tree.links(nodes); // create links to connect source(parent) and target(child) nodes
  
  var nodes = chart.selectAll(".node")
  	  .data(nodes).enter()
  	.append("g")
  	  .attr("class", "node")
  	  .attr("transform", function(d){ return "translate(" + d.y + "," + d.x + ")"; }); // flip x and y of nodes

  nodes.append("circle")
  	  .attr("r", 5)
  	  .attr("fill", "steelblue");
  nodes.append("text")
  	  .text(function(d){ return d.name; });

  var diagonal = d3.svg.diagonal()
  	  .projection(function(d){ return [d.y, d.x]; }); // flip x and y of links

  chart.selectAll(".link")
  	  .data(links).enter()
  	.append("path")
  	  .attr("class", "link")
  	  .attr("fill", "none").attr("stroke", "#ADADAD")
  	  .attr("d", diagonal);
});
