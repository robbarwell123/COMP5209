function DrawOrgChart()
{
	var iWidth=2000;
	var iHeight=2000;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyOrgChart";
	
	function Render(){}

	Render.draw = function () {
		var d3Canvas = d3.select(sContentLoc).append("svg")
			.attr("width", iWidth)
			.attr("height", iHeight)
			.attr("id",sID)
			.call(d3.zoom().on("zoom", function () {
				d3Canvas.attr("transform", d3.event.transform)
			}))
			.append("g")
				.attr("transform", "translate(10, 10)");
			
		var d3OrgChart = d3.tree().size([iWidth,iHeight]);	
			
		d3.json(sJSONLoc).then(function(data) {
			var myRoot=d3.hierarchy(data);
			myRoot=d3OrgChart(myRoot);
			
			var myLinks = d3Canvas.selectAll(".link")
				.data(myRoot.descendants().slice(1))
				.enter().append("path")
					.attr("class", "OrgChartLinks")
					.attr("d", function(d) {
						return "M" + d.x + "," + d.y + "C" + d.x + "," + (d.y + d.parent.y) / 2 + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2 + " " + d.parent.x + "," + d.parent.y;
					});
		   
			var myNodes = d3Canvas.selectAll(".node")
				.data(myRoot.descendants()).enter()
				.append("g")
					.attr("class", "OrgChartNode")
					.attr("transform", function(myNodes){ return "translate(" + myNodes.x + "," + myNodes.y + ")"; })
					.on("click",fNodeClick);
					
			myNodes.append("circle")
				.attr("r", 5)
				.attr("fill", "steelblue")
			myNodes.append("text")
				.text(function(myNodes){ return myNodes.data.sLastname; });


		  d3Canvas.selectAll(".link")
			  .data(myLinks).enter()
			.append("path")
			  .attr("class", "link")
			  .attr("fill", "none").attr("stroke", "#ADADAD");		
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
	
	return Render;
}

function fNodeClick(oData)
{
	alert(oData.data.sEmail);
}

var myOrgChart = DrawOrgChart().data("GetOrgChart.php").canvas("#GLOBAL_CONTENT").draw();
