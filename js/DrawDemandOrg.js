function DrawDemandOrg()
{
	var iNodeSpace=80;
	var iNodeDepth=100;
	
	var iWidth=2000;
	var iHeight=1000;
	var sJSONLoc="data/GetDemandOrgData.php";
	var sContentLoc="";
	var sID="idMyOrgChart";
	
	var myOrgChartCanvas;
	var myOrgChartLinksGraphics;
	var myOrgChartGraphics;
	var myOrgChartUserLinkGraphics;
	var myOrgChartHistoryGraphics;
	var myOrgChart;
	
	var myOrgChartRoot;
	var myVisibleNodes;
	
	var arrAllNodes=[];
	var arrAllNodesIdx=[];
	
	var myOrgZoom=d3.zoom()
		.on("zoom",fOrgZoomHandler);
	
	function Render(){}

	Render.newOrgChart = function () {
		myOrgChartCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID)
			.attr("z-index",100)
			.attr("width", iWidth)
			.attr("height", iHeight)
			.call(myOrgZoom);

		myOrgChartCanvas.append("defs")
			.append("marker")
				.attr("id","ArrowMarker")
				.attr("markerUnits","strokeWidth")
				.attr("refX",11)
				.attr("refY",2)
				.attr("markerWidth",5)
				.attr("markerHeight",5)
				.attr("orient","auto")
				.append("path")
					.attr("class","ArrowMarkerHead")
					.attr("d","M0,0 L0,4 L4,2 z");

		myOrgChartLinksGraphics=myOrgChartCanvas.append("g");
		myOrgChartHistoryGraphics=myOrgChartCanvas.append("g");
		myOrgChartUserLinkGraphics=myOrgChartCanvas.append("g");
		myOrgChartGraphics=myOrgChartCanvas.append("g");
		
		myOrgChart = d3.tree();
			
		d3.json(sJSONLoc).then(function(data) {
			myOrgChartRoot=d3.hierarchy(data);
			myOrgChartRoot.x0=0;
			myOrgChartRoot.y0=iWidth/2;
			
			oCurrNode=myOrgChartRoot;

			myOrgChartRoot.sum(function(myNode){return 1;});
			myOrgChartRoot.each(fUpdateNode);
			myOrgChartRoot.sum(function(myNode){return myNode.iMySize;});
			
			myOrgChartRoot.children.forEach(fCollapse);
			
			Render.update(myOrgChartRoot);

			fAddToHistory(oCurrNode);
			fRefocusNode(oCurrNode);
		});	
		
		return Render;
	};
	
	function fUpdateNode(oNode)
	{
		oNode.iNodeSize=oNode.value;
		arrAllNodes.push(oNode);
		arrAllNodesIdx.push(oNode.data.iUserID);
	}

	function fExpand(oNode)
	{
		if(oNode._children!=null)
		{
			oNode.children=oNode._children;
			oNode._children=null;		
		};
		if(oNode.children!=null){oNode.children.forEach(fExpand)};
	
	}

	Render.expand = function()
	{
		myOrgChartRoot.children.forEach(fExpand);
		return Render;
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

	Render.collapse = function()
	{
		myOrgChartRoot.children.forEach(fCollapse);
		return Render;
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
		
		var myLinks = myOrgChartLinksGraphics.selectAll(".OrgChartLinks")
			.data(allLinks,function(myNode){return myNode.data.iUserID});
		
		var NewLinks=myLinks.enter()
			.append("g")
				.attr("class", "OrgChartLinks")
			.append("path")
				.attr("class", "OrgChartLinksPaths")
				.attr("d", function(myNode) {
					return "M" + myNode.x + "," + myNode.y + "C" + myNode.x + "," + (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," +  (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," + myNode.parent.y;
				});

		var UpdateLinks=NewLinks.merge(myLinks);

		UpdateLinks.selectAll(".OrgChartLinksPaths").transition().duration(iDuration)
			.attr("d", function(myNode) {
				return "M" + myNode.x + "," + myNode.y + "C" + myNode.x + "," + (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," +  (myNode.y + myNode.parent.y) / 2 + " " + myNode.parent.x + "," + myNode.parent.y;
			});
		
		var OldLinks = myLinks.exit().remove();		

		var myNodes = myOrgChartGraphics.selectAll(".OrgChartNode")
			.data(allNodes, function(myNode){return myNode.data.iUserID;});

		var NewNodes = myNodes.enter()
			.append("g")
				.attr("class", "OrgChartNode")
				.attr("transform", function(myNode){return "translate(" + oSourceNode.x0 + "," + oSourceNode.y0 + ")"; })
				.on("click",fGlobalNodeClick)
				.on("contextmenu",fGlobalNodeContextClick);
				
		NewNodes.append("circle")
			.attr("class","NormalNode")
			.attr("r", 1e-6)
			.on("mouseleave",fHideConnections)
			.on("mouseenter",fShowConnections);

		NewNodes.append("text")
			.attr("y", "16px")
			.attr("text-anchor","middle")
			.text(function(myNode){ return myNode.data.sLastname; });

		var UpdateNodes = NewNodes.merge(myNodes);
		
		UpdateNodes.transition().duration(iDuration)
			.attr('transform', function(myNode) {
				return 'translate('+myNode.x+','+myNode.y+')';
			});
		
		UpdateNodes.selectAll('.NormalNode')
			.attr('r',5)
			.attr("class",function(myNode) {
				var sClass="NormalNode";
				sClass+=myNode._children ? " HasChildren" : " NoChildren";
				sClass+=!optHistory && arrIHistory.indexOf(myNode.data.iUserID)>-1 ? " History" : "";
				return sClass;
			});

		var OldNodes = myNodes.exit()
			.transition().duration(iDuration)
			.attr('transform', function(myNode){
				return 'translate('+oSourceNode.x+','+oSourceNode.y+')';
			})
			.remove();

		allNodes.forEach(function(myNode){
			myNode.x0=myNode.x;
			myNode.y0=myNode.y;
		});		

		return Render;
	}

	Render.root = function(){
		return myOrgChartRoot;
	};
	
	Render.remove = function(){
		d3.select("#"+sID).remove();
		return null;
	};
	
	Render.graphics = function() {
		return myOrgChartGraphics;
	};

	Render.graphicsLinks = function() {
		return myOrgChartLinksGraphics;
	};

	Render.graphicsUserLinks = function() {
		return myOrgChartUserLinkGraphics;
	};

	Render.graphicsHistory = function() {
		return myOrgChartHistoryGraphics;
	};

	Render.visibleNodes = function() {
		return myVisibleNodes;
	};
	Render.allNodes = function() {
		return arrAllNodes;
	};
	Render.allNodesIdx = function() {
		return arrAllNodesIdx;
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
	panelOrgChart.graphicsLinks().attr("transform", d3.event.transform);	
	panelOrgChart.graphicsUserLinks().attr("transform", d3.event.transform);	
	panelOrgChart.graphicsHistory().attr("transform", d3.event.transform);	
}