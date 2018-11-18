var bGlobalOpen=false;
var bFilterOpen=false;

var oCurrNode;
var myOrgChart;

var panelSupplyOrg;
var panelDemandSupplyProcess;

function fUserPeersClick(oNode)
{
	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==oNode.iUserID})
		.datum();

	fAddToHistory(oSelectedNode);
	fRefocusNode(oSelectedNode);
}
/*
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
	fAddToHistory(oNode);
	fRefocusNode(oNode);
	doFilter();
}
*/
function fGlobalNodeClick(oNode)
{
	oCurrNode=oNode.data;
	if(bGlobalOpen)
	{
		MinMaxGlobalDiv();
	}
	fAddToHistory(oNode);
	fRefocusNode(oNode);
	doFilter();
}

function fGlobalNodeContextClick(oNode)
{
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
	doFilter();
	GetHistoryLinks();
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

	panelSupplyOrg = panelSupplyOrg!=null ? panelSupplyOrg.remove() : null;
	panelSupplyOrg = DrawSupplyOrg().nodeid(oCurrNode.data.iUserID).size().canvas("#idSupplyOrg").newTreemap();

	panelDemandSupplyProcess = panelDemandSupplyProcess!=null ? panelDemandSupplyProcess.remove() : null;
	panelDemandSupplyProcess = DrawDemandSupplyProcess().nodeid(oCurrNode.data.iUserID).size().canvas("#idDemandSupplyProcess").newProcess();					
	
	GetHistoryLinks();
	
	fCenterSelectedNode();
}

function fCenterSelectedNode()
{
	var iY=-oCurrNode.y+(document.getElementById('idGridDemandOrg').clientHeight/2);
	var iX=-oCurrNode.x+(document.getElementById('idGridDemandOrg').clientWidth/2);

	panelOrgChart.zoom(iX,iY);
}

function MinMaxGlobalDiv()
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	if(bGlobalOpen)
	{

		document.getElementById('idDemandOrg').style.height=document.getElementById('idGridDemandOrg').clientHeight-iPadding;
		document.getElementById('idDemandOrg').style.width=document.getElementById('idGridDemandOrg').clientWidth-iPadding;

		document.getElementById("idDemandOrgFilter").style.visibility="hidden";	
		bFilterOpen=false;
		document.getElementById("idDemandOrgFilterButton").setAttribute("onClick", "DisplayFilter(1)");
		document.getElementById("idDemandOrgFilterButton").style.visibility="hidden";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(2)");
	}else if(!bGlobalOpen)
	{
		document.getElementById("idDemandOrg").style.width="calc(100% - "+iPadding+"px)";
		var linksStyle = getComputedStyle(document.getElementById("idGridSupplyOrg"));
		document.getElementById("idDemandOrg").style.height=window.innerHeight-document.getElementById('idGridNavBar').clientHeight-iPadding;

		document.getElementById("idDemandOrgFilterButton").style.visibility="visible";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(1)");		
	}
	bGlobalOpen=!bGlobalOpen;
}

function DisplayFilter()
{
	if(bFilterOpen)
	{
		document.getElementById("idDemandOrgFilter").style.visibility="hidden";	
		
		document.getElementById("idDemandOrgFilterButton").setAttribute("onClick", "DisplayFilter(2)");
	}else if(!bFilterOpen)
	{
		document.getElementById("idDemandOrgFilter").style.visibility="visible";	
  
		document.getElementById("idDemandOrgFilterButton").setAttribute("onClick", "DisplayFilter(1)");
	}	
	bFilterOpen=!bFilterOpen;
}

bFilterActive=false;
function doFilter()
{
	if(doFilter.caller.name=="onchange" || doFilter.caller.name=="onkeyup")
	{
		bFilterActive=true;
	}
	
	var sUserFilterVal=document.getElementById("idUserFilter").value;
	
	if(bFilterActive && (sUserFilterVal=="" || sUserFilterVal.length>2))
	{
		var iEmailFilterVal=document.getElementById("idEmailFilter").value;
		document.getElementById("idEmailFilterTitle").innerHTML=iEmailFilterVal;
		
		var myFilters = {
			iEmails: iEmailFilterVal,
			sUser: sUserFilterVal
		};
		d3.json('data/GetFilterResults.php', {
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

				oSelectedNode
					.append("circle")
					.attr("class","FilterMatchNode")
					.attr("r", 8);
			}
		});		
	}
}