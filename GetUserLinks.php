<?php
	class cNode
	{
		public $iNodeID;
		public $sNodeName;
		public $sNodeLastname;
		public $iNodeSize;
		public $children;
	}

	$config=include('Config.php');
	$iUserID=$_GET["iUserID"];	
		
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);

	$oTop = new cNode();
	$oTop->sNodeName="Test";
	$oTop->sNodeLastname="Test";
	$oTop->iNodeSize=0;
	$oTop->children=array();
	
	$arrDepts=array();
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetUserLinks(?)");

		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();

		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
	//			echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]." Emails: ".$myRow["iEmailCount"]."<BR>";
				$oUser = new cNode();
				$oUser->iNodeID=$myRow["iUserID"];
				$oUser->sNodeName=$myRow["sUser"];
				$oUser->sNodeLastname=$myRow["sLastname"];
				$oUser->iNodeSize=intval($myRow["iEmailCount"]);
				if(!array_key_exists($myRow["sDept"],$arrDepts))
				{
					$oDept = new cNode();
					$oDept->sNodeName=$myRow["sDept"];
					$oDept->sNodeLastname=$myRow["sDept"];
					$oDept->iNodeSize=0;
					$oDept->children=array();
					array_push($oTop->children,$oDept);
					$arrDepts[$myRow["sDept"]]=$oDept;
				}
				array_push($arrDepts[$myRow["sDept"]]->children,$oUser);
			}
		}else
		{
			$oTop=null;
		}
	}

	echo json_encode($oTop);

	$myPrep->close();
	$myConnection->close();
?>