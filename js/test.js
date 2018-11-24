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
	
	var myDataNodes;
	var myDataLinks;
	
	function Render(){}

	Render.newSupplyDup = function () {
		sJSONLoc=sJSONLoc+iNodeID;

		mySupplyDupCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);

		mySupplyDupGraphics=mySupplyDupCanvas.append("g");
		
		d3.json(sJSONLoc).then(function(data) {
			myDataNodes=d3.hierarchy(data.nodes);
			myDataLinks=data.links;

			Render.update();
		});	
		
		return Render;
	};
		
	Render.update = function()
	{
		mySupplyDupCanvas
			.attr("width", iWidth)
			.attr("height", iHeight);
		
		mySupplyDupGraphics
			.attr("transform", "translate(" + (iWidth/2) + "," + (iHeight/2) + ")");
		
		var iRadius=Math.min(iWidth,iHeight)/2-100;
		var iInnerRadius=iRadius-120;
		
		var myCluster = d3.cluster()
			.size([360, iInnerRadius]);

		myCluster(myDataNodes);

		var myLinks = mySupplyDupGraphics.append("g").selectAll(".SupplyDupLinks");
		var myNodes = mySupplyDupGraphics.append("g").selectAll(".SupplyDupNodes");

		myNodes.data(myDataNodes.leaves(),function(myNode){return myNode.data.iUserID}).enter()
			.append("text")
				.attr("class", function(myNode){
					if(myNode.data.iOverlapPercent==-1)
					{
						return "SupplyDupNodes Selected";
					}else
					{
						return "SupplyDupNodes";
					}					
				})
				.attr("dy", "0.31em")
				.attr("transform", function(myNode){
					return "rotate(" + (myNode.x - 90) + ")translate(" + (myNode.y + 8) + ",0)" + (myNode.x < 180 ? "" : "rotate(180)");
				})
				.attr("text-anchor", function(myNode) { return myNode.x < 180 ? "start" : "end"; })
				.text(function(myNode){
					sEnd=myNode.data.iOverlapPercent>-1 ? " ("+myNode.data.iOverlapPercent+")": "";
					return myNode.data.sLastname+sEnd;
				})
				.on("mouseenter",fShowNode)	
				.on("mouseleave",fHideNode)
				.on("click",fClickNode);

		fAddNodesToLinks(myDataNodes.leaves());

		myLinks.data(myDataLinks).enter()
			.append("path")
				.attr("id",function(myLink){return "SupplyDupLink"+myLink.iSource})
				.attr("class", function(myLink){
					if(myLink.oSource.data.iOverlapPercent==-1)
					{
						return "SupplyDupLinks Selected";
					}else
					{
						return "SupplyDupLinks";
					}
				})
				.attr("d", fMakePath)
				.style("stroke-width",function(myLink){
					return parseInt(myLink.iSize);
				});
	  
		return Render;
	}

	function fMakePath(myLink)
	{
		var iSX = myLink.oSource.y * Math.cos((myLink.oSource.x-90)/180 * Math.PI);
		var iSY = myLink.oSource.y * Math.sin((myLink.oSource.x-90)/180 * Math.PI);
		var iTX = myLink.oTarget.y * Math.cos((myLink.oTarget.x-90)/180 * Math.PI);
		var iTY = myLink.oTarget.y * Math.sin((myLink.oTarget.x-90)/180 * Math.PI);

		return "M"+iSX+" "+iSY+" Q 0 0 "+iTX+" "+iTY;			
	}
	
	function fAddNodesToLinks(myNodes)
	{
		var arrNodeIndex=[];

		myNodes.forEach(function(myNode){
			arrNodeIndex.push(myNode.data.iUserID);
		});

		myDataLinks.forEach(function(oLink){
			oLink.oSource=myNodes[arrNodeIndex.lastIndexOf(oLink.iSource)];
			oLink.oTarget=myNodes[arrNodeIndex.indexOf(oLink.iTarget)];
		});
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

function fShowNode(myNode,iIndex)
{
	panelTest.graphics().selectAll(".SupplyDupLinkShow")
		.attr("class","SupplyDupLinks");
		
	if(myNode.data.iOverlapPercent>-1)
	{
		panelTest.graphics().selectAll("#SupplyDupLink"+myNode.data.iUserID)
			.attr("class","SupplyDupLinks SupplyDupLinkShow");
	}
}

function fHideNode(myNode,iIndex)
{
	panelTest.graphics().selectAll(".SupplyDupLinkShow")
		.attr("class","SupplyDupLinks");
}

function fClickNode(myNode,iIndex)
{
	if(myNode.data.iOverlapPercent>-1)
	{
		console.log("Clicked!");
	}
}