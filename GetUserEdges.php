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
		public $children;
	}
		
	$myConnection=new mysqli($sServer, $sUser, $sPassword, $sDB);
	
	if($myConnection->connect_error)
	{
		die("Connection Failed: ".$myConnection->connect_error);
	}

	$myPrep=$myConnection->prepare("SELECT
		iUserID,
		sUser,
		SUM(iEmailCount) AS iEmailCount
		FROM
		(
			SELECT
				iFromID as iUserID,
				sFrom AS sUser,
				COUNT(sFrom) AS iEmailCount
				FROM
					reduced
				WHERE
					iToID=?
				GROUP BY
					sFrom
			UNION ALL
			SELECT
				iToID,
				sTo,
				COUNT(sTo) AS EmailCount
				FROM
					reduced
				WHERE
					iFromID=?
				GROUP BY
					sTo
		) AS USER_CONNECTIONS
		GROUP BY
			sUser
		ORDER BY
			sUser");

	$myPrep->bind_param("ii",$iUserID,$iUserID);

	$myPrep->execute();
		
	$myResults=$myPrep->get_result();
	$arrChildren=array();

	if($myResults->num_rows > 0)
	{
		while($myRow=$myResults->fetch_assoc())
		{
//			echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]." Emails: ".$myRow["iEmailCount"]."<BR>";
			$oUser = new User();
			$oUser->iUserID=$myRow["iUserID"];
			$oUser->sUser=$myRow["sUser"];
			$oUser->iEmailCount=$myRow["iEmailCount"];
			array_push($arrChildren,$oUser);
		}
	}else
	{
		$arrChildren=null;
	}

	$myPrep=$myConnection->prepare("SELECT
		*
		FROM
			orgchart
		WHERE
			iUserID=?");

	$myPrep->bind_param("i",$iUserID);

	$myPrep->execute();
		
	$myResults=$myPrep->get_result();

	$oUser=new User();
	if($myResults->num_rows > 0)
	{
		while($myRow=$myResults->fetch_assoc())
		{
//			echo "ID: ".$myRow["iUserID"]." Name: ".$myRow["sUser"]." Emails: "."<BR>";
			$oUser->iUserID=$myRow["iUserID"];
			$oUser->sUser=$myRow["sUser"];
			$oUser->iEmailCount=-1;
		}
	}	
	$oUser->children=$arrChildren;
	echo json_encode($oUser);

	$myPrep->close();
	$myConnection->close();
?>