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

	if(!bGlobalOpen)
	{

		document.getElementById('idGlobal').style.height=document.getElementById('idGridGlobal').clientHeight-iPadding;
		document.getElementById('idGlobal').style.width=document.getElementById('idGridGlobal').clientWidth-iPadding;
	}else if(bGlobalOpen)
	{
		document.getElementById("idGlobal").style.width="calc(100% - "+iPadding+"px)";
		var linksStyle = getComputedStyle(document.getElementById("idGridLinks"));
		document.getElementById("idGlobal").style.height=parseInt(linksStyle.getPropertyValue('height'))-iPadding;
	}
}

function fStartup()
{
	fResize();

	var divGlobal=window.getComputedStyle(document.getElementById("idGlobalContent"), null);
	myOrgChart = DrawOrgChart().data("GetOrgChart.php").canvas("#idGlobalContent").draw();		

	fRefocusNode(iCurrNode);
}