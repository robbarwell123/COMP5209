<?php
	$data = json_decode(file_get_contents("php://input"), false);

	$config=include('Config.php');
	$iFindUserID=0;
	
	$arrVisibleNodes=$data->covers;
	$iEmailFilterVal=$data->filters->iEmails;
	$sUserFilterVal="%".$data->filters->sUser."%";

	$arrRtn=array();
	
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("SELECT * FROM tbl_orgchart WHERE iEmailCount>=? AND sUser LIKE ?");

		$myPrep->bind_param("is",$iEmailFilterVal,$sUserFilterVal);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		$arrMatches=array();
		
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
//				echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]." Emails: ".$myRow["iEmailCount"]."<BR>";
				array_push($arrMatches,$myRow["iUserID"]);
			}
		}
		
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
		
	echo json_encode($arrRtn);

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