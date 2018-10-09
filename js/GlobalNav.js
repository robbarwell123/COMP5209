function MinMaxGlobalDiv(iState)
{
	if(iState==1)
	{
		document.getElementById("GLOBAL").style.width="30%";
		document.getElementById("GLOBAL").style.height="50%";

		document.getElementById("GLOBAL_FILTER").style.width="0px";

		document.getElementById("GlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
		document.getElementById("GlobalFilterButton").style.visibility="hidden";
		
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(2)");
	}else if(iState==2)
	{
		document.getElementById("GLOBAL").style.width="calc(100% - 10px)";
		document.getElementById("GLOBAL").style.height="calc(100% - 10px)";

		document.getElementById("GLOBAL_CONTENT").style.width="100%";
		document.getElementById("GLOBAL_CONTENT").style.height="calc(100%-24px)";
		
		document.getElementById("GlobalFilterButton").style.visibility="visible";

		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(1)");		
	}
}

function DisplayFilter(iState)
{
	if(iState==1)
	{
		document.getElementById("GLOBAL_FILTER").style.width="0px";	
		
		document.getElementById("GlobalFilterButton").setAttribute("onClick", "DisplayFilter(2)");
	}else if(iState==2)
	{
		document.getElementById("GLOBAL_FILTER").style.width="200px";	
  
		document.getElementById("GlobalFilterButton").setAttribute("onClick", "DisplayFilter(1)");
	}	
}