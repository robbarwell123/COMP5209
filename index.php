<HTML>
	<HEAD>
		<TITLE>Decision Support for Organizational Change</TITLE>

		<SCRIPT src="https://d3js.org/d3.v5.min.js" charset="utf-8"></SCRIPT>
		<SCRIPT src="https://code.jquery.com/jquery-3.3.1.min.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/Global.css">


		<SCRIPT src="js/Layout.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/Layout.css">
		<SCRIPT src="js/Navigation.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/Navigation.css">
		<SCRIPT src="js/History.js"></SCRIPT>

		<SCRIPT src="js/DrawDemandOrg.js"></SCRIPT>
		<SCRIPT src="js/DrawDemandOrgHelper.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/SupplyOrg.css">
		<SCRIPT src="js/DrawSupplyOrg.js"></SCRIPT>

		<SCRIPT src="https://unpkg.com/d3-sankey@0"></SCRIPT>
		<SCRIPT src="js/DrawDemandSupplyProcess.js"></SCRIPT>
		<SCRIPT src="js/DrawDemandSupplyProcessHelper.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/SupplyDemandProcess.css">		
		
		<SCRIPT src="js/DrawSupplyDup.js"></SCRIPT>
		<SCRIPT src="js/DrawSupplyDupHelper.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/SupplyDup.css">		
		<SCRIPT src="js/DrawDemandDup.js"></SCRIPT>
		<LINK rel="stylesheet" type="text/css" href="css/DemandDup.css">		
		
	</HEAD>
	<BODY>
		<DIV class="GridContainer">
			<DIV id="idGridNavBar" class="GridNavBar">
				<DIV id="idNavBar" class="GridNavContainer">
					<DIV class="GridLeft">
						&nbsp;
						<IMG src="img/menu.svg" width="16" height="16" style="position: relative; top: -4px;" onclick="javascript:fDisplayMenu()">
						<DIV id="idMainMenuContent" style="visibility: hidden">
							<INPUT type="checkbox" id="idHistoryOption" checked onclick="javascript:fHistoryOption()">&nbsp;History
						</DIV>
						&nbsp;
						<SPAN class="Logo">DSOC</SPAN>
					</DIV>
					<DIV class="GridRight">
						<A class="NavLink" href="javascript:fNavHistory(1)"><</A>			
						<SELECT id="idHistoryList" class="NavDropDown" onchange="fNavHistory(0)"></SELECT>
						<A class="NavLink" href="javascript:fNavHistory(2)">></A>	
						&nbsp;
						&nbsp;
					</DIV>
				</DIV>
			</DIV>
			<DIV class="GridTitleDemand ColumnTitle">
			Demand
			</DIV>
			<DIV class="GridTitleSupply ColumnTitle">
			Supply
			</DIV>
			<DIV class="GridTitleOrg RowTitle">Organizational</DIV>
			<DIV id="idGridDemandOrg" class="GridDemandOrg">
				<DIV id="idDemandOrg" class="Panel">
					<DIV id='idDemandOrgNav'>
						<DIV class="GridNavContainer">
							<DIV class="GridLeft">
								<IMG src="img/filter.svg" id='idDemandOrgFilterButton' width="16" height="16" onClick="DisplayFilter()" style="visibility: hidden">
								<DIV id="idDemandOrgFilter" class="GlobalFilter Panel" style="visibility: hidden">
									<DIV class="GridNavContainer">
										<DIV class="GridLeft">
											<STRONG>Filters</STRONG>
										</DIV>
										<DIV class="GridRight">
											<IMG src="img/close.svg" width="16" height="16" onClick="DisplayFilter(1)">
										</DIV>
									</DIV>
									<DIV id="idDemandOrgFilters">
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
							<DIV class="GridRight">
								<IMG src="img/expand.svg" id='btnDemandOrgExpand' width="16" height="16" onClick="fDemandOrgOpenClose()">
							</DIV>
						</DIV>
					</DIV>
					<DIV id="idDemandOrgContent">
					</DIV>
				</DIV>
			</DIV>
			<DIV id="idGridSupplyOrg" class="GridSupplyOrg">
				<DIV id="idSupplyOrg" class="Panel">
				</DIV>
			</DIV>
			<DIV class="GridTitleProcess RowTitle">Process</DIV>
			<DIV id="idGridDemandSupplyProcess" class="GridDemandSupplyProcess">
				<DIV id="idDemandSupplyProcess" class="Panel">
					<DIV id="idDemandSupplyProcessNav" class="GridNavContainer">
						<DIV class="GridLeft">
						</DIV>
						<DIV class="GridRight">
							<IMG src="img/expand.svg" id='btnProcessExpand' width="16" height="16" onClick="fProcessOpenClose()">
						</DIV>
					</DIV>
					<DIV id="idDemandSupplyProcessContent">
					</DIV>
				</DIV>
			</DIV>
			<DIV id="idTitleDup" class="GridTitleDup RowTitle">Redundancy</DIV>
			<DIV id="idGridDemandDup" class="GridDemandDup">
				<DIV id="idDemandDup" class="Panel">
				</DIV>				
			</DIV>
			<DIV id="idGridSupplyDup" class="GridSupplyDup">
				<DIV id="idSupplyDup" class="Panel">
				</DIV>				
			</DIV>
			<DIV class="GridBlank"></DIV>
		</DIV>
	</BODY>
</HTML>