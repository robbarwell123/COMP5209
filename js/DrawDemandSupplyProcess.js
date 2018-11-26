function DrawDemandSupplyProcess()
{
	var oLayoutConfig=new Object();
	oLayoutConfig.iNodeWidth=20;
	oLayoutConfig.iNodePadding=20;
	oLayoutConfig.iOffsetWidth=60;
	
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

	var oCurrUser;
	
	var myProcessZoom=d3.zoom()
		.on("zoom",fProcessZoomHandler);
	
	function Render(){}

	Render.newProcess = function () {
		var divProcessStyle=window.getComputedStyle(document.getElementById("idDemandSupplyProcess"), null);

		iNodeWidth = parseInt(divProcessStyle.getPropertyValue('--iNodeWidth'));
		iNodePadding = parseInt(divProcessStyle.getPropertyValue('--iNodePadding'));

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
				.nodeAlign(d3.sankeyJustify)
				.nodeId(function(myNode){return myNode.iUserID});
			
			Render.update();	

			fCenterSankeyNode();
		});

		return Render;
	};
	
	function fCenterSankeyNode()
	{
		var iY=-(document.getElementById('idDemandSupplyProcessContent').clientHeight/2);
		var iX=0;
		
		myProcessCanvas.transition()
			.duration(iDuration)
			.call(myProcessZoom.transform, d3.zoomIdentity.translate(iX,iY));
	}
		
	Render.update = function()
	{	
		var fGenLinks = d3.linkHorizontal();
	
		myProcessCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);

		oLayoutConfig.iHeight=iUnitHeight*2;
		oLayoutConfig.iWidth=iWidth;

		var dataLayout=fModifiedSankeyLayout(dData,iNodeID,oLayoutConfig);
		
		myLinks=myProcessGraphics.selectAll(".ProcessLink")
			.data(dataLayout.links, function(myLink){return myLink.id});
		
		myLinks.exit().remove();
		
		myNewLinks=myLinks.enter()
			.append("path")
				.attr("id",function(myLink){return myLink.classid;})
				.attr("class", function(myLink){
					return myLink.sUnique=="Multiple" ? "ProcessLink FlowThrough" : "ProcessLink Unique";
				})
				.style("stroke-width", function(myLink){return myLink.iStroke;})
				.on("mouseleave",fHideProcessLinks)
				.on("mouseenter",fShowProcessLinks);			

		myProcessGraphics.selectAll(".ProcessLink")
			.attr("d",fGenLinks);
			
		myNodes=myProcessGraphics.selectAll(".ProcessNode")
			.data(dataLayout.nodes, function(myNode){return myNode.id});
		
		myNodes.exit().remove();

		myNewNodes=myNodes.enter()
			.append("g")
				.attr("id",function(myNode){return myNode.data.iUserID})
				.attr("class","ProcessNode");
		
		myNewNodes.append("rect")
			.attr("height", function(myNode){return myNode.height;})
			.attr('width', function(myNode){return myNode.width;});

		myNewNodes.append("text")
			.text(function(myNode){return myNode.data.sLastname;})
			.attr("y", function(myNode){return myNode.id==iNodeID ? -5 : (myNode.height)/2})
			.attr("x", function(myNode){
				if(myNode.id==iNodeID)
				{
					return (myNode.width/2)-(this.getBBox().width/2);
				}else if(myNode.id.charAt(0)=="T")
				{
					return (iNodeWidth+5);
				}else
				{
					return -1*(this.getBBox().width+5);
				}
			});

		myProcessGraphics.selectAll(".ProcessNode").transition().duration(iDuration)
			.attr("transform",function(myNode){return "translate("+myNode.x+","+myNode.y+")";});
			
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