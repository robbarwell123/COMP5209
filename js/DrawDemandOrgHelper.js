var bFilterOpen=false;
var bDemandOrgOpen=false;

function fDemandOrgOpenClose()
{
	bDemandSupplyProcessOpen=false;
	fResizeDemandSupplyProcess();	
	
	if(bDemandOrgOpen)
	{
		bFilterOpen=false;
		document.getElementById("idDemandOrgFilter").style.visibility="hidden";	
		document.getElementById("idDemandOrgFilterButton").setAttribute("onClick", "DisplayFilter(1)");
		document.getElementById("idDemandOrgFilterButton").style.visibility="hidden";
	}else if(!bDemandOrgOpen)
	{
		document.getElementById("idDemandOrgFilterButton").style.visibility="visible";
	}
	bDemandOrgOpen=!bDemandOrgOpen;
	fResizeDemandOrg();
}

function fResizeDemandOrg()
{
	if(!bDemandOrgOpen)
	{
		document.getElementById('idDemandOrg').style.height=iUnitHeight;
		document.getElementById('idDemandOrg').style.width=iUnitWidth;
	}else if(bDemandOrgOpen)
	{
		document.getElementById("idDemandOrg").style.width=iUnitWidth*2+iPadding;
		document.getElementById("idDemandOrg").style.height=iUnitHeight*2+iPadding;
	}	
}

function fExpandOrgChart()
{
	panelOrgChart = panelOrgChart.expand().update(oCurrNode);
	fRefocusNode(oCurrNode);	
	doFilter();	
}

function fCollapseOrgChart()
{
	panelOrgChart = panelOrgChart.collapse().update(oCurrNode);
	fRefocusNode(panelOrgChart.root());	
	doFilter();
}

bShowConnections=false;

function fShowConnections(oNode)
{
	bShowConnections=true;
	d3.json('data/GetOrgChartUserLinks.php', {
	  method:"POST",
	  headers: {"Content-type": "application/json; charset=UTF-8"},
	  body: JSON.stringify({
		iUserID: oNode.data.iUserID,
		covers: panelOrgChart.visibleNodes()
	  })
	}).then(function(data){		
		if(data.error==0)
		{
			var arrMatch=data.results.split(",");
			for(var iConvert=0; iConvert<arrMatch.length; iConvert++) { arrMatch[iConvert] = +arrMatch[iConvert]; };

			var oSelectedNode=d3.selectAll(".OrgChartNode")
			.filter(function(myNode){
				return arrMatch.indexOf(myNode.data.iUserID)>-1
			});

			if(bShowConnections)
			{
				oSelectedNode.each(function(oSelectNode){
					panelOrgChart.graphicsUserLinks()
						.append("g")
							.attr("class", "OrgChartUserLinks")
						.append("path")
							.attr("d", "M" + oNode.x + "," + oNode.y + "L"+oSelectNode.x +","+oSelectNode.y);
				});
			}
		}
	});		
}

function fHideConnections()
{
	bShowConnections=false;
	panelOrgChart.graphicsUserLinks().selectAll(".OrgChartUserLinks").remove();
}