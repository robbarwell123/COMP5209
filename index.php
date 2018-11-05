<HTML>
	<HEAD>
		<TITLE>Test</TITLE>

		<LINK rel="stylesheet" type="text/css" href="css/Layout.css">
		<LINK rel="stylesheet" type="text/css" href="css/Nav.css">
		<LINK rel="stylesheet" type="text/css" href="css/GlobalNav.css">
		<LINK rel="stylesheet" type="text/css" href="css/UserLinks.css">

		<SCRIPT src="https://d3js.org/d3.v5.min.js" charset="utf-8"></SCRIPT>
		<SCRIPT src="https://code.jquery.com/jquery-3.3.1.min.js"></SCRIPT>

		<SCRIPT src="js/DrawOrgChart.js"></SCRIPT>
		<SCRIPT src="js/GlobalNav.js"></SCRIPT>
		<SCRIPT src="js/OrgChart.js"></SCRIPT>

		<SCRIPT src="js/DrawUserPeers.js"></SCRIPT>

		<SCRIPT src="js/DrawUserLinks.js"></SCRIPT>

		<SCRIPT src="js/Layout.js"></SCRIPT>
		<SCRIPT src="js/History.js"></SCRIPT>
	</HEAD>
	<BODY>
		<DIV class="GridContainer">
			<DIV id="idGridNavBar" class="GridNavBar">
				<DIV id="idNavBar">
					<UL class="NavSite">
						<LI class="NavSite"><A href="#"><IMG src="img/menu.svg" width="16" height="16"></A></LI>
					</UL>
					<UL class="NavHistory">
						<LI class="NavHistory"><A href="default.asp">></A></LI>
						<LI class="NavHistory"><A><SELECT id="idHistoryList" onchange="fNavHistory(0)"></SELECT></A></LI>
						<LI class="NavHistory"><A href="default.asp"><</A></LI>
					</UL>
				</DIV>
			</DIV>
			<DIV id="idGridGlobal" class="GridGlobal">
				<DIV id="idGlobal" class="Panel">
					<DIV id='idGlobalNav'>
						<DIV class="LeftAlign">
							<IMG src="img/filter.svg" id='idGlobalFilterButton' width="16" height="16" onClick="DisplayFilter()" style="visibility: hidden">
							<DIV id="idGlobalFilter" class="GlobalFilter Panel" style="visibility: hidden">
								<DIV class="LeftAlign"><STRONG>Filters</STRONG></DIV>
								<DIV class="RightAlign"><IMG src="img/close.svg" width="16" height="16" onClick="DisplayFilter(1)"></DIV>

								<DIV id="idGlobalFilters">
									Emails (<SPAN id="idEmailFilterTitle">0</SPAN>)<BR>
									<INPUT type="range" min="0" max="10000" value="100" class="slider" id="idEmailFilter" onChange="doFilter()"><BR>
									Name<BR>
									<INPUT type="text" maxlength="30" id="idUserFilter" onkeyup="doFilter()"><BR>
								</DIV>
							</DIV>
							<IMG src="img/center.svg" id='idCenterButton' width="16" height="16" onClick="fCenterSelectedNode()">
							<IMG src="img/plus.svg" id='idExpandButton' width="16" height="16" onClick="fExpandOrgChart()">
							<IMG src="img/minus.svg" id='idCollapseButton' width="16" height="16" onClick="fCollapseOrgChart()">
						</DIV>
						<DIV class="RightAlign"><IMG src="img/expand.svg" id='GlobalMinMaxButton' width="16" height="16" onClick="MinMaxGlobalDiv()"></DIV>
					</DIV>
					<DIV id="idGlobalContent">
					</DIV>
				</DIV>
			</DIV>
			<DIV id="idGridStats" class="GridStats">
				<DIV id="idStats" class="Panel">
				</DIV>
			</DIV>
			<DIV id="idGridLinks" class="GridLinks">
				<DIV id="idLinks" class="Panel">
				<DIV id="idLinksHeader">Loading ...</DIV>
				</DIV>
			</DIV>
		</DIV>
		<SVG>
			<DEFS>
				<MARKER id="ArrowMarker"
					markerUnits="strokeWidth"
					refX="11" refY="2" 
					markerWidth="5" markerHeight="5"
					orient="auto">
					<PATH class="ArrowMarkerHead" d="M0,0 L0,4 L4,2 z"/>
				</MARKER>
			</DEFS>
		</SVG>
	</BODY>
</HTML>