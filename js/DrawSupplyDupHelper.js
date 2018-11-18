var panelDemandDup;
var oDupCompareNode;

function fUpdateDemandDup(myNode)
{
	oDupCompareNode=myNode;
	
	panelDemandDup = panelDemandDup!=null ? panelDemandDup.remove() : null;
	panelDemandDup = DrawDemandDup().sourcenodeid(oCurrNode.data.iUserID).targetnodeid(myNode.iUserID).size().canvas("#idDemandDup").newDemandDup();					
	
}