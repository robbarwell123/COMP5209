<HTML>
	<HEAD>
		<TITLE>Org Navigation</TITLE>
		<LINK href='css/orgnav.css' rel='stylesheet'>
		<SCRIPT src="https://d3js.org/d3.v3.min.js" charset="utf-8"></SCRIPT>
		<SCRIPT src="js/GlobalNav.js"></SCRIPT>
	</HEAD>
	<BODY>
		<DIV id='TOPBAR'>
			<UL class='main_nav'>
				<LI class="main_nav"><A href="default.asp">Home</A></LI>
				<LI class="main_nav"><A href="">Option 1</A></LI>
				<LI class="main_nav"><A href="">Option 2</A></LI>
				<LI class="main_nav"><A href="">Option 3</A></LI>
			</UL>
		</DIV>
		<DIV id='MAIN'>
			<DIV id='GLOBAL'>
				<DIV id='GLOBAL_OPTS'>
					<IMG src="img/icon_maximize.png" id='GlobalMinMaxButton' width="16" height="16" onClick="MinMaxGlobalDiv(2)">
				</DIV>
				<DIV id='GLOBAL_CONTENT'>
					<SCRIPT src="js/GlobalBoxver1.js"></SCRIPT>
				</DIV>
			</DIV>
			<DIV id='STATS'>Stats</DIV>
			<DIV id='CONTENT'>Main</DIV>
		</DIV>
	</BODY>
</HTML>
