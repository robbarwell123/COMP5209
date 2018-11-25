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
	var myPeerData;

	var iBarWidth=20;
	
	function Render(){}

	Render.newTreemap = function () {
		sJSONLoc=sJSONLoc+iNodeID;

		myLinksCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);

		myLinksGraphics = myLinksCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			myPeerData=data;

			Render.update();
		});

				
		return Render;
	};
	
	Render.update = function()
	{
		myLinksCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);

		var x = d3.scaleBand().range([0, iWidth]).padding(0.1);
		var y = d3.scaleLinear().range([0, iHeight]);				

		x.domain(myPeerData.map(function(myNode) { return myNode.sLastname; }));
		y.domain([0, myPeerData[0].iEmailCount]);
		
		var myPeerBars = myLinksGraphics.selectAll(".SupplyOrgNodes")
			.data(myPeerData, function(myNode){return myNode.iUserID;});


		myPeerBars.enter()
			.append("rect")
				.attr("class",function(myNode){return myNode.iUserID==oCurrNode.data.iUserID ? "SupplyOrgNodes Selected" : "SupplyOrgNodes"})
				.on("click",fGlobalNodeClick);

		myPeerBars.enter()
			.append("text")
				.attr("class","SupplyOrgNodesTitle")
				.text(function(myNode){return myNode.sLastname});

		myLinksGraphics.selectAll(".SupplyOrgNodes").transition().duration(iDuration)
			.attr("x", function(myNode) { return x(myNode.sLastname); })
			.attr("width", x.bandwidth())
			.attr("y", function(myNode) { return iHeight - y(myNode.iEmailCount); })
			.attr("height", function(myNode) { return y(myNode.iEmailCount); });
				
		myLinksGraphics.selectAll(".SupplyOrgNodesTitle").transition().duration(iDuration)
			.attr("x", function(myNode) { return x(myNode.sLastname)+(x.bandwidth()/2)-(this.getBBox().width/2); })
			.attr("y", function(myNode) {return iHeight-this.getBBox().height;});
		
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