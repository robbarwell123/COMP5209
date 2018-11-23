function DrawSupplyDup()
{
	var iWidth=800;
	var iHeight=800;
	var sJSONLoc="data/test.php?iUserID=";
	var sContentLoc="";
	var sID="idSupplyDup";
	var iNodeID=0;
	
	var mySupplyDupCanvas;
	var mySupplyDupGraphics;
	var myChord;
	
	var myData;
	var myDataTransformed;
	
	function Render(){}

	Render.newSupplyDup = function () {
		sJSONLoc=sJSONLoc+iNodeID;

		mySupplyDupCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);

		mySupplyDupGraphics=mySupplyDupCanvas.append("g");
		
		d3.json(sJSONLoc).then(function(data) {
			myData=data;
			fMakeMatrix();
			
			myChord=d3.chord()
				.padAngle(0.01)
				.sortChords(d3.descending);
			
			Render.update();
		});	
		
		return Render;
	};
	
	function fMakeMatrix()
	{
		var arrNodes=[];
		myData.nodes.forEach(function(oNode){
			arrNodes.push(oNode.iUserID);
		});
		
		myDataTransformed=Array(arrNodes.length).fill().map(() => Array(arrNodes.length).fill(0));;

		myData.links.forEach(function(oLink){
			myDataTransformed[arrNodes.indexOf(oLink.iSource)][arrNodes.indexOf(oLink.iTarget)]=parseInt(oLink.iSize);
		});
	}
	
	Render.update = function()
	{
		mySupplyDupCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);
		
		mySupplyDupGraphics
			.attr("transform", "translate(" + (iWidth/2) + "," + (iHeight/2) + ")")
			.datum(myChord(myDataTransformed));
		
		var iRadius=Math.min(iWidth,iHeight)/2-100;
		var iInnerRadius=iRadius-10;
		
		var myArc=d3.arc()
			.innerRadius(iInnerRadius)
			.outerRadius(iInnerRadius+10);
		
		var myPaths=d3.ribbon()
			.radius(iInnerRadius);

		var myOuterArcs=mySupplyDupGraphics.selectAll(".SupplyDupNodes")
			.data(function(myChord) { return myChord.groups; }).enter()
				.append("g")
					.attr("class", "SupplyDupNodes");

		myOuterArcs.append("path")
			.attr("id", function(myChord, iIndex) { return myChord.index; })
			.attr("d", myArc)
			.on("mouseenter",fShowNode)
			.on("mouseleave",fHideNode);

		myOuterArcs.append("text")
			.each(function(myChord,iIndex) {
				var iArcCenter = myArc.centroid(myChord);
				d3.select(this)
					.attr("class",function(oNode){
						if(myData.nodes[iIndex].iOverlapPercent>-1)
						{
							return "SupplyDupLinksText";
						}else if(myData.nodes[iIndex].iOverlapPercent==-1)
						{
							return "SupplyDupLinksText CurrentNode";
						}else
						{
							return "SupplyDupLinksText CompareNode";
						}
					})
					.attr('x', iArcCenter[0])
					.attr('y', iArcCenter[1])
					.text(myData.nodes[iIndex].sLastname +"("+myData.nodes[iIndex].iOverlapPercent+")");
			});

		mySupplyDupGraphics.selectAll(".SupplyDupLinks")
			.data(function(myChord) { return myChord; }).enter()
				.append("path")
					.attr("id",function(myLink,iIndex){return "SupplyDupLinks"+myData.nodes[myLink.source.index].iUserID})
					.attr("class", function(myLink,iIndex){return myData.nodes[myLink.source.index].iUserID==iNodeID ? "SupplyDupLinks CurrentNode" : "SupplyDupLinks"})
			.attr("d", myPaths);			

		return Render;
	}
	
	Render.remove = function(){
		d3.select("#"+sID).remove();
		return null;
	};
	
	Render.graphics = function() {
		return mySupplyDupGraphics;
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
	
	Render.nodeid = function(iValue) {
		if(!arguments.length) return iNodeID;
		iNodeID=iValue;
		return Render;
	};

	Render.id = function(sValue) {
		if(!arguments.length) return sID;
		sID=sValue;
		return Render;
	};
	
	Render.getdata = function() {
		return myData;
	};
	
	return Render;
}

var iPrevNode=-1;

function fShowNode(myNode,iIndex)
{
	if(panelTest.nodeid()!=panelTest.getdata().nodes[iIndex].iUserID)
	{
		iPrevNode=panelTest.getdata().nodes[iIndex].iUserID;
		d3.selectAll("#SupplyDupLinks"+iPrevNode)
			.attr("class","SupplyDupLinks Selected");
	}
}

function fHideNode(myNode,iIndex)
{
	if(panelTest.nodeid()!=panelTest.getdata().nodes[iIndex].iUserID)
	{
		d3.selectAll("#SupplyDupLinks"+iPrevNode)
			.attr("class","SupplyDupLinks");
	}
}