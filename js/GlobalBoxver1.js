var iWidth=document.getElementById("GLOBAL_CONTENT").offsetWidth;
var iHeight=document.getElementById("GLOBAL_CONTENT").offsetHeight-document.getElementById("GLOBAL_OPTS").offsetHeight;

var svgCanvas = d3.select("#GLOBAL_CONTENT").append("svg")
	.attr("width", iWidth)
	.attr("height", iHeight)
  .append("g")
	.attr("transform", "translate(10,10)");

var myOrgChart = d3.layout.tree()
	.size([iHeight, iWidth]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var i=0;

d3.json("GetOrgChart.php", function(data) {

  // Compute the new tree layout.
  var nodes = myOrgChart.nodes(data).reverse();
  var links = myOrgChart.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Declare the nodes…
  var node = svgCanvas.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; });

  nodeEnter.append("circle")
	  .attr("r", 5)
	  .style("fill", "steelblue");

  nodeEnter.append("text")
	  .attr("y", function(d) { 
		  return d.children || d._children ? -18 : 18; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", "middle")
	  .text(function(d) { return d.value; })
	  .style("fill-opacity", 1);

  // Declare the links…
  var link = svgCanvas.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
	  .attr("class", "link")
		.attr("fill", "none").attr("stroke", "#ADADAD")
	  .attr("d", diagonal);
})
