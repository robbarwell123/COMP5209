function DrawUserLinksChart()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyUserLinksChart";
	var iNodeID=0;

	function Render(){}

	Render.draw = function () {
		sJSONLoc=sJSONLoc+iNodeID;
		
		var mapColor = d3.scaleOrdinal()
			.range(d3.schemePastel1.map(function(c) { c = d3.rgb(c); return c; }));		
		
		var d3Canvas = d3.select(sContentLoc).append("svg")
			.attr("width", iWidth)
			.attr("height", iHeight)
			.attr("id",sID)
			.append("g")
				.attr("transform", "translate(10, 10)");

		var myTreemap = d3.treemap()
			.tile(d3.treemapResquarify)
			.size([iWidth, iHeight])
			.round(true)
			.paddingInner(3);

		d3.json(sJSONLoc).then(function(data) {
			var myRoot=d3.hierarchy(data)
				.sum(function(myNode) {return myNode.iNodeSize})
				.sort(function(a, b) { return b.height - a.height || b.value - a.value; });

			myTreemap(myRoot);

			var myTreeCells = d3Canvas.selectAll("g")
				.data(myRoot.leaves())
				.enter().append("g")
					.attr("transform", function(myNode) { return "translate(" + myNode.x0 + "," + myNode.y0 + ")"; });

			myTreeCells.append("rect")
				.attr("id", function(myNode) { return myNode.data.iNodeID; })
				.attr("width", function(myNode) { return myNode.x1 - myNode.x0; })
				.attr("height", function(myNode) { return myNode.y1 - myNode.y0; })
				.attr("fill", function(myNode) { while (myNode.depth > 1) myNode = myNode.parent; return mapColor(myNode.data.sNodeName); });

			myTreeCells.append("text")
				.selectAll("tspan")
					.data(function(myNode) { return myNode.data.sNodeLastname.split(/(?=[A-Z][^A-Z])/g); })
				.enter().append("tspan")
					.attr("x", 4)
					.attr("y", function(d, i) { return 13 + i * 10; })
					.text(function(myNode) { return myNode; });
		});

		return Render;
	};

	Render.width = function(iValue) {
		if(!arguments.length) return iWidth;
		iWidth=iValue;
		return Render;
	};

	Render.height = function(iValue) {
		if(!arguments.length) return iHeight;
		iHeight=iValue;
		return Render;
	};

	Render.data = function(sValue) {
		if(!arguments.length) return sJSONLoc;
		sJSONLoc=sValue;
		return Render;
	};

	Render.canvas = function(sValue) {
		if(!arguments.length) return sContentLoc;
		sContentLoc=sValue;
		return Render;
	};

	Render.id = function(sValue) {
		if(!arguments.length) return sID;
		sID=sValue;
		return Render;
	};

	Render.nodeid = function(iValue) {
		if(!arguments.length) return iNodeID;
		iNodeID=iValue;
		return Render;
	};

	return Render;
}