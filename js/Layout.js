var iDuration=750;

var panelOrgChart;

var clrNodeChildren;
var iPadding;

window.onload=fStartup;
window.onresize=fResize;
document.oncontextmenu = function() {return false;}

function fResize()
{
	iUnitWidth=document.getElementById('idGridSupplyOrg').clientWidth-iPadding;
	iUnitHeight=document.getElementById('idGridSupplyOrg').clientHeight-iPadding;
	
	fResizeDemandOrg();
	
	document.getElementById('idSupplyOrg').style.height=iUnitHeight;
	document.getElementById('idSupplyOrg').style.width=iUnitWidth;
	panelSupplyOrg = panelSupplyOrg!=null ? panelSupplyOrg.size().update() : null;

	fResizeDemandSupplyProcess();

	document.getElementById('idDemandDup').style.height=iUnitHeight;
	document.getElementById('idDemandDup').style.width=iUnitWidth;

	document.getElementById('idSupplyDup').style.height=iUnitHeight;
	document.getElementById('idSupplyDup').style.width=iUnitWidth;	
}

function fStartup()
{
	lstHistory = document.getElementById('idHistoryList');

	var appStyle = getComputedStyle(document.body);
	iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;
	clrNodeChildren = appStyle.getPropertyValue('--clrNodeChildren');

	fResize();
	
	panelOrgChart = DrawDemandOrg().canvas("#idDemandOrgContent").newOrgChart();					
}