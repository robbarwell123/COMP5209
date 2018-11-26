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
		.filter(function(myLink){
					return myLink.classid==oNode.classid;
		});

	oSelectedNodes
		.attr("class", function(myNode){return "ProcessLink Selected";})

	var oSelectedNodes=panelDemandSupplyProcess.graphics().selectAll(".ProcessNode")
		.filter(function(myNode){
					return myNode.data.iUserID==oNode.classid;
		});

	oSelectedNodes
		.attr("class", function(myNode){return "ProcessNode Selected";})

}

function fHideProcessLinks()
{
	panelDemandSupplyProcess.graphics().selectAll(".ProcessLink")
		.attr("class", function(myLink){return myLink.sUnique=="Multiple" ? "ProcessLink FlowThrough" : "ProcessLink Unique";});

	panelDemandSupplyProcess.graphics().selectAll(".ProcessNode")
		.attr("class", "ProcessNode");		
}