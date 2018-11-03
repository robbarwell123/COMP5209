var bGlobalOpen=false;
var bFilterOpen=false;

var iCurrNode=1;
var myOrgChart;

function fGlobalNodeClick(oNode)
{
	if(bGlobalOpen)
	{
		MinMaxGlobalDiv();
	}
	if(oNode.children)
	{
		oNode._children=oNode.children;
		oNode.children=null;
	}else
	{
		oNode.children=oNode._children;
		oNode._children=null;
	}
	fUpdateTree(oNode);
	fRefocusNode(oNode.data.iUserID);
}

function fRefocusNode(iNode)
{
	var oOldNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==iCurrNode});
	
	oOldNode.selectAll(".SelectedNode").remove();

	iCurrNode=iNode;
	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==iCurrNode});

	oSelectedNode.append("g")
		.append("circle")
		.attr("class","SelectedNode")
		.attr("r", 7);


	d3.select("#idMyUserLinksChart").remove();
	var divContent=window.getComputedStyle(document.getElementById("idLinks"), null);
	var myUserLinks = DrawUserLinksChart().data("GetUserLinks.php?iUserID=").nodeid(iCurrNode).width(parseFloat(divContent.getPropertyValue("width"))).height(parseFloat(divContent.getPropertyValue("height"))).canvas("#idLinks").draw();


	d3.select("#idMyUserPeersChart").remove();
	var divStats=window.getComputedStyle(document.getElementById("idStats"), null);
	var myUserPeers = DrawUserPeersChart().data("GetUserPeers.php?iUserID=").nodeid(iCurrNode).width(parseFloat(divStats.getPropertyValue("width"))).height(parseFloat(divStats.getPropertyValue("height"))).canvas("#idStats").draw();
	
	fCenterSelectedNode();
}

function fCenterSelectedNode()
{
	var oCurrNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==iCurrNode});

	var iY=-oCurrNode.datum().y+(document.getElementById('idGridGlobal').clientHeight/2);
	var iX=-oCurrNode.datum().x+(document.getElementById('idGridGlobal').clientWidth/2);

	d3Canvas.transition()
		.duration(iDuration)
		.call(fOrgZoomHandler.transform, d3.zoomIdentity.translate(iX,iY));
}

function MinMaxGlobalDiv()
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	if(bGlobalOpen)
	{

		document.getElementById('idGlobal').style.height=document.getElementById('idGridGlobal').clientHeight-iPadding;
		document.getElementById('idGlobal').style.width=document.getElementById('idGridGlobal').clientWidth-iPadding;

		document.getElementById("idGlobalFilter").style.width="0px";

		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
		document.getElementById("idGlobalFilterButton").style.visibility="hidden";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(2)");
	}else if(!bGlobalOpen)
	{
		document.getElementById("idGlobal").style.width="calc(100% - "+iPadding+"px)";
		var linksStyle = getComputedStyle(document.getElementById("idGridLinks"));
		document.getElementById("idGlobal").style.height=parseInt(linksStyle.getPropertyValue('height'))-iPadding;

		document.getElementById("idGlobalFilterButton").style.visibility="visible";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(1)");		
	}
	bGlobalOpen=!bGlobalOpen;
}

function DisplayFilter()
{
	if(bFilterOpen)
	{
		document.getElementById("idGlobalFilter").style.width="0px";	
		
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
	}else if(!bFilterOpen)
	{
		document.getElementById("idGlobalFilter").style.width="200px";	
  
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(1)");
	}	
	bFilterOpen=!bFilterOpen;
}