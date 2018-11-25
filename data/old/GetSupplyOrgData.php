<?php	
	class User
	{
		public $iUserID;
		public $sUser;
		public $sLastname;
		public $iEmailCount;
	}
		
	$config=include('Config.php');
	$iUserID=$_GET["iUserID"];	
		
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	$arrPeers=array();
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetUserPeers(?)");

		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();

		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oUser = new User();
				$oUser->iUserID=$myRow["iUserID"];
				$oUser->sUser=$myRow["sUser"];
				$oUser->sLastname=ucfirst($myRow["sLastname"]);
				$oUser->iEmailCount=$myRow["iEmailCount"];
				array_push($arrPeers,$oUser);
			}
		}else
		{
			$arrPeers=null;
		}
	}

	$oRtn = new stdClass();
	$oRtn->iUserID=0;
	$oRtn->sUser="Return";
	$oRtn->sLastname="Return";
	$oRtn->iEmailCount=0;
	$oRtn->children=$arrPeers;
	
	echo json_encode($oRtn);

	$myPrep->close();
	$myConnection->close();
?>