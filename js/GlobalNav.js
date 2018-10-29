function MinMaxGlobalDiv(iState)
{
	var appStyle = getComputedStyle(document.body);
	var iPadding = (parseInt(appStyle.getPropertyValue('--iMargin'))+parseInt(appStyle.getPropertyValue('--iPadding'))+parseInt(appStyle.getPropertyValue('--iBorder')))*2;

	if(iState==1)
	{

		document.getElementById('idGlobal').style.height=document.getElementById('idGridGlobal').clientHeight-iPadding;
		document.getElementById('idGlobal').style.width=document.getElementById('idGridGlobal').clientWidth-iPadding;

		document.getElementById("idGlobalFilter").style.width="0px";

		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
		document.getElementById("idGlobalFilterButton").style.visibility="hidden";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(2)");
	}else if(iState==2)
	{
		document.getElementById("idGlobal").style.width="calc(100% - "+iPadding+"px)";
		var linksStyle = getComputedStyle(document.getElementById("idGridLinks"));
		document.getElementById("idGlobal").style.height=parseInt(linksStyle.getPropertyValue('height'))-iPadding;

		document.getElementById("idGlobalFilterButton").style.visibility="visible";
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(1)");		
	}
}

function DisplayFilter(iState)
{
	if(iState==1)
	{
		document.getElementById("idGlobalFilter").style.width="0px";	
		
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
	}else if(iState==2)
	{
		document.getElementById("idGlobalFilter").style.width="200px";	
  
		document.getElementById("idGlobalFilterButton").setAttribute("onClick", "DisplayFilter(1)");
	}	
}