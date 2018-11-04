function DrawUserLinksChart()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyUserLinksChart";
	var iNodeID=0;
	var sFilter;
	
	var myLinksCanvas;
	var myLinksGraphics;
	var myTreemap;
	var mapColor = d3.scaleOrdinal()
		.range(d3.schemePastel1.map(function(c) { c = d3.rgb(c); return c; }));		
	var myUserLinks;
	var myTreemap;
		
	function Render(){}

	Render.newTreemap = function () {
		sJSONLoc=sJSONLoc+iNodeID;
				
		myLinksCanvas = d3.select(sContentLoc).append("svg")
			.attr("id",sID);

		myLinksGraphics = myLinksCanvas.append("g");

		d3.json(sJSONLoc).then(function(data) {
			myUserLinks=d3.hierarchy(data);

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
			
		myDisplayLinks=fFilterDept(sFilter);
		myDisplayLinks
			.sum(function(myNode) {return myNode.iNodeSize})
			.sort(function(a, b) { return b.height - a.height || b.value - a.value; });

		myTreemap(myDisplayLinks);

		var myTreeCells = myLinksGraphics.selectAll(".TreeMapNodes")
			.data(myDisplayLinks.leaves(), function(myNode){return myNode.data.iNodeID;});

		var NewTreeNodes=myTreeCells.enter()
			.append("g")
				.attr("class","TreeMapNodes")
				.attr("transform", function(myNode) { return "translate(" + myNode.x0 + "," + myNode.y0 + ")"; })
				.on("click",fZoomTree);
	
		NewTreeNodes.append("rect")
			.attr("class","UserLinkNode")
			.attr("width", function(myNode) {return myNode.x1 - myNode.x0; })
			.attr("height", function(myNode) { return myNode.y1 - myNode.y0; })
			.attr("fill", function(myNode) { while (myNode.depth > 1) myNode = myNode.parent; return mapColor(myNode.data.sNodeName); });

		NewTreeNodes.append("text")
			.selectAll("tspan")
				.data(function(myNode) { return myNode.data.sNodeLastname.split(/(?=[A-Z][^A-Z])/g); })
			.enter().append("tspan")
				.attr("x", 4)
				.attr("y", function(d, i) { return 13 + i * 10; })
				.text(function(myNode) { return myNode; });		
		
		var UpdateTreeNodes=NewTreeNodes.merge(myTreeCells);

		d3.selectAll(".TreeMapNodes").transition().duration(iDuration)
			.attr("transform", function(myNode) { return "translate(" + myNode.x0 + "," + myNode.y0 + ")"; });

		UpdateTreeNodes.select(".UserLinkNode").transition().duration(iDuration)
			.attr("width", function(myNode) { return myNode.x1 - myNode.x0; })
			.attr("height", function(myNode) { return myNode.y1 - myNode.y0; });

		var OldTreeNodes = myTreeCells.exit().remove();							
		
		return Render;
	}

	function fFilterDept(sDeptName)
	{
		var sBreadCrumb=oCurrNode!=null ? oCurrNode.data.sLastname : "Loading ...";
		
		myFilteredLinks=myUserLinks.copy();
		if(sDeptName!=null)
		{
			myFilteredLinks.children=myUserLinks.children.filter(function (myNode){if(myNode.data.sNodeName==sDeptName){return myNode}});		
			sBreadCrumb+=" > "+sDeptName;
		}
		
		document.getElementById('idLinksHeader').innerHTML=sBreadCrumb;
		
		return myFilteredLinks;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}
	
	Render.size = function()
	{
		var divLinksStyle=window.getComputedStyle(document.getElementById("idLinks"), null);
		iWidth=parseFloat(divLinksStyle.getPropertyValue("width"));
		iHeight=parseFloat(divLinksStyle.getPropertyValue("height"))-document.getElementById('idLinksHeader').clientHeight;

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

var bGlobalTreeView=true;

function fZoomTree(myNode)
{
	if(bGlobalTreeView)
	{
		panelUserLinks.filter(myNode.parent.data.sNodeName).update();
	}else
	{
		panelUserLinks.filter().update();
	}
	bGlobalTreeView=!bGlobalTreeView;
}