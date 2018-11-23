<?php	
		
	class Nodes
	{
		public $iUserID;
		public $sLastname;
		public $iOverlapPercent;
	}
	
	class Links
	{
		public $iSource;
		public $iTarget;
		public $iSize;
	}
	
	$config=include('Config.php');
	$iUserID=$_GET["iUserID"];	
		
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetOverlapByUser(?,".$config['iOverlapMin'].")");
		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		$arrNodes=array();
				
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oNode = new Nodes();
				$oNode->iUserID=$myRow["iUserID"];
				$oNode->sLastname=ucfirst($myRow["sLastname"]);
				$oNode->iOverlapPercent=$myRow["iOverlapPercent"];
				array_push($arrNodes,$oNode);
			}
		}else
		{
			$arrNodes=null;
		}
		
		$myPrep->close();
		
		$myPrep=$myConnection->prepare("CALL GetOverlapUser(?)");
		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
				
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oNode = new Nodes();
				$oNode->iUserID=$myRow["iUserID"];
				$oNode->sLastname=ucfirst($myRow["sLastname"]);
				$oNode->iOverlapPercent=$myRow["iOverlapPercent"];
				array_push($arrNodes,$oNode);
			}
		}
		
		$myPrep->close();		
		
		$arrLinks=array();
		for($iGetLinks=0;$iGetLinks<count($arrNodes);$iGetLinks++)
		{
			if($arrNodes[$iGetLinks]->iOverlapPercent>-2)
			{
				$myPrep=$myConnection->prepare("CALL GetOverlapLinks(?,?)");
				$myPrep->bind_param("ii",$iUserID,$arrNodes[$iGetLinks]->iUserID);

				$myPrep->execute();
					
				$myResults=$myPrep->get_result();

				if($myResults->num_rows > 0)
				{
					while($myRow=$myResults->fetch_assoc())
					{
						$oLink = new Links();
						$oLink->iSource=$myRow["intTarget"];
						$oLink->iTarget=$myRow["iUserID"];
						$oLink->iSize=$myRow["iTargetEmailCount"];
						array_push($arrLinks,$oLink);
					}
				}
				
				$myPrep->close();		
			}
		}
		
		$oRtn = new stdClass();
		$oRtn->nodes=$arrNodes;
		$oRtn->links=$arrLinks;
		
		echo json_encode($oRtn);
	}

	$myConnection->close();
?>