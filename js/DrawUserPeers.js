function DrawUserPeersChart()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyUserPeersChart";
	var iNodeID=0;

	var myPeersCanvas;
	var myPeersGraphics;
	
	var dCurrData;
	var iBarHeight=30;
	var iBarPad=2;
	var iYOffset=-iBarHeight;
	
	function Render(){}

	Render.newBarChart = function () {
		sJSONLoc=sJSONLoc+iNodeID;
				
		myPeersCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);
		
		myPeersGraphics=myPeersCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			dCurrData=data;

			Render.update();		
		});

		return Render;
	};
	
	Render.update = function()
	{
		myPeersCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);

		var xAxes = d3.scaleLinear().rangeRound([0, iWidth]);				
		var yAxes = d3.scaleLinear().rangeRound([0, iHeight]);				

		yAxes.domain(dCurrData.map(function(myNode) { return myNode.sLastname; }));
		xAxes.domain([0, d3.max(dCurrData, function(myNode) { return myNode.iEmailCount; })]);

		var myBars=myPeersCanvas.selectAll(".PeerStatBars")
			.data(dCurrData,function(myNode){return myNode.iUserID;})

		var myNewBars=myBars.enter().append("g")
			.attr("class",".PeerStatBars")
			.on("click",fUserPeersClick);
		
		iYOffset=-iBarHeight;
		myNewBars.append("rect")
				.attr("y", function(myNode) { return iYOffset+=iBarHeight+iBarPad; })
				.attr("height", iBarHeight)
				.attr("width", function(myNode) { return xAxes(myNode.iEmailCount); })
				.attr("fill", function(myNode) {if(myNode.iUserID==oCurrNode.data.iUserID){return '#FBB4AE'}else{return '#B3CDE3'}} );

		iYTextOffset=-iBarHeight/4;
				
		myNewBars.append("text")
				.attr("x",5)
				.attr("y", function(myNode) { return iYTextOffset+=iBarHeight+iBarPad; })
				.text(function(d) {	return d.sLastname+" ("+d.iEmailCount+")"});

		var myUpdateBars=myNewBars.merge(myBars);
		iYOffset=-iBarHeight;
		myUpdateBars.selectAll(".PeerStatBars").transition().duration(iDuration)
			.attr("width", function(myNode) { return xAxes(myNode.iEmailCount); });
				
		return Render;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}
	
	Render.size = function()
	{
		var divStatsStyle=window.getComputedStyle(document.getElementById("idStats"), null);
		iWidth=parseFloat(divStatsStyle.getPropertyValue("width"));
		iHeight=parseFloat(divStatsStyle.getPropertyValue("height"));

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