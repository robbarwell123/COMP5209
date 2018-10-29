window.onload=fStartup;
window.onresize=fResize;

function fResize()
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	document.getElementById('idLinks').style.height=document.getElementById('idGridLinks').clientHeight-iPadding;
	document.getElementById('idLinks').style.width=document.getElementById('idGridLinks').clientWidth-iPadding;
	document.getElementById('idStats').style.height=document.getElementById('idGridStats').clientHeight-iPadding;
	document.getElementById('idStats').style.width=document.getElementById('idGridStats').clientWidth-iPadding;
	document.getElementById('idGlobal').style.height=document.getElementById('idGridGlobal').clientHeight-iPadding;
	document.getElementById('idGlobal').style.width=document.getElementById('idGridGlobal').clientWidth-iPadding;
}

function fStartup()
{
	fResize();

	var divContent=window.getComputedStyle(document.getElementById("idLinks"), null);
	var myUserLinks = DrawUserLinksChart().data("GetUserLinks.php?iUserID=").nodeid(4).width(parseFloat(divContent.getPropertyValue("width"))).height(parseFloat(divContent.getPropertyValue("height"))).canvas("#idLinks").draw();


	var divStats=window.getComputedStyle(document.getElementById("idStats"), null);
	var myUserPeers = DrawUserPeersChart().data("GetUserPeers.php?iUserID=").nodeid(4).width(parseFloat(divStats.getPropertyValue("width"))).height(parseFloat(divStats.getPropertyValue("height"))).canvas("#idStats").draw();

	var divGlobal=window.getComputedStyle(document.getElementById("idGlobalContent"), null);
	var myOrgChart = DrawOrgChart().data("GetOrgChart.php").canvas("#idGlobalContent").draw();	
}