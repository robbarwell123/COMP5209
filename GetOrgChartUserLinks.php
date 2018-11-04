<?php
	$data = json_decode(file_get_contents("php://input"), false);

	$config=include('Config.php');
	$iFindUserID=0;

	$iUserID=$data->iUserID;
	$arrVisibleNodes=$data->covers;

	$arrRtn=array();
	
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetUserLinks(?)");

		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		$arrMatches=array();
		
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				array_push($arrMatches,$myRow["iUserID"]);
			}
		}
		$myPrep->close();
		
		$arrRtn=array_intersect($arrMatches,$arrVisibleNodes);
		
		$arrFindParents=array_diff($arrMatches,$arrVisibleNodes);

		$myPrep=$myConnection->prepare("SELECT * FROM tbl_orgchart WHERE iUserID=?");
		$myPrep->bind_param("i",$iFindUserID);
		
		$arrParents=array();
		foreach($arrFindParents as $iSearchVal)
		{
			array_push($arrParents,fFindParent($iSearchVal,$myPrep));
		}
		
		$arrRtn=array_unique(array_merge($arrParents,$arrRtn));
	}

	$myPrep->close();
	$myConnection->close();	
	
	$oRtn = new stdClass();
	$oRtn->error=0;
	$oRtn->results=implode(",",$arrRtn);
	echo json_encode($oRtn);

	function fFindParent($iNodeID,$myPrepStatement)
	{
		$GLOBALS['iFindUserID']=$iNodeID;
		$myPrepStatement->execute();
		
		$myResults=$myPrepStatement->get_result();
		$iVisibleNode=0;
		
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				if(in_array($myRow["iManager"],$GLOBALS['arrVisibleNodes']))
				{
					$iVisibleNode=$myRow["iManager"];
				}else
				{
					$iVisibleNode=fFindParent($myRow["iManager"],$myPrepStatement);
				}
			}
		}
		
		return $iVisibleNode;
	}

?>