var arrHistory=[];
var arrIHistory=[];
var lstHistory;

function fAddToHistory(oNode)
{
	arrHistory.push(oNode);
	arrIHistory.push(oNode.data.iUserID);
	var oHistoryEntry=document.createElement('option');
	oHistoryEntry.text=oNode.data.sLastname;
	oHistoryEntry.value=oNode.data.iUserID;
	lstHistory.add(oHistoryEntry);
}

function fNavHistory(iOption)
{
	if(iOption==0)
	{
		oNode=arrHistory[lstHistory.selectedIndex];
		fOpenParents(oNode);
		panelOrgChart=panelOrgChart.update(oNode);
		fRefocusNode(oNode);
		doFilter();
	}
}

function fOpenParents(oNode)
{
		if(oNode.depth>0)
		{
			if(oNode._children)
			{
				oNode.children=oNode._children;
				oNode._children=null;
			}
			fOpenParents(oNode.parent);
		}
}

function GetHistoryLinks()
{
	d3.json('GetHistory.php', {
	  method:"POST",
	  headers: {"Content-type": "application/json; charset=UTF-8"},
	  body: JSON.stringify({
		history: arrIHistory,
		covers: panelOrgChart.visibleNodes()
	  })
	}).then(function(data){
		d3.selectAll(".HistoryLinks").remove();
		
		if(data.error==0)
		{
			var arrMatch=data.results.split(",");
			for(var iConvert=0; iConvert<arrMatch.length; iConvert++) { arrMatch[iConvert] = +arrMatch[iConvert]; };

			var oSelectedNodes=d3.selectAll(".OrgChartNode")
			.filter(function(myNode){
				return arrMatch.indexOf(myNode.data.iUserID)>-1
			});
			
			var iCurr;
			oSelectedNodes.each(function(myNode){
				while ((iCurr = arrMatch.indexOf(myNode.data.iUserID, iCurr+1)) != -1)
				{
					arrMatch[iCurr]=(myNode.x)+","+(myNode.y);
				}				
			});
			
			for(var iDisplay=1;iDisplay<arrMatch.length;iDisplay++)
			{
				panelOrgChart.graphicsHistory()
					.append("g")
						.attr("class", "HistoryLinks")
					.append("path")
						.attr("d", "M" + arrMatch[iDisplay-1] + "L"+arrMatch[iDisplay])
						.attr("marker-end","url(#ArrowMarker)");
			}
		}
	});		
}