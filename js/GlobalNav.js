var bGlobalOpen=false;
var bFilterOpen=false;

var iCurrNode=1;
var myOrgChart;

function fGlobalNodeClick(oData)
{
	if(bGlobalOpen)
	{
		MinMaxGlobalDiv();
	}
	fRefocusNode(oData.data.iUserID);
}

function fRefocusNode(iNode)
{
	d3.select("#ORG_NODE_"+iCurrNode).attr("class","OrgChartNode");
	iCurrNode=iNode;
	d3.select("#ORG_NODE_"+iCurrNode).attr("class","OrgChartNodeSelected");

	d3.select("#idMyUserLinksChart").remove();
	var divContent=window.getComputedStyle(document.getElementById("idLinks"), null);
	var myUserLinks = DrawUserLinksChart().data("GetUserLinks.php?iUserID=").nodeid(iCurrNode).width(parseFloat(divContent.getPropertyValue("width"))).height(parseFloat(divContent.getPropertyValue("height"))).canvas("#idLinks").draw();


	d3.select("#idMyUserPeersChart").remove();
	var divStats=window.getComputedStyle(document.getElementById("idStats"), null);
	var myUserPeers = DrawUserPeersChart().data("GetUserPeers.php?iUserID=").nodeid(iCurrNode).width(parseFloat(divStats.getPropertyValue("width"))).height(parseFloat(divStats.getPropertyValue("height"))).canvas("#idStats").draw();

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