var iDuration=750;

var panelOrgChart;

var clrNodeChildren;

window.onload=fStartup;
window.onresize=fResize;
document.oncontextmenu = function() {return false;}

function fResize()
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	document.getElementById('idSupplyOrg').style.height=document.getElementById('idGridSupplyOrg').clientHeight-iPadding;
	document.getElementById('idSupplyOrg').style.width=document.getElementById('idGridSupplyOrg').clientWidth-iPadding;
	panelSupplyOrg = panelSupplyOrg!=null ? panelSupplyOrg.size().update() : null;
	
	document.getElementById('idDemandSupplyProcess').style.height=document.getElementById('idGridDemandSupplyProcess').clientHeight-iPadding;
	document.getElementById('idDemandSupplyProcess').style.width=document.getElementById('idGridDemandSupplyProcess').clientWidth-iPadding;
	panelDemandSupplyProcess = panelDemandSupplyProcess!=null ? panelDemandSupplyProcess.size().update() : null;					

	if(!bGlobalOpen)
	{
		document.getElementById('idDemandOrg').style.height=document.getElementById('idGridDemandOrg').clientHeight-iPadding;
		document.getElementById('idDemandOrg').style.width=document.getElementById('idGridDemandOrg').clientWidth-iPadding;
	}else if(bGlobalOpen)
	{
		document.getElementById("idDemandOrg").style.width="calc(100% - "+iPadding+"px)";
		var linksStyle = getComputedStyle(document.getElementById("idGridSupplyOrg"));
		document.getElementById("idDemandOrg").style.height=parseInt(linksStyle.getPropertyValue('height'))-iPadding;
	}
}

function fStartup()
{
	lstHistory = document.getElementById('idHistoryList');
	fResize();

	var divGlobal=window.getComputedStyle(document.getElementById("idDemandOrgContent"), null);
	clrNodeChildren = divGlobal.getPropertyValue('--clrNodeChildren');
	
	panelOrgChart = DrawDemandOrg().canvas("#idDemandOrgContent").newOrgChart();					
}