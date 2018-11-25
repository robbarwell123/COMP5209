var panelSupplyDup;
var panelDemandDup;

function fShowNode(myNode,iIndex)
{
	panelSupplyDup.graphics().selectAll(".SupplyDupLinkShow")
		.attr("class","SupplyDupLinks");
	panelSupplyDup.navgraphics().selectAll(".SupplyDupNavLinksSelected")
		.attr("class","SupplyDupNavLinks")
			
	panelSupplyDup.graphics().selectAll("#SupplyDupLink"+myNode.iUserID)
		.attr("class","SupplyDupLinks SupplyDupLinkShow");	
	panelSupplyDup.navgraphics().selectAll("#DupNavLink"+myNode.iUserID)
		.attr("class","SupplyDupNavLinks SupplyDupNavLinksSelected")
}

function fHideNode(myNode,iIndex)
{
	panelSupplyDup.graphics().selectAll(".SupplyDupLinkShow")
		.attr("class","SupplyDupLinks");
	panelSupplyDup.navgraphics().selectAll(".SupplyDupNavLinksSelected")
		.attr("class","SupplyDupNavLinks")
}

function fClickNode(myNode,iIndex)
{
	if(myNode!=null)
	{
		oDupCompareNode=myNode;

		panelDemandDup = panelDemandDup!=null ? panelDemandDup.remove() : null;
		panelDemandDup = DrawDemandDup().sourcenodeid(oCurrNode.data.iUserID).targetnodeid(myNode.iUserID).size().canvas("#idDemandDup").newDemandDup();						
	}
}

function fChangeSupplyDupFilter(iFilter)
{
	panelSupplyDup.filter(iFilter).updateLinks();
	document.getElementById('idSupplyDupRangeFilterValue').innerHTML="("+iFilter+")";
}