var oCurrNode;
var myOrgChart;

var panelSupplyOrg;
var panelDemandSupplyProcess;
var panelSupplyDup;

function fUserPeersClick(oNode)
{
	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==oNode.iUserID})
		.datum();

	fAddToHistory(oSelectedNode);
	fRefocusNode(oSelectedNode);
}

function fGlobalNodeClick(oNode)
{
	if(oNode.data==null){oNode.data=oNode};

	var oSelectedNode=d3.selectAll(".OrgChartNode")
		.filter(function(myNode){return myNode.data.iUserID==oNode.data.iUserID});
	
	oCurrNode=oSelectedNode.datum();
	if(bDemandOrgOpen)
	{
		fDemandOrgOpenClose();
	}
	fAddToHistory(oCurrNode);
	fRefocusNode(oCurrNode);
	doFilter();
	panelOrgChart=panelOrgChart.update();
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
	panelDemandSupplyProcess = DrawDemandSupplyProcess().nodeid(oCurrNode.data.iUserID).size().canvas("#idDemandSupplyProcessContent").newProcess();					

	panelSupplyDup = panelSupplyDup!=null ? panelSupplyDup.remove() : null;
	panelSupplyDup = DrawSupplyDup().nodeid(oCurrNode.data.iUserID).size().canvas("#idSupplyDup").newSupplyDup();					
	
	GetHistoryLinks();
	
	fCenterSelectedNode();
}

function fCenterSelectedNode()
{
	var iY=-oCurrNode.y+(document.getElementById('idGridDemandOrg').clientHeight/2);
	var iX=-oCurrNode.x+(document.getElementById('idGridDemandOrg').clientWidth/2);

	panelOrgChart.zoom(iX,iY);
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

var bMenu=false;

function fDisplayMenu()
{
	if(bMenu)
	{
		document.getElementById("idMainMenuContent").style.visibility="hidden";	
	}else if(!bMenu)
	{
		document.getElementById("idMainMenuContent").style.visibility="visible";	
	}	
	bMenu=!bMenu;
}