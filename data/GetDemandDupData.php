<?php	
		
	class Nodes
	{
		public $iSourceEmailCount;
		public $sLastname;
		public $iTargetEmailCount;
	}
	
	$config=include('Config.php');
	$iSourceUserID=$_GET["iSourceUserID"];	
	$iTargetUserID=$_GET["iTargetUserID"];	
		
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	if(!$myConnection->connect_error)
	{
		$myPrep=$myConnection->prepare("CALL GetOverlapChart(?,?)");
		$myPrep->bind_param("ii",$iSourceUserID,$iTargetUserID);

		$myPrep->execute();
			
		$myResults=$myPrep->get_result();
		$arrNodes=array();
				
		if($myResults->num_rows > 0)
		{
			while($myRow=$myResults->fetch_assoc())
			{
				$oNode = new Nodes();
				$oNode->iSourceEmailCount=$myRow["iSourceEmailCount"];
				$oNode->sLastname=$myRow["sLastname"];
				$oNode->iTargetEmailCount=$myRow["iTargetEmailCount"];
				array_push($arrNodes,$oNode);
			}
		}else
		{
			$arrNodes=null;
		}		
	}
	
	echo json_encode($arrNodes);

	$myPrep->close();
	$myConnection->close();
?>