function DrawOrgChart()
{
	var iNodeSpace=80;
	var iNodeDepth=100;
	
	var iWidth=2000;
	var iHeight=1000;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyOrgChart";
	
	var myOrgChartCanvas;
	var myOrgChartGraphics;
	var myOrgChart;
	
	var myOrgChartRoot;
	var myVisibleNodes;
	
	var myOrgZoom=d3.zoom()
		.on("zoom",fOrgZoomHandler);
	
	function Render(){}

	Render.newOrgChart = function () {
		myOrgChartCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID)
			.attr("width", iWidth)
			.attr("height", iHeight)
			.call(myOrgZoom);

		myOrgChartGraphics=myOrgChartCanvas.append("g");
		
		myOrgChart = d3.tree();
			
		d3.json(sJSONLoc).then(function(data) {
			myOrgChartRoot=d3.hierarchy(data);
			myOrgChartRoot.x0=0;
			myOrgChartRoot.y0=iWidth/2;
			
			oCurrNode=myOrgChartRoot;

			myOrgChartRoot.sum(function(myNode){return 1;});
			myOrgChartRoot.children.forEach(fUpdateNode);
			myOrgChartRoot.sum(function(myNode){return myNode.iMySize;});
			
			myOrgChartRoot.children.forEach(fCollapse);

			Render.update(myOrgChartRoot);

			fRefocusNode(oCurrNode);
		});	
		
		return Render;
	};

	function fUpdateNode(oNode)
	{
		oNode.iNodeSize=oNode.value;			
	}
	
	function fCollapse(oNode)
	{
		oNode.iNodeSize=oNode.value;
		if(oNode.children!=null)
		{
			oNode.children.forEach(fCollapse);
			if(oNode.data.iLevel>1)
			{
				oNode._children=oNode.children;
				oNode.children=null;
			}
		}
	}

	Render.update = function(oSourceNode)
	{
		iNewWidth=Math.min(myOrgChartRoot.leaves().length*iNodeSpace,iWidth);
		myOrgChart
			.size([iNewWidth,iHeight]);
		
		currTreeView=myOrgChart(myOrgChartRoot);

		var allNodes=currTreeView.descendants();
		var allLinks=currTreeView.descendants().slice(1);

		myVisibleNodes=[];
		allNodes.forEach(function(oNode){
			oNode.y=oNode.depth*iNodeDepth+10;
			myVisibleNodes.push(oNode.data.iUserID);
		});

		var myNodes = myOrgChartGraphics.selectAll(".OrgChartNode")
			.data(allNodes, function(myNode){return myNode.data.iUserID;});

		var NewNodes = myNodes.enter()
			.append("g")
				.attr("class", "OrgChartNode")
				.attr("transform", function(myNode){return "translate(" + oSourceNode.x0 + "," + oSourceNode.y0 + ")"; })
				.on("click",fGlobalNodeClick);
				
		NewNodes.append("circle")
			.attr("class","NormalNode")
			.attr("r", 1e-6)
			.style("fill", function(d) {
					 return d._children ? clrNodeChildren : "white";
			});

		NewNodes.append("text")
			.attr("y", "16px")
			.attr("text-anchor","middle")
			.text(function(myNode){ return myNode.data.sLastname; });

		var UpdateNodes = NewNodes.merge(myNodes);
		
		UpdateNodes.transition().duration(iDuration)
			.attr('transform', function(myNode) {
				return 'translate('+myNode.x+','+myNode.y+')';
			});
		
		UpdateNodes.select('.NormalNode')
			.attr('r',5)
			.style("fill", function(d) {
				return d._children ? clrNodeChildren : "white";
			});

		var OldNodes = myNodes.exit()
			.transition().duration(iDuration)
			.attr('transform', function(myNode){
				return 'translate('+oSourceNode.x+','+oSourceNode.y+')';
			})
			.remove();

		OldNodes.select('circle.NormalNode')
			.attr('r',1e-6);

		OldNodes.select('text.OrgChartNode')
			.attr('fill-opacity',1e-6);

		var myLinks = myOrgChartGraphics.selectAll(".OrgChartLinks")
			.data(allLinks,function(myNode){return myNode.id});
		
		var NewLinks=myLinks.enter()
			.append("path")
				.attr("class", "OrgChartLinks")
				.attr("d", function(myNode) {
					return "M" + myNode.x + "," + myNode.y + "C" + myNode.x + "," + (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," +  (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," + myNode.parent.y;
				});

		var UpdateLinks=NewLinks.merge(myLinks);
		
		UpdateLinks.transition().duration(iDuration)
			.attr("d", function(myNode) {
				return "M" + myNode.x + "," + myNode.y + "C" + myNode.x + "," + (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," +  (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," + myNode.parent.y;
			});
		
		var OldLinks = myLinks.exit().remove();		
			
		allNodes.forEach(function(myNode){
			myNode.x0=myNode.x;
			myNode.y0=myNode.y;
		});		

		return Render;
	}
	
	Render.graphics = function() {
		return myOrgChartGraphics;
	};

	Render.visibleNodes = function() {
		return myVisibleNodes;
	};
	
	Render.zoom = function(iXPos,iYPos) {
		myOrgChartCanvas.transition()
			.duration(iDuration)
			.call(myOrgZoom.transform, d3.zoomIdentity.translate(iXPos,iYPos));
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
	
	return Render;
}

function fOrgZoomHandler(myNode)
{
	panelOrgChart.graphics().attr("transform", d3.event.transform);
}