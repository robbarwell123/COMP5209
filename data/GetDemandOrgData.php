<?php
	$iLevel=0;

	class User
	{
		public $sEmail;
		public $sLastname;
		public $iUserID;
		public $iLevel;
		public $iMySize;
		public $children;
	}
	
	function fBuildNode($iNodeID, $myPrepStatement, $iCurrLevel)
	{
		$GLOBALS['iLevel']=$iNodeID;
		$myPrepStatement->execute();
		
		$myResults=$myPrepStatement->get_result();
		$arrChildren=array();

		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
#				echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]."<BR>";
				$oUser = new User();
				$oUser->iUserID=$myRow["iUserID"];
				$oUser->sEmail=$myRow["sUser"];
				$oUser->sLastname=ucfirst($myRow["sLastname"]);
				$oUser->iLevel=$iCurrLevel;
				$oUser->iMySize=$myRow["iEmailCount"];
				$oUser->children=fBuildNode($myRow["iUserID"],$myPrepStatement,$iCurrLevel+1);
				array_push($arrChildren,$oUser);
			}
		}else
		{
			$arrChildren=null;
		}
		
		return $arrChildren;
	}
	
	$config=include('Config.php');

	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if($myConnection->connect_error)
	{
		die("Connection Failed: ".$myConnection->connect_error);
	}

	$myPrep=$myConnection->prepare("SELECT * FROM tbl_orgchart WHERE iManager=?");
	$myPrep->bind_param("i",$iLevel);
		
	echo json_encode(fBuildNode(0,$myPrep,1)[0]);

	$myPrep->close();
	$myConnection->close();
?>