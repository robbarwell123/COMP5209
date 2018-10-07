function MinMaxGlobalDiv(iState)
{
	if(iState==1)
	{
		document.getElementById("GLOBAL").style.width="30%";
		document.getElementById("GLOBAL").style.height="50%";
		
		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(2)");
	}else if(iState==2)
	{
		document.getElementById("GLOBAL").style.width="99%";
		document.getElementById("GLOBAL").style.height="99%";

		document.getElementById("GlobalMinMaxButton").setAttribute("onClick", "MinMaxGlobalDiv(1)");
	}
}