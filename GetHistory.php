<?php
	$data = json_decode(file_get_contents("php://input"), false);

	$config=include('Config.php');
	$iFindUserID=0;

	$arrHistory=$data->history;
	$arrVisibleNodes=$data->covers;

	$arrRtn=array();
	
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("SELECT * FROM tbl_orgchart WHERE iUserID=?");
		$myPrep->bind_param("i",$iFindUserID);

		for($iSearch=0;$iSearch<sizeOf($arrHistory);$iSearch++)
		{
			if(!in_array($arrHistory[$iSearch],$arrVisibleNodes))
			{
				$arrHistory[$iSearch]=fFindParent($arrHistory[$iSearch],$myPrep);
			}
		}
	}

	$myPrep->close();
	$myConnection->close();	
	
	$oRtn = new stdClass();
	$oRtn->error=0;
	$oRtn->results=implode(",",$arrHistory);
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