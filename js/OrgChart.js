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