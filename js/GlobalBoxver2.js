var margin = {
  top: 20,
  right: 120,
  bottom: 20,
  left: 120
},
    width = 600 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree().size([height, width]);
var diagonal = d3.svg.diagonal()
.projection(function (d) {
  return [d.y, d.x];
});

var svg = d3.select("#GLOBAL_CONTENT").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var node = {
  name: 'Root',
  type: 'root',
  children: [{
    name: 'A',
    type: 'child'
  },{
    name: 'B',
    type: 'child'
  },{
    name: 'C',
    type: 'child'
  }]
};

root = node;
root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse);
update(root);

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function update(source) {
  var newHeight = Math.max(tree.nodes(root).reverse().length * 20, height);

  d3.select("#GLOBAL_CONTENT svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", newHeight + margin.top + margin.bottom);

  tree = d3.layout.tree().size([newHeight, width]);

  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  var node = svg.selectAll("g.node")
  .data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function (d) {
    return "translate(" + source.y0 + "," + source.x0 + ")";
  })
  .on("click", click);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function (d) {
    return d.endNode ? "orange" : "lightsteelblue";
  });

  nodeEnter.append("text")
    .attr("x", function (d) {
    return 15;
  })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
    return "start";
  })
    .text(function (d) {
    return d.name;
  })
    .style("fill-opacity", 1e-6);

  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function (d) {
    return "translate(" + d.y + "," + d.x + ")";
  });

  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function (d) {
    return d.endNode ? "orange" : "lightsteelblue";
  });

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function (d) {
    return "translate(" + source.y + "," + source.x + ")";
  })
  .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  var link = svg.selectAll("path.link")
  .data(links, function (d) {
    return d.target.id;
  });

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
    var o = {
      x: source.x0,
      y: source.y0
    };
    return diagonal({
      source: o,
      target: o
    });
  });

  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  link.exit().transition()
    .duration(duration)
    .attr("d", function (d) {
    var o = {
      x: source.x,
      y: source.y
    };
    return diagonal({
      source: o,
      target: o
    });
  })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  console.log(d);

  if (d.children) {
    d._children = d.children;
    d.children = null;
    update(d);
  } else {
    if (d.type !== 'root' && !d.endNode) {
      var children = [];
      for (var i = 0; i < Math.ceil(Math.random() * 1000); i++) {
        children.push({
          name: i,
          type: 'child',
          endNode: true
        });
      }

      d.children = children;
      update(d);
    }
  }
}