function fExpandOrgChart()
{
	panelOrgChart = panelOrgChart.expand().update(oCurrNode);
	fRefocusNode(oCurrNode);	
	doFilter();	
}

function fCollapseOrgChart()
{
	panelOrgChart = panelOrgChart.collapse().update(oCurrNode);
	fRefocusNode(panelOrgChart.root());	
	doFilter();
}

bShowConnections=false;

function fShowConnections(oNode)
{
	bShowConnections=true;
	d3.json('GetOrgChartUserLinks.php', {
	  method:"POST",
	  headers: {"Content-type": "application/json; charset=UTF-8"},
	  body: JSON.stringify({
		iUserID: oNode.data.iUserID,
		covers: panelOrgChart.visibleNodes()
	  })
	}).then(function(data){		
		if(data.error==0)
		{
			var arrMatch=data.results.split(",");
			for(var iConvert=0; iConvert<arrMatch.length; iConvert++) { arrMatch[iConvert] = +arrMatch[iConvert]; };

			var oSelectedNode=d3.selectAll(".OrgChartNode")
			.filter(function(myNode){
				return arrMatch.indexOf(myNode.data.iUserID)>-1
			});

			if(bShowConnections)
			{
				oSelectedNode.each(function(oSelectNode){
					panelOrgChart.graphicsUserLinks()
						.append("g")
							.attr("class", "OrgChartUserLinks")
						.append("path")
							.attr("d", "M" + oNode.x + "," + oNode.y + "L"+oSelectNode.x +","+oSelectNode.y);
				});
			}
		}
	});		
}

function fHideConnections()
{
	bShowConnections=false;
	panelOrgChart.graphicsUserLinks().selectAll(".OrgChartUserLinks").remove();
}