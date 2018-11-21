function DrawSupplyOrg()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="data/GetSupplyOrgData.php?iUserID=";
	var sContentLoc="";
	var sID="idSupplyOrgChart";
	var iNodeID=0;
	var sFilter;
	
	var myLinksCanvas;
	var myLinksGraphics;
	var myTreemap;
	var myPeerData;
	var myTreemap;
		
	function Render(){}

	Render.newTreemap = function () {
		sJSONLoc=sJSONLoc+iNodeID;
				
		myLinksCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);

		myLinksGraphics = myLinksCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			myPeerData=d3.hierarchy(data);

			myTreemap = d3.treemap()
				.tile(d3.treemapResquarify)
				.round(true)
				.paddingInner(3);			

			Render.update();
		});

				
		return Render;
	};
	
	Render.update = function()
	{
		myLinksCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);

		myTreemap
			.size([iWidth, iHeight]);
			
		myPeerData
			.sum(function(myNode) {return myNode.iEmailCount})
			.sort(function(a, b) { return b.height - a.height || b.value - a.value; });

		myTreemap(myPeerData);
		
		var myTreeCells = myLinksGraphics.selectAll(".SupplyOrgNodes")
			.data(myPeerData.leaves(), function(myNode){return myNode.data.iUserID;});

		var NewTreeNodes=myTreeCells.enter()
			.append("g")
				.attr("class","SupplyOrgNodes")
				.attr("transform", function(myNode) { return "translate(" + myNode.x0 + "," + myNode.y0 + ")"; });
	
		NewTreeNodes.append("rect")
			.attr("width", function(myNode) {return myNode.x1 - myNode.x0; })
			.attr("height", function(myNode) { return myNode.y1 - myNode.y0; })
			.attr("class", function(myNode){return myNode.data.iUserID==oCurrNode.data.iUserID ? "selected" : null;})
			.on("click",fGlobalNodeClick);

		NewTreeNodes.append("text")
				.text(function(myNode) { return myNode.data.sLastname; })
				.attr("x", 10)
				.attr("y", function(myNode) {return this.getBBox().height+4;});

		var UpdateTreeNodes=NewTreeNodes.merge(myTreeCells);

		d3.selectAll(".SupplyOrgNodes").transition().duration(iDuration)
			.attr("transform", function(myNode) { return "translate(" + myNode.x0 + "," + myNode.y0 + ")"; });

		UpdateTreeNodes.selectAll("rect").transition().duration(iDuration)
			.attr("width", function(myNode) { return myNode.x1 - myNode.x0; })
			.attr("height", function(myNode) { return myNode.y1 - myNode.y0; });

		var OldTreeNodes = myTreeCells.exit().remove();							
		
		return Render;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}
	
	Render.size = function()
	{
		var divLinksStyle=window.getComputedStyle(document.getElementById("idSupplyOrg"), null);
		iWidth=parseFloat(divLinksStyle.getPropertyValue("width"));
		iHeight=parseFloat(divLinksStyle.getPropertyValue("height"));

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

	Render.filter = function(sValue) {
		if(!arguments.length) sFilter=null;
		sFilter=sValue;
		return Render;
	};
	
	Render.nodeid = function(iValue) {
		if(!arguments.length) return iNodeID;
		iNodeID=iValue;
		return Render;
	};

	return Render;
}