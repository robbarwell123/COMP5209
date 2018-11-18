var bDemandSupplyProcessOpen=false;

function fProcessOpenClose()
{
	bDemandOrgOpen=false;
	fResizeDemandOrg();
	bDemandSupplyProcessOpen=!bDemandSupplyProcessOpen;
	fResizeDemandSupplyProcess();
}

function fResizeDemandSupplyProcess()
{
	if(!bDemandSupplyProcessOpen)
	{
		document.getElementById('idDemandSupplyProcess').style.height=iUnitHeight;
		document.getElementById('idDemandSupplyProcess').style.width=iUnitWidth*2+iPadding;
	}else if(bDemandSupplyProcessOpen)
	{
		document.getElementById('idDemandSupplyProcess').style.height=iUnitHeight*2+iPadding;
		document.getElementById('idDemandSupplyProcess').style.width=iUnitWidth*2+iPadding;
	}
	document.getElementById('idDemandSupplyProcessContent').style.width=document.getElementById('idDemandSupplyProcess').style.width;	
	document.getElementById('idDemandSupplyProcessContent').style.height=parseInt(document.getElementById('idDemandSupplyProcess').style.height,10)-document.getElementById('idDemandSupplyProcessNav').clientHeight;	
	
	panelDemandSupplyProcess = panelDemandSupplyProcess!=null ? panelDemandSupplyProcess.size().update() : null;
}

function fShowProcessLinks(oNode)
{
	var oSelectedNodes=panelDemandSupplyProcess.graphics().selectAll(".ProcessLink")
		.filter(function(myNode){
					return myNode.iUserID==oNode.iUserID;
		});

	oSelectedNodes
		.attr("class", function(myNode){return "ProcessLink Selected";})
}

function fHideProcessLinks()
{
	panelDemandSupplyProcess.graphics().selectAll(".ProcessLink")
		.attr("class", function(myNode){return "ProcessLink "+myNode.sClass;})
}