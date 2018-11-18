function DrawSupplyDup()
{
	var iWidth=900;
	var iHeight=500;
	var sJSONLoc="data/GetSupplyDupData.php?iUserID=";
	var sContentLoc="";
	var sID="idSupplyDupChart";
	var iNodeID=0;
	
	var mySupplyDupTable;
	var myData;
		
	function Render(){}

	Render.newSupplyDup = function () {
		sJSONLoc=sJSONLoc+iNodeID;
				
		mySupplyDupTable = d3.select(sContentLoc).append("TABLE")
			.attr("id",sID)
			.attr("class","SupplyDupTable");

		d3.json(sJSONLoc).then(function(data) {
			myData=data;
			
			Render.update();
			
			if(myData!=null)
			{
				fUpdateDemandDup(myData[0]);
			}
		});

				
		return Render;
	};
	
	Render.update = function()
	{
		sColumns=["Employee","Overlap"];
		
		var myHeaders=mySupplyDupTable
			.append("THEAD")

		var myContent=mySupplyDupTable
			.append("TBODY");
			
		myHeaders.append("TR")
			.selectAll("TH")
			.data(sColumns).enter()
				.append('th')
				.text(function (myColumn) { return myColumn; });
		
		var myRows=myContent.selectAll("TR")
			.data(myData)
			.enter()
			.append("TR")
			.on("click",fUpdateDemandDup);

		myRows
			.append("TD")
			.text(function(myNode){return myNode.sLastname;});

		myRows
			.append("TD")
			.text(function(myNode){return myNode.iOverlapPercent;});
				
		return Render;
	}
	
	Render.remove = function()
	{
		d3.select("#"+sID).remove();
		return null;
	}
	
	Render.size = function()
	{
		var divLinksStyle=window.getComputedStyle(document.getElementById("idSupplyDup"), null);
		iWidth=parseFloat(divLinksStyle.getPropertyValue("width"));
		iHeight=parseFloat(divLinksStyle.getPropertyValue("height"));

		return Render;
	}
	
	Render.width = function(iValue) {
		if(!arguments.length) return iWidth;
		iWidth=iValue;
		return Render;
	};

	Render.height = function(iValue) {
		if(!arguments.length) return iHeight;
		iHeight=iValue;
		return Render;
	};

	Render.data = function(sValue) {
		if(!arguments.length) return sJSONLoc;
		sJSONLoc=sValue;
		return Render;
	};

	Render.canvas = function(sValue) {
		if(!arguments.length) return sContentLoc;
		sContentLoc=sValue;
		return Render;
	};

	Render.id = function(sValue) {
		if(!arguments.length) return sID;
		sID=sValue;
		return Render;
	};

	Render.filter = function(sValue) {
		if(!arguments.length) sFilter=null;
		sFilter=sValue;
		return Render;
	};
	
	Render.nodeid = function(iValue) {
		if(!arguments.length) return iNodeID;
		iNodeID=iValue;
		return Render;
	};

	return Render;
}