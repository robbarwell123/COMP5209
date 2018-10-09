<?php
	$sServer="localhost";
	$sUser="email";
	$sPassword="email";
	$sDB="email";

	$iUserID=$_GET["iUserID"];
	
	class User
	{
		public $iUserID;
		public $sUser;
		public $iEmailCount;
	}
		
	$myConnection=new mysqli($sServer, $sUser, $sPassword, $sDB);
	
	if($myConnection->connect_error)
	{
		die("Connection Failed: ".$myConnection->connect_error);
	}

	$myPrep=$myConnection->prepare("SELECT
			*
			FROM
				TBL_EMAIL_BY_USER
			WHERE
				iUserID IN (
					SELECT
						iUserID
						FROM
							orgchart
						WHERE
							iManager=
							(
								SELECT
									iManager
									FROM
										orgchart
									WHERE
										iUserID=?
							)
		)");

	$myPrep->bind_param("i",$iUserID);

	$myPrep->execute();
		
	$myResults=$myPrep->get_result();
	$arrPeers=array();

	if($myResults->num_rows > 0)
	{
		while($myRow=$myResults->fetch_assoc())
		{
			echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]." Emails: ".$myRow["iEmailCount"]."<BR>";
			$oUser = new User();
			$oUser->iUserID=$myRow["iUserID"];
			$oUser->sUser=$myRow["sUser"];
			$oUser->iEmailCount=$myRow["iEmailCount"];
			array_push($arrPeers,$oUser);
		}
	}else
	{
		$arrPeers=null;
	}

	echo json_encode($arrPeers);

	$myPrep->close();
	$myConnection->close();
?>