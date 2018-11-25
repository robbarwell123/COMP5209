function DrawSupplyDup()
{
	var iWidth=800;
	var iHeight=800;
	var sJSONLoc="data/GetSupplyDupData.php?iUserID=";
	var sContentLoc="";
	var sID="idSupplyDup";
	var iNodeID=0;
	
	var iOffset;
	
	var mySupplyDupCanvas;
	var mySupplyDupGraphics;
	var mySupplyDupNavCanvas;
	var mySupplyDupNavGraphics;
	var mySupplyDupGraphicsNodes;
	var mySupplyDupGraphicsLinks;
	
	var myDataNodes;
	var myDataLinks;
	var myDataDupNodes;
	
	var iFilterOverlapPercent=40;
	
	function Render(){}

	Render.newSupplyDup = function () {
		sJSONLoc=sJSONLoc+iNodeID;

		iOffset=document.getElementById('idSupplyDupFilter').clientWidth+document.getElementById('idSupplyDupNav').clientWidth;

		mySupplyDupCanvas = d3.select(sContentLoc+"Content").append("svg")
			.attr("id",sID+"SvgContent");

		mySupplyDupNavCanvas = d3.select(sContentLoc+"Nav").append("svg")
			.attr("id",sID+"SvgNav");

		mySupplyDupGraphics=mySupplyDupCanvas.append("g");
		mySupplyDupGraphicsLinks=mySupplyDupGraphics.append("g");
		mySupplyDupGraphicsNodes=mySupplyDupGraphics.append("g");
		
		mySupplyDupNavGraphics=mySupplyDupNavCanvas.append("g");
		
		d3.json(sJSONLoc).then(function(data) {
			myDataNodes=d3.hierarchy(data.comparenodes);
			myDataLinks=data.links;
			myDataDupNodes=data.nodes;
			
			Render.updateLinks();
			Render.update();
			
			fClickNode(myDataDupNodes[0],0);
		});	
		
		return Render;
	};
	
	Render.updateLinks = function()
	{
		mySupplyDupNavCanvas
			.attr("width",document.getElementById('idSupplyDupNav').clientWidth);
		
		var myNavLinks = mySupplyDupNavGraphics.selectAll(".SupplyDupNavLinks")
				.data(myDataDupNodes.filter(function(myNavLink){return myNavLink.iOverlapPercent>=iFilterOverlapPercent}),function(myNode){return myNode.iUserID});

		myNavLinks.exit().remove();
		
		myNavLinks.enter()
				.append("text")
					.attr("id",function(myNode){return "DupNavLink"+myNode.iUserID})
					.attr("class","SupplyDupNavLinks")
					.text(function(myNode){return myNode.sLastname+" ("+myNode.iOverlapPercent+")"})
					.on("mouseenter",fShowNode)	
					.on("mouseleave",fHideNode)
					.on("click",fClickNode);

		var iY=15;
		var iYInc=15;

		mySupplyDupNavGraphics.selectAll(".SupplyDupNavLinks").transition().duration(iDuration)
			.attr("y",function(myLink) {iY=iY+iYInc;return iY;});
					
		mySupplyDupNavCanvas
			.attr("height", iY+iYInc);
			
		return Render;
	}
	
	Render.update = function()
	{
		mySupplyDupCanvas
			.attr("width", iWidth-iOffset)
			.attr("height", iHeight);
		
		mySupplyDupGraphicsNodes
			.attr("transform", "translate(" + ((iWidth-iOffset)/2) + "," + (iHeight/2) + ")");
		mySupplyDupGraphicsLinks
			.attr("transform", "translate(" + ((iWidth-iOffset)/2) + "," + (iHeight/2) + ")");
		
		var iRadius=Math.min(iWidth,iHeight)/2-2;
		var iInnerRadius=iRadius-50;
		
		var myCluster = d3.cluster()
			.size([360, iInnerRadius]);

		myCluster(myDataNodes);

		var myLinks = mySupplyDupGraphicsLinks.selectAll(".SupplyDupLinks");
		var myNodes = mySupplyDupGraphicsNodes.selectAll(".SupplyDupNodes");

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
				.text(function(myNode){
					sEnd=myNode.data.iOverlapPercent>-1 ? " ("+myNode.data.iOverlapPercent+")": "";
					return myNode.data.sLastname+sEnd;
				});

		mySupplyDupGraphicsNodes.selectAll(".SupplyDupNodes").transition().duration(iDuration)
			.attr("transform", function(myNode){
				return "rotate(" + (myNode.x - 90) + ")translate(" + (myNode.y + 8) + ",0)" + (myNode.x < 180 ? "" : "rotate(180)");
			})
			.attr("text-anchor", function(myNode) { return myNode.x < 180 ? "start" : "end"; })
				
		fAddNodesToLinks(myDataNodes.leaves());

		myLinks.data(myDataLinks,function(myLink){return "L"+myLink.iSource+"-"+myLink.iTarget;}).enter()
			.append("path")
				.attr("id",function(myLink){return "SupplyDupLink"+myLink.iSource})
				.attr("class", function(myLink){
					if(myLink.bRoot)
					{
						return "SupplyDupLinks Selected";
					}else
					{
						return "SupplyDupLinks";
					}
				})
				.style("stroke-width",function(myLink){
					return parseInt(myLink.iSize);
				});

		mySupplyDupGraphicsLinks.selectAll(".SupplyDupLinks").transition().duration(iDuration)
			.attr("d", fMakePath);
		
				
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
			oLink.iSource==myNodes[0].data.iUserID ? oLink.bRoot=true : oLink.bRoot=false;
			oLink.oSource=myNodes[0];
			oLink.oTarget=myNodes[arrNodeIndex.indexOf(oLink.iTarget)];
		});
	}
		
	Render.remove = function(){
		d3.select("#"+sID+"SvgContent").remove();
		d3.select("#"+sID+"SvgNav").remove();
		return null;
	};

	Render.size = function()
	{
		var divLinksStyle=window.getComputedStyle(document.getElementById("idSupplyDup"), null);
		iWidth=parseFloat(divLinksStyle.getPropertyValue("width"));
		iHeight=parseFloat(divLinksStyle.getPropertyValue("height"));

		document.getElementById("idSupplyDupFilter").style.paddingTop=(iHeight/2)-(document.getElementById("idSupplyDupRangeFilter").clientHeight/2);
		
		return Render;
	}
	
	Render.graphics = function() {
		return mySupplyDupGraphics;
	};

	Render.navgraphics = function() {
		return mySupplyDupNavGraphics;
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

	Render.filter = function(iValue) {
		if(!arguments.length) return iFilterOverlapPercent;
		iFilterOverlapPercent=iValue;
		return Render;
	};

	Render.getdata = function() {
		return myData;
	};
	
	return Render;
}
