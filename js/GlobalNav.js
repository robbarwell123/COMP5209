var bGlobalOpen=false;
var bFilterOpen=false;

var oCurrNode;
var myOrgChart;

var panelUserLinks;
var panelUserPeers;

function fUserPeersClick(oNode)
{
	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==oNode.iUserID})
		.datum();
		
	fRefocusNode(oSelectedNode);
}

function fGlobalNodeClick(oNode)
{
	oCurrNode=oNode.data;
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
	panelOrgChart=panelOrgChart.update(oNode);
	fRefocusNode(oNode);
	doFilter();
}

function fRefocusNode(oNode)
{
	d3.selectAll(".SelectedNode").remove();
		
	oCurrNode=oNode;
	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==oCurrNode.data.iUserID});

	oSelectedNode.append("circle")
		.attr("class","SelectedNode")
		.attr("r", 11);

	panelUserLinks = panelUserLinks!=null ? panelUserLinks.remove() : null;
	panelUserLinks = DrawUserLinksChart().data("GetUserLinks.php?iUserID=").nodeid(oCurrNode.data.iUserID).size().canvas("#idLinks").newTreemap();

	panelUserPeers = panelUserPeers!=null ? panelUserPeers.remove() : null;
	d3.select("#idMyUserPeersChart").remove();
	panelUserPeers = DrawUserPeersChart().data("GetUserPeers.php?iUserID=").nodeid(oCurrNode.data.iUserID).size().canvas("#idStats").newBarChart();
	
	fCenterSelectedNode();
}

function fCenterSelectedNode()
{
	var iY=-oCurrNode.y+(document.getElementById('idGridGlobal').clientHeight/2);
	var iX=-oCurrNode.x+(document.getElementById('idGridGlobal').clientWidth/2);

	panelOrgChart.zoom(iX,iY);
}

function MinMaxGlobalDiv()
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	if(bGlobalOpen)
	{

		document.getElementById('idGlobal').style.height=document.getElementById('idGridGlobal').clientHeight-iPadding;
		document.getElementById('idGlobal').style.width=document.getElementById('idGridGlobal').clientWidth-iPadding;

		document.getElementById("idGlobalFilter").style.visibility="hidden";	
		bFilterOpen=false;
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(1)");
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
		document.getElementById("idGlobalFilter").style.visibility="hidden";	
		
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
	}else if(!bFilterOpen)
	{
		document.getElementById("idGlobalFilter").style.visibility="visible";	
  
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(1)");
	}	
	bFilterOpen=!bFilterOpen;
}

function doFilter()
{
	var sUserFilterVal=document.getElementById("idUserFilter").value;
	
	if(sUserFilterVal=="" || sUserFilterVal.length>2)
	{
		var iEmailFilterVal=document.getElementById("idEmailFilter").value;
		document.getElementById("idEmailFilterTitle").innerHTML=iEmailFilterVal;
		
		var myFilters = {
			iEmails: iEmailFilterVal,
			sUser: sUserFilterVal
		};
		d3.json('GetFilterResults.php', {
		  method:"POST",
		  headers: {"Content-type": "application/json; charset=UTF-8"},
		  body: JSON.stringify({
			filters: myFilters,
			covers: panelOrgChart.visibleNodes()
		  })
		}).then(function(data){
			d3.selectAll(".FilterMatchNode").remove();
			
			if(data.error==0)
			{
				var arrMatch=data.results.split(",");
				for(var iConvert=0; iConvert<arrMatch.length; iConvert++) { arrMatch[iConvert] = +arrMatch[iConvert]; };
				
				var oSelectedNode=d3.selectAll(".OrgChartNode")
				.filter(function(myNode){
					return arrMatch.indexOf(myNode.data.iUserID)>-1
				});

				oSelectedNode.append("g")
					.append("circle")
					.attr("class","FilterMatchNode")
					.attr("r", 8);
			}
		});		
	}
}