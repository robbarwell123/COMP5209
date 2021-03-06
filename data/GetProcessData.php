<?php	
	class Links
	{
		public $source;
		public $target;
		public $value;
	}
		
	class Nodes
	{
		public $iUserID;
		public $sLastname;
	}
	
	$config=include('Config.php');
	$iUserID=$_GET["iUserID"];	
		
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetProcessLinksA(?)");
		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		$arrLinks=array();
		$arrUsers=array();
		
		$arrSource=array();
		$arrTarget=array();
		
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oLink = new Links();
				$oLink->source=$myRow["iFromID"];
				$oLink->target=$myRow["iToID"];
				$oLink->value=$myRow["iSize"]>1 ? log($myRow["iSize"],2) : 1;
				array_push($arrLinks,$oLink);
				array_push($arrSource,$myRow["iFromID"]);
				array_push($arrTarget,$myRow["iToID"]);
			}
			
		}else
		{
			$arrLinks=null;
		}
		
		$myPrep->close();
		
		$myPrep=$myConnection->prepare("CALL GetProcessLinksB(?)");
		$myPrep->bind_param("i",$iUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oLink = new Links();
				$oLink->source=$myRow["iFromID"];
				$oLink->target=$myRow["iToID"];
				$oLink->value=$myRow["iSize"]>1 ? log($myRow["iSize"],2) : 1;
				array_push($arrLinks,$oLink);
				array_push($arrSource,$myRow["iFromID"]);
				array_push($arrTarget,$myRow["iToID"]);
			}
			
		}
		
		$myPrep->close();
		$arrUsers=array_unique(array_merge($arrSource,$arrTarget));			
		
		$myPrep=$myConnection->prepare("SELECT
			iUserID,
			sLastname
			FROM
				tbl_orgchart
			WHERE
				iUserID IN (".implode(",",$arrUsers).")
			ORDER BY
				iUserID
		");
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
				array_push($arrNodes,$oNode);
			}
			
			$arrUsers=array_unique($arrUsers);
		}else
		{
			$arrNodes=null;
		}

	}

	$oRtn = new stdClass();
	$oRtn->nodes=$arrNodes;
	$oRtn->links=$arrLinks;
	
	echo json_encode($oRtn);

	$myPrep->close();
	$myConnection->close();
?>