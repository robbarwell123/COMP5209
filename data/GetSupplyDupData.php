<?php	
		
	class Nodes
	{
		public $iUserID;
		public $sLastname;
		public $iOverlapPercent;
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
				$oNode->sLastname=$myRow["sLastname"];
				$oNode->iOverlapPercent=$myRow["iOverlapPercent"];
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