function DrawDemandSupplyProcess()
{
	var iNodeWidth=0;
	var iNodePadding=0;
	
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="data/GetProcessData.php?iUserID=";
	var sContentLoc="";
	var sID="idMyUserPeersChart";
	var iNodeID=0;

	var myProcessCanvas;
	var myProcessGraphics;
	
	var dData;
	var myProcessData;
	var mySankey;

	var myProcessZoom=d3.zoom()
		.on("zoom",fProcessZoomHandler);
	
	function Render(){}

	Render.newProcess = function () {
		var divProcessStyle=window.getComputedStyle(document.getElementById("idDemandSupplyProcess"), null);

		iNodeWidth = divProcessStyle.getPropertyValue('--iNodeWidth');
		iNodePadding = divProcessStyle.getPropertyValue('--iNodePadding');

		sJSONLoc=sJSONLoc+iNodeID;
		
		myProcessCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID)
			.call(myProcessZoom);
			
		myProcessGraphics=myProcessCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			dData=data;
			
			mySankey = d3.sankey()
				.nodeWidth(iNodeWidth)
				.nodePadding(iNodePadding)
				.nodeId(function(myNode){return myNode.iUserID});
			
			Render.update();		
		});

		return Render;
	};
	
	Render.update = function()
	{	
		myProcessCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);

		mySankey
			.size([iWidth, 2000]);
	
		myProcessData = mySankey.nodes(dData.nodes).links(dData.links)();
		
		myLinks=myProcessGraphics.selectAll(".ProcessLink")
			.data(myProcessData.links, function(myNode){return myNode.source+myNode.target});
		
		myLinks.exit().remove();
		
		myLinks.attr("d",d3.sankeyLinkHorizontal());
		
		myNewLinks=myLinks.enter()
			.append("path")
				.attr("class", function(myNode){return "ProcessLink "+myNode.sClass;})
				.attr("d", d3.sankeyLinkHorizontal())
				.style("stroke-width", function(myNode){return myNode.width;})
				.sort((a, b) => b.dy - a.dy)
				.on("mouseleave",fHideProcessLinks)
				.on("mouseenter",fShowProcessLinks);
		
		myNodes=myProcessGraphics.selectAll(".ProcessNode")
			.data(myProcessData.nodes, function(myNode){return myNode.id});
		
		myNodes.exit().remove();
		
		myNodes.attr("transform",function(myNode){return "translate("+myNode.x0+","+myNode.y0+")";});
		
		myNewNodes=myNodes.enter()
			.append("g")
				.attr("class","ProcessNode")
				.attr("transform",function(myNode){return "translate("+myNode.x0+","+myNode.y0+")";});
		
		myNewNodes.append("rect")
			.attr("height", function(myNode){return (myNode.y1 - myNode.y0)>0 ? (myNode.y1 - myNode.y0) : 1;})
			.attr('width', function(myNode){return myNode.x1 - myNode.x0});

		myNewNodes.append("text")
			.text(function(myNode){return myNode.sLastname;});
		
		return Render;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}

	Render.graphics = function() {
		return myProcessGraphics;
	};
	
	Render.size = function()
	{
		var divProcessStyle=window.getComputedStyle(document.getElementById("idDemandSupplyProcessContent"), null);
		iWidth=parseFloat(divProcessStyle.getPropertyValue("width"));
		iHeight=parseFloat(divProcessStyle.getPropertyValue("height"));

		return Render;
	}

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

function fProcessZoomHandler(myNode)
{
	panelDemandSupplyProcess.graphics().attr("transform", d3.event.transform);
}