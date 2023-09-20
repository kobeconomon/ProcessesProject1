<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
  
    $stmt = $conn->prepare("SELECT FirstName, LastName, Email, PhoneNumber, ID FROM Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND Email LIKE ? AND PhoneNumber LIKE ? AND UserID LIKE ?");

    $firstName = "%" . $inData["firstName"] . "%";
    $lastName = "%" . $inData["lastName"] . "%";
    $email = "%" . $inData["email"] . "%";
    $phoneNumber = "%" . $inData["phoneNumber"] . "%";
    $id = $inData["id"];

    
    $stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber,$id);

    $stmt->execute();
    
    $result = $stmt->get_result();

    $searchResultsArray = array();

    while ($row = $result->fetch_assoc()) {
        $searchResultsArray[] = array(
            "FirstName" => $row["FirstName"],
            "LastName" => $row["LastName"],
            "Email" => $row["Email"],
            "PhoneNumber" => $row["PhoneNumber"],
            "ID" => $row["ID"]
        );
    }

    $searchResults = json_encode($searchResultsArray);

    if (count($searchResultsArray) == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}



function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults) {
    $retValue = '{"results":' . $searchResults . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
