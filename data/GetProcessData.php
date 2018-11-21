<?php	
	class Links
	{
		public $source;
		public $target;
		public $value;
		public $iUserID;
		public $sClass;
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
		$myPrep=$myConnection->prepare("CALL GetProcessLinks(?)");
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
				$oLink->source=$myRow["iFromID"]==$iUserID ? "CURRUSER" : "S".$myRow["iFromID"];
				$oLink->target=$myRow["iToID"]==$iUserID ? "CURRUSER" : "T".$myRow["iToID"];
				$oLink->iUserID=$myRow["iToID"]==$iUserID ? $myRow["iFromID"] : $myRow["iToID"];
				$oLink->value=$myRow["iSize"]>1 ? log($myRow["iSize"],2) : 1;
				array_push($arrLinks,$oLink);
				array_push($arrSource,$myRow["iFromID"]);
				array_push($arrTarget,$myRow["iToID"]);
			}
			
			$arrUsers=array_unique(array_merge($arrSource,$arrTarget));
			
			foreach($arrLinks as $oLink)
			{
				if($oLink->source=="CURRUSER")
				{
					$sClass=in_array(intval(substr($oLink->target,1)),$arrSource) ? "FlowThrough" : "Unique";
				}else if($oLink->target=="CURRUSER")
				{
					$sClass=in_array(intval(substr($oLink->source,1)),$arrTarget) ? "FlowThrough" : "Unique";
				}
				$oLink->sClass=$sClass;
			}
		}else
		{
			$arrLinks=null;
		}
		
		$myPrep->close();
		
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
				if($myRow["iUserID"]<>$iUserID)
				{
					$oNode = new Nodes();
					$oNode->iUserID="S".$myRow["iUserID"];
					$oNode->sLastname=ucfirst($myRow["sLastname"]);
					array_push($arrNodes,$oNode);
					$oNode = new Nodes();
					$oNode->iUserID="T".$myRow["iUserID"];
					$oNode->sLastname=ucfirst($myRow["sLastname"]);
					array_push($arrNodes,$oNode);
				}else
				{
					$oNode = new Nodes();
					$oNode->iUserID="CURRUSER";
					$oNode->sLastname=ucfirst($myRow["sLastname"]);
					array_push($arrNodes,$oNode);
				}
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