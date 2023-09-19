<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from Contacts WHERE ID = ?");
		$stmt->bind_param("s", $inData["id"]);
		$stmt->execute();
		
		
		$stmt->close();
		$conn->close();
		returnWithInfo($inData["id"]);
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id )
	{
		$retValue = '{"DELETED: id":' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>