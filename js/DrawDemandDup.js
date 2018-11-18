function DrawDemandDup()
{
	var iWidth=900;
	var iHeight=1000;
	var sJSONLoc="data/GetDemandDupData.php?";
	var sContentLoc="";
	var sID="idSupplyDupChart";
	var iSourceNodeID=0;
	var iTargetNodeID=0;
	
	var mySupplyDupTable;
	var myData;
		
	var myDemandDupCanvas;
	var myDemandDupGraphics;
	
	var iBarHeight=30;
	var iBarPad=2;
	var iYOffset=0;
	
	function Render(){}

	Render.newDemandDup = function () {
		sJSONLoc=sJSONLoc+"iSourceUserID="+iSourceNodeID+"&iTargetUserID="+iTargetNodeID;

		myDemandDupCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);
			
		myDemandDupGraphics=myDemandDupCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			myData=data;
			
			iHeight=(myData.length+1)*(iBarHeight+iBarPad);

			Render.update();
		});

				
		return Render;
	};
	
	Render.update = function()
	{
		myDemandDupCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);
			
		var xAxes = d3.scaleLinear().rangeRound([0, iWidth/2]);				
		var yAxes = d3.scaleLinear().rangeRound([0, iHeight]);				

		var xZero=iWidth/2;

		yAxes.domain(myData.map(function(myNode) { return myNode.sLastname; }));
		xAxes.domain([0, Math.max(d3.max(myData, function(myNode) { return parseInt(myNode.iSourceEmailCount); }),d3.max(myData, function(myNode) { return parseInt(myNode.iTargetEmailCount); }))]);

		iYTextOffset=iBarHeight/2;
		
		myDemandDupCanvas.selectAll(".DemandDupBarsTitles").remove();
		
		myDemandDupGraphics.append("text")
				.attr("class","DemandDupBarsTitles")
				.text(oCurrNode.data.sLastname)
				.attr("x",function(myNode) {return (iWidth/4)-(this.getBBox().width/2);})
				.attr("y", iYTextOffset);

		myDemandDupGraphics.append("text")
				.attr("class","DemandDupBarsTitles")
				.text(oDupCompareNode.sLastname)
				.attr("x",function(myNode) {return (iWidth/4)*3-(this.getBBox().width/2);})
				.attr("y", iYTextOffset);
		
		var myBars=myDemandDupCanvas.selectAll(".DemandDupBars")
			.data(myData,function(myNode){return myNode.sLastname;})

		var myNewBars=myBars.enter().append("g")
			.attr("class","DemandDupBars")
			
		iYOffset=0;
		myNewBars.append("rect")
				.attr("class","DemandDupBarsSource")
				.attr("height", iBarHeight);
		
		myDemandDupCanvas.selectAll(".DemandDupBarsSource")
				.attr("y", function(myNode) { return iYOffset+=iBarHeight+iBarPad; })
				.attr("x",function(myNode) { return xZero-xAxes(myNode.iSourceEmailCount); })
				.attr("width", function(myNode) { return xAxes(myNode.iSourceEmailCount); });

		iYOffset=0;
		myNewBars.append("rect")
				.attr("class","DemandDupBarsTarget")
				.attr("height", iBarHeight);
				
		myDemandDupCanvas.selectAll(".DemandDupBarsTarget")
				.attr("y", function(myNode) { return iYOffset+=iBarHeight+iBarPad; })
				.attr("x",xZero)
				.attr("width", function(myNode) { return xAxes(myNode.iTargetEmailCount); });
				
		iYTextOffset=iBarHeight/2+iBarPad;
				
		myNewBars.append("text")
				.attr("class","DemandDupBarsLabels")
				.text(function(myNode) {return myNode.sLastname;});
		
		myDemandDupCanvas.selectAll(".DemandDupBarsLabels")		
				.attr("x",function(myNode) {return xZero-(this.getBBox().width/2);})
				.attr("y", function(myNode) { return iYTextOffset+=iBarHeight+iBarPad; });
			
		return Render;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}
	
	Render.size = function()
	{
		var divLinksStyle=window.getComputedStyle(document.getElementById("idDemandDup"), null);
		iWidth=parseFloat(divLinksStyle.getPropertyValue("width"));
//		iHeight=parseFloat(divLinksStyle.getPropertyValue("height"));

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
	
	Render.sourcenodeid = function(iValue) {
		if(!arguments.length) return iSourceNodeID;
		iSourceNodeID=iValue;
		return Render;
	};

	Render.targetnodeid = function(iValue) {
		if(!arguments.length) return iTargetNodeID;
		iTargetNodeID=iValue;
		return Render;
	};

	return Render;
}