<HTML>
	<HEAD>
		<TITLE>Org Navigation</TITLE>
		<LINK href='css/orgnav.css' rel='stylesheet'>
		<LINK href='css/OrgChart.css' rel='stylesheet'>
		<SCRIPT src="https://d3js.org/d3.v5.min.js" charset="utf-8"></SCRIPT>
		<SCRIPT src="https://code.jquery.com/jquery-3.3.1.min.js"></SCRIPT>
		<SCRIPT src="js/GlobalNav.js"></SCRIPT>
	</HEAD>
	<BODY>
		<DIV id='TOPBAR'>
			<UL class='main_nav'>
				<LI class="main_nav"><A href="default.asp">Menu</A></LI>
			</UL>
			<UL class='history_nav'>
				<LI class="history_nav"><A href="default.asp">></A></LI>
				<LI class="history_nav"><A><SELECT name="history"><OPTION>shapiro</OPTION></SELECT></A></LI>
				<LI class="history_nav"><A href="default.asp"><</A></LI>
			</UL>
		</DIV>
		<DIV id='MAIN'>
			<DIV id='GLOBAL'>
				<DIV id='GLOBAL_OPTS'>
					<DIV class="LeftAlign" id='FilterButton'>
						<IMG src="img/icon_filter.png" id='GlobalFilterButton' width="24" height="24" onClick="DisplayFilter(2)" style="visibility: hidden">
						<DIV id="GLOBAL_FILTER" class="SIDE_NAV">
						  <a href="javascript:void(0)" class="SIDE_NAV_CLOSE" onclick="DisplayFilter(1)">X</a>
						  <a href="#">Filter1</a>
						  <a href="#">Filter2</a>
						  <a href="#">Filter3</a>
						  <a href="#">Filter4</a>
						</DIV>
					</DIV>
					<DIV class="RightAlign"><IMG src="img/icon_maximize.png" id='GlobalMinMaxButton' width="24" height="24" onClick="MinMaxGlobalDiv(2)"></DIV>
				</DIV>
				<DIV id='GLOBAL_CONTENT'>
					<SCRIPT src="js/DrawOrgChart.js"></SCRIPT>
				</DIV>
			</DIV>
			<DIV id='STATS'>
				<SCRIPT src="js/DrawUserPeers.js"></SCRIPT>
			</DIV>
			<DIV id='CONTENT'>
				<DIV id='PERS_HEADER'>Selected Person: shapiro</DIV>
				<SCRIPT src="js/DrawUserLinks.js"></SCRIPT>
			</DIV>
		</DIV>
	</BODY>
</HTML>
