function DrawUserLinksChart()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyUserPeersChart";
	var iNodeID=0;

	function Render(){}

	Render.draw = function () {
		sJSONLoc=sJSONLoc+iNodeID;
				
		var d3Canvas = d3.select(sContentLoc).append("svg")
			.attr("width", iWidth)
			.attr("height", iHeight)
			.attr("id",sID)
			.append("g")
				.attr("transform", "translate(10, 10)");

		var xAxes = d3.scaleLinear().rangeRound([0, iWidth]);				
		var yAxes = d3.scaleLinear().rangeRound([0, iHeight]);				

		d3.json(sJSONLoc).then(function(data) {


			yAxes.domain(data.map(function(myNode) { return myNode.sLastname; }));
			xAxes.domain([0, d3.max(data, function(myNode) { return myNode.iEmailCount; })]);

			var iBarHeight=30;
			var iBarPad=2;
			var iYOffset=-iBarHeight;
			
			var myBars=d3Canvas.selectAll(".bar")
				.data(data)
				.enter().append("g")
			
			myBars.append("rect")
					.attr("y", function(myNode) { return iYOffset+=iBarHeight+iBarPad; })
					.attr("height", iBarHeight)
					.attr("width", function(myNode) { return xAxes(myNode.iEmailCount); })
					.attr("fill", 'blue');

			iYOffset=-iBarHeight/4;
					
			myBars.append("text")
					.attr("x",5)
					.attr("y", function(myNode) { return iYOffset+=iBarHeight+iBarPad; })
					.text(function(d) {	return d.sLastname+" ("+d.iEmailCount+")"})
					.style("fill", "white")
	
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

var myUserLinks = DrawUserLinksChart().data("GetUserPeers.php?iUserID=").nodeid(4).width(document.getElementById('STATS').offsetWidth).height(document.getElementById('STATS').offsetHeight).canvas("#STATS").draw();
