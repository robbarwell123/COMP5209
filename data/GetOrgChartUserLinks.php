<?php
	$config=include('Config.php');
	$iUserID=$_GET["iUserID"];	

	$arrRtn=array();
	
	$myConnection=new mysqli($config['sDBServer'], $config['sDBUser'], $config['sDBPassword'], $config['sDBName']);
	
	$arrNodes=[];
	
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
				$oNode=new stdClass;
				$oNode->iUserID=$myRow["iUserID"];
				$oNode->iEmailCount=$myRow["iEmailCount"];
				array_push($arrNodes,$oNode);
			}
		}
		$myPrep->close();
	}

	$myConnection->close();	
	
	echo json_encode($arrNodes);

?>