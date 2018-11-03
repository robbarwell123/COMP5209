var d3OrgChart;
var d3Canvas;
var myRoot;
var iDuration=750;
var iId=0;
var gOrgChart;

var fOrgZoomHandler=d3.zoom().on("zoom", function () {
	gOrgChart.attr("transform", d3.event.transform)
	});

function DrawOrgChart()
{
	var iWidth=2000;
	var iHeight=1000;
	var sJSONLoc="";
	var sContentLoc="";
	var sID="idMyOrgChart";
	
	function Render(){}

	Render.draw = function () {
		d3Canvas = d3.select(sContentLoc).append("svg")
			.attr("width", iWidth)
			.attr("height", iHeight)
			.attr("id",sID)
			.call(fOrgZoomHandler);

		gOrgChart=d3Canvas.append("g");
		
		d3OrgChart = d3.tree().size([iWidth,iHeight]);	
			
		d3.json(sJSONLoc).then(function(data) {
			myRoot=d3.hierarchy(data);
			myRoot.x0=0;
			myRoot.y0=iWidth/2;
			
			oCurrNode=myRoot;

			myRoot.sum(function(myNode){return 1;});
			myRoot.children.forEach(fUpdateNode);
			myRoot.sum(function(myNode){return myNode.iMySize;});
			
			myRoot.children.forEach(fCollapse);
			fUpdateTree(myRoot);
			
			fRefocusNode(iCurrNode);
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

function fUpdateTree(oSourceNode)
{
	currTreeView=d3OrgChart(myRoot);
	
	var allNodes=currTreeView.descendants();
	var allLinks=currTreeView.descendants().slice(1);

	allNodes.forEach(function(oNode){oNode.y=oNode.depth*100+10;});

	var myNodes = gOrgChart.selectAll(".OrgChartNode")
		.data(allNodes, function(myNode){return myNode.data.iUserID;});

	var myLinks = gOrgChart.selectAll(".OrgChartLinks")
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
		
	var NewNodes = myNodes.enter()
		.append("g")
			.attr("class", "OrgChartNode")
			.attr("transform", function(myNode){ return "translate(" + oSourceNode.x0 + "," + oSourceNode.y0 + ")"; })
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

	allNodes.forEach(function(myNode){
		myNode.x0=myNode.x;
		myNode.y0=myNode.y;
	});				
}
