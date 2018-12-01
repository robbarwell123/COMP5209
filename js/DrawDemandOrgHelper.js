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
	sURL="data/GetOrgChartUserLinks.php?iUserID="+oNode.data.iUserID;

	bShowConnections=true;
	d3.json(sURL).then(function(data){
		var arrVisibleNodes=panelOrgChart.visibleNodes();
		var arrAllNodes=panelOrgChart.allNodes();
		var arrAllNodesIdx=panelOrgChart.allNodesIdx();
		
		var myLinks={};

		data.forEach(function(myNode){
			if(arrVisibleNodes.indexOf(myNode.iUserID)>-1)
			{
				iFindNodeID=myNode.iUserID;
			}else
			{
				iFindNodeID=myNode.iUserID;
				while(arrVisibleNodes.indexOf(iFindNodeID)==-1)
				{
					iFindNodeID=arrAllNodes[arrAllNodesIdx.indexOf(iFindNodeID)].parent.data.iUserID;
				}
			}
			myLinks[iFindNodeID]=typeof myLinks[iFindNodeID]=="undefined" ? parseInt(myNode.iEmailCount) : myLinks[iFindNodeID]+parseInt(myNode.iEmailCount);
		});
		
		var arrLinks=[];
		var oLink;
		var iSource=[oNode.x,oNode.y];
		
		for(var iKey in myLinks)
		{
			oLink=new Object();
			oLink.id=parseInt(iKey);
			oLink.source=iSource;
			oLink.target=[arrAllNodes[arrAllNodesIdx.indexOf(oLink.id)].x,arrAllNodes[arrAllNodesIdx.indexOf(oLink.id)].y]
			oLink.size=Math.log2(myLinks[iKey]);
			arrLinks.push(oLink);
		}
		
		var myLinkGen=d3.linkHorizontal();

		var myLinks=panelOrgChart.graphicsUserLinks().selectAll(".OrgChartUserLinks")
			.data(arrLinks,function(myLink){return myLink.id});
			
		myLinks=myLinks.enter().append("g")
			.attr("class", "OrgChartUserLinks");
		
		if(bShowConnections)
		{
			myLinks.append("path")
				.style("stroke-width",function(myLink){return myLink.size})
				.attr("d",myLinkGen);			
		}
	});		
}

function fHideConnections()
{
	bShowConnections=false;
	panelOrgChart.graphicsUserLinks().selectAll(".OrgChartUserLinks").remove();
}